监听元素拖拽文件事件，并返回所有文件和目录树

[中文文档](https://github.com/JakeLaoyu/drag-file-listener/blob/master/README.zh-CN.md) | [Englist doc](https://github.com/JakeLaoyu/drag-file-listener/blob/master/README.md)

## 安装

```sh
yarn add drag-file-listener
```

## 使用

```js
import Drag from 'drag-file-listener'

const drager = new DragLitener({
  selector: document.querySelector('.drag'),
  drop: ({ file, filesTree }) => {}
})
```

## 参数

| props    | must | type     | default | description                                                   |
| -------- | ---- | -------- | ------- | ------------------------------------------------------------- |
| selector | true | element  | -       | 需要监听的元素                                                |
| drop     | true | function | -       | deop事件，返回文件和目录树 `function({ files, filesTree }){}` |

### filesTree

```json
[{
  "name": "文件夹名称",
  "fullPath": "路径",
  "chileren": [],  //子文件夹
  "files":  [],  //当前文件夹下文件
}]
```