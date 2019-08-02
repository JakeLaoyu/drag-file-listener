The listener element drags and drops into the file and returns the file and directory tree

[中文文档](https://github.com/JakeLaoyu/drag-file-listener/blob/master/README.zh-CN.md) | [Englist doc](https://github.com/JakeLaoyu/drag-file-listener/blob/master/README.md)

## DEMO

[codesandbox](https://codesandbox.io/s/drag-file-listener-demo-vlu55)

## Installation

```sh
yarn add drag-file-listener
```

## Using

```js
import Drag from 'drag-file-listener'

const drager = new DragLitener({
  selector: document.querySelector('.drag'),
  drop: ({ file, filesTree }) => {}
})
```

## option

| props    | must | type     | default | description                                                                    |
| -------- | ---- | -------- | ------- | ------------------------------------------------------------------------------ |
| selector | true | element  | -       | listen element                                                                 |
| drop     | true | function | -       | drop event, get the file and directory tree `function({ files, filesTree }){}` |

* filesTree

```js
[{
  "name": "文件夹名称",
  "fullPath": "路径",
  "chileren": [],  //子文件夹
  "files":  [],  //当前文件夹下文件
}]
```

## Instance Methods

* remove listener

```js
drager.removeListener()
```

* add listener

```js
drager.addListener()
```