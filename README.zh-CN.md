监听元素拖拽文件事件，并返回所有文件和目录树

![](https://img.shields.io/bundlephobia/minzip/drag-file-listener)

[中文文档](https://github.com/JakeLaoyu/drag-file-listener/blob/master/README.zh-CN.md) | [Englist doc](https://github.com/JakeLaoyu/drag-file-listener/blob/master/README.md)

## DEMO

[codesandbox](https://codesandbox.io/s/drag-file-listener-demo-vlu55)

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
| drop     | true | function | -       | deop事件，返回文件和目录树 <br/> `function({ files, filesTree }){}` |

* filesTree

```js
[{
  "name": "文件夹名称",
  "fullPath": "路径",
  "chileren": [],  //子文件夹
  "files":  [],  //当前文件夹下文件
}]
```

## 实例方法

* 移除事件监听

```js
drager.removeListener()
```

* 添加事件监听

```js
drager.addListener()
```