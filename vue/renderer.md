### Vue 渲染器的设计 (上)

在 vue 中，“渲染器”的作用是将虚拟 DOM 渲染为特定平台的真实元素，渲染的过程如下

![](./img/render-pipeline.03805016.png)

可以看到，模板会被编译成“渲染函数”代码，然后返回一个虚拟的 DOM 树，最终这个虚拟的 DOM 树会被挂载在真实的 DOM 上

先来看第一步
```html
<template>
  <div>{{ text }}</div>
</template>
```

上面的模板代码会被编译成类似如下的渲染函数，这一步通常在构建步骤提前预编译完成或者运行的时候编译
```js
renderer(`<div>${text}</div`, document.getElementById("app"));
```

然后会跟踪收集依赖，当响应式变量变化时重新执行渲染函数

```js
const text = "hello";
effect({
  renderer(`<div>${text}</div`, document.getElementById("app"));
})
```

这就是渲染器和响应式系统的结合使用，但是通常渲染器不会这么简单，vue 中由专门的生成渲染器的函数 `createRenderer`
在讨论渲染器函数之前，首先需要明确两个概念
1. mount 也就是挂载，将虚拟 DOM 节点挂载到真实的 DOM 元素上
2. patch 也就是打补丁，比较新的节点和旧的结点，并且更新变更的地方



```js
function render(vnode, container) {
  if(vnode) {
    patch(container._vnode, vnode, container)
  }
}
```

当新的 vnode 存在时，就把旧的 vnode 一起传给`patch`函数，这里的 container 就是挂载点

```js
function render(vnode, container) {
  if(vnode) {
    // 新的 vnode 存在说明是 mount 或者 patch 操作
    patch(container._vnode, vnode, container)
  }else {
    // 新的 vnode 不存在，说明是卸载操作
    container.innerHTML = "";
  }
  // 更新旧的 vnode
  container._vnode = vnode;
}
```

从这段代码可以看出，渲染函数的核心在于 patch 函数，它会执行 mount 和 patch 两个操作，如果旧的 vnode(`container._vnode`) 不存在，那么他会执行 mount 操作，否则会执行 patch 操作


#### 自定义渲染器

上述所有代码都只能将 vnode 渲染到浏览器真实的 DOM 中，那么怎么设计一个更为通用的渲染函数呢，从而摆脱浏览器的限制，不依赖于具体的浏览器 API。Vue 的做法是将那些用到的特定 API 抽离出来，提供可以配置这些 API 的接口这里可以参考 vue 文档中，**自定义渲染器函数**部分

那么，渲染函数会用到那些特定的 API 呢？需要从一个简单的例子看起

```js
const vnode = {
  type: 'h1',
  children: "hello"
}

// 创造一个渲染器
const renderer = createRenderer();
// 渲染 vnode
renderer.render(vnode, document.querySelector('#app'))
```
这里渲染的是一个普通标签，他的子节点是一个文本结点
```js
function createRenderer() {
  patch(old_node, new_node, container) {
   if(old_node) {
    // 打补丁...
   } else {
    // 挂载
    mountElement(vnode, container);
   }
  }

  render(vnode, container){
    if(vnode) {
      patch(container._vnode, vnode, container);
    } else {
      container.innerHTML = "";
    }
  }
  return {
    render
  }
}
```

```js

// mountElement 函数依赖了浏览器的 API
function mountElement (vnode, container) {
  const element = createElement(vnode.type);
  if(typeof vnode.children.type === "string") {
    element.textContent = vnode.children;
  } else {
    // ...
  }

  container.appendChild(element);
}
```

这里补充了 patch 的实现，可以看到当旧结点没有的时候，patch 会执行挂载操作，分析一下可知，这里的挂载函数 `mountElement` 会用到浏览器`document.createElement`，而设置文本子节点会用到 Element.textContent，最用调用`appendChild`将新建的元素添加到容器元素中，这些操作大量的依赖了浏览器的 API，因此可以作为配置项提供给用户，从而保证渲染函数的通用性

```js
// options 用于自定义渲染器
const renderer = createRenderer(options);
```

#### 挂载和更新

之前的例子只谈到了 vnode.children 是字符串的情况，除了这种情况，vnode.children 还可能是数组
```js
const vnode = {
  type: "p",
  children: [
    {
      type: "span",
      children: "hello"
    }
  ]
}
```

这种情况就需要再挂载的时候判断一下 vnode.children 是否为数组，如果是数组则进行递归挂载
```js
function createRender () {
  function mountElement (vnode, container) {
    const elemnet = createElement(vnode.type);
    // 文本子节点
    if(typeof vnode.children === "string") {
      element.textContent = vnode.children;
    } else if(Array.isArray(vnode.children)) {
      patch(null, child, element);
    }
    insert(element, container);
  }
}

```

目前为止，只进行了生成 DOM 元素和设置 DOM 元素文本操作，而 vnode 上的所有属性没有进行设置，在设置属性之前，有必要了解一下 HTML attributes 和 DOM properties 之前的区别

1. 设置在 HTML attribute 上的值，是作为 DOM properties 的初始值
2. 存在 DOM properties 不一定存在对应的 HTML attributes 例如能够设置 textContent 但是没有对应的 html attributes
3. 

像类似这种的标签，在 vue 组件中需要 vue 进行
关于 DOM properties 和 HTML attributes

