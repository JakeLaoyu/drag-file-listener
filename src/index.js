class Drag {
  constructor (options) {
    if (!options.selector) {
      throw new Error('selector is must')
    }
    this.selector = options.selector
    this.drop = options.drop

    this.files = []
    this.filesTree = []

    this.currentDirObj = {} // path -> dirObj
    this.readingDirPath = new Set()
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

  async readFileFinish () {
    const getFilesPromiseArr = []
    Object.keys(this.currentDirObj).forEach(async path => {
      getFilesPromiseArr.push(new Promise(resolve => {
        Promise.all(this.currentDirObj[path].files).then(files => {
          this.currentDirObj[path].files = files
          this.files = this.files.concat(files)
          resolve()
        })
      }))
    })
    await Promise.all(getFilesPromiseArr)
    this.returnFile()
  }

  async returnFile () {
    // 回调
    this.drop({
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
    this.checkHasReadingDir()
  }

  // readEntries 每次最多返回100个，需要重复调用
  // https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryReader/readEntries
  readerEntries (dirReader, dir) {
    this.addReadingDir(dir)
    dirReader.readEntries(entries => {
      for (var i = 0; i < entries.length; i++) {
        this.traverseFileTree(entries[i])
      }
      if (entries.length) {
        this.readerEntries(dirReader, dir)
      } else {
        this.deleteReadingDir(dir)
      }
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
      this.readerEntries(dirReader, item)
    }
  }

  createDirObj (dir) {
    const { fullPath, name } = dir
    let parentPath = fullPath.replace(name, '')
    if (parentPath.length !== 1) {
      parentPath = parentPath.substring(0, parentPath.length - 1)
    }

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

  addReadingDir (dir) {
    if (!this.readingDirPath.has(dir.fullPath)) this.readingDirPath.add(dir.fullPath)
  }

  deleteReadingDir (dir) {
    if (this.readingDirPath.has(dir.fullPath)) this.readingDirPath.delete(dir.fullPath)
    this.checkHasReadingDir()
  }

  checkHasReadingDir () {
    if (this.readingDirPath.size === 0) this.readFileFinish()
  }

  preventDefault (e) {
    e.preventDefault()
    e.stopPropagation()
  }
}

export default Drag
