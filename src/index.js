class Drag {
    constructor(options) {
        this.dom = options.dom
        this.callback = options.callback
        this.$vm = options.$vm
        this.filesPromiseFun = []
        this.bindDrag()
    }

    bindDrag() {
        this.dom.addEventListener('drop', this.dragHandler.bind(this))
        this.dom.addEventListener('dragenter', this.preventDefault)
        this.dom.addEventListener('dragover', this.preventDefault)
        this.dom.addEventListener('dragleave', this.preventDefault)
    }

    async dragHandler(e) {
        e.preventDefault()
        e.stopPropagation()
        if (this.$vm.$isIE) {
            this.$vm.$message.warning('请使用最新版Chrome 或 firefox 或 Edge浏览器')
            return
        }
        var items = e.dataTransfer.items
        for (var i = 0; i < items.length; i++) {
            var item = items[i].webkitGetAsEntry()
            if (item) {
                this.traverseFileTree(item)
            }
        }
        const files = await Promise.all(this.filesPromiseFun)
        this.filesPromiseFun = []
        // 回调
        this.callback(files)
    }

    traverseFileTree(item) {
        if (item.isFile) {
            if (item.name.charAt(0) === '.') return
            this.filesPromiseFun.push(new Promise(resolve => {
                item.file(file => {
                    resolve(file)
                })
            }))
        } else if (item.isDirectory) {
            this.$vm.$message.warning('禁止上传文件夹，请选择文件')
        }
    }

    preventDefault(e) {
        e.preventDefault()
        e.stopPropagation()
    }
}

export default Drag
