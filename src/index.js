import debounce from 'lodash/debounce'

class Drag {
  constructor (options) {
    if (!options.selector) {
      throw new Error('selector is must')
    }
    this.selector = options.selector
    this.callback = options.callback
    this.debounceHandleCheck = debounce(this.returnFile, 300)
    this.debounceReadFileFinish = debounce(this.readFileFinish, 300)
    this.files = []
    this.filesTree = []

    this.currentDirObj = {} // path -> dirObj
    this.bindDrag()
    this.initData()
  }

  initData () {
    this.currentDirObj = {}
    this.filesTree = []
    this.files = []
    this.createDirObj({
      name: '',
      fullPath: '/'
    })
  }

  bindDrag () {
    this.selector.addEventListener('drop', this.dragHandler.bind(this))
    this.selector.addEventListener('dragenter', this.preventDefault)
    this.selector.addEventListener('dragover', this.preventDefault)
    this.selector.addEventListener('dragleave', this.preventDefault)
  }

  readFileFinish () {
    Object.keys(this.currentDirObj).forEach(async path => {
      this.currentDirObj[path].files = await Promise.all(this.currentDirObj[path].files)
      this.files = this.files.concat(this.currentDirObj[path].files)
      this.debounceHandleCheck()
    })
  }

  async returnFile () {
    // 回调
    this.callback({
      files: this.files,
      filesTree: this.filesTree
    })
    this.initData()
  }

  dragHandler (e) {
    e.preventDefault()
    e.stopPropagation()
    var items = e.dataTransfer.items
    for (var i = 0; i < items.length; i++) {
      var item = items[i].webkitGetAsEntry()
      if (item) {
        this.traverseFileTree(item)
      }
    }
  }

  // readEntries 每次最多返回100个，需要重复调用
  // https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryReader/readEntries
  readerEntries (dirReader) {
    dirReader.readEntries(entries => {
      for (var i = 0; i < entries.length; i++) {
        this.traverseFileTree(entries[i])
      }
      if (entries.length) this.readerEntries(dirReader)
    })
  }

  traverseFileTree (item) {
    if (item.isFile) {
      const { fullPath, name } = item

      if (name.charAt(0) === '.') return // 排除隐藏文件

      let parentPath = fullPath.replace(name, '')
      if (parentPath.length !== 1) {
        parentPath = parentPath.substring(0, parentPath.length - 1)
      }

      this.currentDirObj[parentPath].files.push(new Promise(resolve => {
        item.file(file => {
          resolve(file)
        })
      }))
    } else if (item.isDirectory) {
      this.createDirObj(item)

      var dirReader = item.createReader()
      this.readerEntries(dirReader)
    }
    this.debounceReadFileFinish()
  }

  createDirObj (dir) {
    const { fullPath, name } = dir
    const parentPath = fullPath.replace(name, '')

    if (this.currentDirObj[fullPath]) return

    const dirObj = {
      name,
      fullPath,
      children: [],
      files: []
    }

    if (fullPath.length === 1) {
      this.filesTree.push(dirObj)
    }
    this.currentDirObj[fullPath] = dirObj
    const parent = this.currentDirObj[parentPath]
    name && parent && parent.children.push(dirObj)
  }

  preventDefault (e) {
    e.preventDefault()
    e.stopPropagation()
  }
}

export default Drag
