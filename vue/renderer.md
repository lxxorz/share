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
const text = ref("hello");
effect(() => {
  renderer(`<div>${text}</div`, document.getElementById("app"));
})
```

这就是渲染器和响应式系统的结合使用，但是通常渲染器不会这么简单，vue 中由专门的生成渲染器的函数 `createRenderer`
在讨论渲染器函数之前，首先需要明确两个概念

1. mount 也就是挂载，将虚拟 DOM 节点挂载到真实的 DOM 元素上
2. patch 也就是打补丁，比较新的节点和旧的结点，并且更新变更的地方

mount 和 patch 之间的唯一区别在于，挂载的时候没有旧的节点需要被卸载

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

上述所有代码都只能将 vnode 渲染到浏览器真实的 DOM 中，那么怎么设计一个更为通用的渲染函数呢，从而摆脱浏览器的限制，不依赖于具体的浏览器 API。Vue 的做法是将那些用到的特定 API 抽离出来，提供可以配置这些 API 的接口这里可以参考 vue 文档中，[**自定义渲染器函数**](https://vuejs.org/api/custom-renderer.html)部分，vue 在[@vue/rumtime-dom](https://github.com/vuejs/core/tree/8772a01a9280b1591e781e20741d32e2f9a836c8/packages/runtime-dom)中也是实现了 DOM 的[渲染 API](https://github.com/vuejs/core/blob/8772a01a9280b1591e781e20741d32e2f9a836c8/packages/runtime-dom/src/nodeOps.ts)

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

对应的，可以把这些操作封装成函数，作为配置项

* `document.createElement`封装成`createElement(node_type)`函数
* 设置`el.textContent`封装成`setElementText(el, text)`函数
* ...


然后将配置项 `options` 作为参数传递给生成渲染器的函数

```js
const renderer = createRenderer(options);
```

#### 挂载和更新

之前的例子只谈到了 vnode.children 是字符串的情况，除了这种情况，vnode.children 还可能是数组，其中包含其他 vnode 节点，这样的树形结构就构成了虚拟的 DOM 树
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

为了处理 vnode.children 是 vnode 节点的情况，就需要在挂载的时候判断 vnode.children 是否为数组，如果是数组则进行递归挂载，实现如下

```js
function createRender () {
  function mountElement (vnode, container) {
    const element = createElement(vnode.type);
    // 文本子节点
    if(typeof vnode.children === "string") {
      setElementText(element, vnode.children);
    } else if(Array.isArray(vnode.children)) {
      patch(null, child, element);
    }
    insert(element, container);
  }
}
```
注意这里的 patch 传递的值为`null`，这是因为挂载节点之前没有旧的 vnode


#### 设置节点属性

目前为止，只进行了生成 DOM 元素和设置 DOM 元素文本操作，而 vnode 上的属性没有进行设置，在设置属性之前，有必要了解一下 HTML attributes 和 DOM properties 之前的区别

理想情况下 DOM 和 HTML 标签的属性应该是一一对应的，每一个 html 标签上的 attribute 都应该和 DOM 上的 property 相同，如果标签`<input id="foo">`那么`el.id`应该也是`'foo'` 也就是说在 DOM 和标签上的属性名以及属性值值都必须一样

但是还是在以下几种情况还是会存在 DOM 和 html 属性不一致的情况

* 属性名不一致，在标签上的属性，不一定在 DOM 里面有，在 DOM 里面的属性，在标签上不一定有，比如在标签上存在 `aria-*`的属性，但是在 DOM 没有，在 DOM 对应中存在的属性 `textContent` 在 HTML 中没有

* 值不一致，设置在 HTML attribute 上的值，是作为 DOM properties 的初始值，通过`getAttribute(attributeName)`拿到的是初始值，另外通过 setAttribute 设置设置属性时对于`boolean`值也有预期的结果不一样


```js
el.getAttribute("value"); // ""
el.value // "hello"

el.setAttribute("disabled", false); // true
el.disabled // true
```

这里使用 setAttribute 设置了 el.disabled 的值为 false，但是反直觉的是：并没有将 disabled 设置为 false，反而将 el.disabled 的值设置为 true，这是因为 disabled 本身是个 boolean 类型的变量，setAttribute 时，false 会被转换为 `'false'`,然后转换为 boolean

因此对于这种 boolean 类型的变量也要做处理

```js
function mountElement(vnode, container) {
 const el = createElement(vnode.type)
 // 省略 children 的处理

 if (vnode.props) {
  for (const key in vnode.props) {
    const value = vnode.props[key]
    // 使用 shouldSetAsProps 函数判断是否应该作为 DOM Properties
    if (shouldSetAsProps(el, key, value)) {
      const type = typeof el[key]
      if (type === 'boolean' && value === '') {
        el[key] = true
      } else {
        el[key] = value
      }
    } else {
      el.setAttribute(key, value)
    }
  }
 }

  insert(el, container)
}


function shouldSetAsProps(el, key, value) {
  if(key === "form" && el.tagName === "INPUT")
    return false;
  return key in el;
}

```
这里处理的思路是优先设置 DOM property,

这里也需要把属性的设置变成平台无关，作为配置项传递给`createRenderer()`
```js
createRenderer({
  patchProps(el, key, value) {
    // 使用 shouldSetAsProps 函数判断是否应该作为 DOM Properties
    if (shouldSetAsProps(el, key, value)) {
      const type = typeof el[key]
      if (type === 'boolean' && value === '') {
        el[key] = true
      } else {
        el[key] = value
      }
    } else {
      el.setAttribute(key, value)
    }
  }
})
```

以上保证了正确设置vnode.props,但除此以外对于class，event等特殊props还要做处理

在vue当中对于标签或者自定义组件上的class属性而言，一般有两种形式
```html
<input class="foo" />
```
或者绑定一个对象
```html
<input :class="{foo: true}">
```
因此，在将vnode渲染到DOM中时，需要对class做统一化处理
vue从模板中生成的代码可以看到，`_normalizeClass`就是这个处理的函数
```js
const _hoisted_1 = /*#__PURE__*/_createElementVNode("div", {
  class: /*#__PURE__*/_normalizeClass({foo: true})
}, "foo", -1 /* HOISTED */)
```

除了class需要提前处理之外，在vue中，事件也是一个特殊的属性，怎么才能把事件添加到DOM上呢？在vnode中，约定以**on**开头的属性视作事件，

```js
const vnode = {
  props: {
    onClick: () => {alert("click")}
  }
}
```
在patchProps设置DOM属性时，调用addEventListener绑定事件即可
```js
function createRenderer() {
  function patchProps(el,key,preValue, nextValue, container) {
    if(/^on/.test(key)) {
      const name = key.slice(2).toLowerCase();
      // 绑定事件
      el.addEventListener(name, nextValue);
    }else if(key == "class") {
      //...
    }else if(shouldSetAsProps(el, key, nextValue)) {
      //...
    }
  }
}
```
既然设置了事件，那么我们如何更新绑定的事件呢,简单的做法就是移除之前的事件监听器，然后绑定新的事件侦听器

```js
function createRenderer() {
  function patchProps(el,key,preValue, nextValue, container) {
    if(/^on/.test(key)) {
      const name = key.slice(2).toLowerCase();
      // 移除之前的事件
      preValue && el.removeEventListener(name, preValue);
      // 绑定事件
      nextValue && el.addEventListener(name, nextValue);
    }else if(key == "class") {
      //...
    }else if(shouldSetAsProps(el, key, nextValue)) {
      //...
    }
  }
}
```

这当然是起作用的，然而vue的做法，更加高效!
vue将事件侦听器包装了一下，每次调用invoker函数作为事件侦听器，在这个函数当中实际执行的是用户传递过来的函数，因此不需要再去removeEventListener
```js
function createRenderer() {
  function patchProps(el, key, preValue, nextValue) {
    if(/^on/.test(key)) {
      const invoker = el._vei;
      if(nextValue) {
        // 新事件存在
        if(!invoker) {
          invoker = el._vei = (event) => {
            invoker.value(event);
          }
          // 绑定事件
          el.addEventListener(name, invoker);
        }
        // 更新事件侦听器
        invoker.value = nextValue;
      } else if(invoker) {
        // 没有事件 且之前有事件，需要移除之前的事件
        el.removeEventListener(name, invoker);
        invoker = el._vei = nextValue;
      }
    } else if (key === "class") {
      // ...
    } else if (shouldSetProps(key)) {
      // ...
    }
  }
}
```
可以看到这里在事件更新的时候避免了`removeEventListener`,但是上面的代码也存在一个问题
可以看到上面的代码每次获取invoker都是从el._vei如果有多个事件,每次更新事件的时候el._vei到底是哪个事件的呢？这里就需要重新设计一下el._vei的数据结构，每次从el._vei当中取出来事件时，根据事件名取出对应的invoker
```js
function patchProps(el, key, preValue, nextValue) {
  if(/^on/.test(key)) {
    if(/^on/.test(key)) {
      const invoker = el.vei || (el._vei = {});
      const invoker = invokers[key];
      if(nextValue) {
        // 新事件存在
        if(!invoker) {
          invoker = el._vel[key] = (e) => {
            if(Array.isArray(invoker)) {
              invoker.value.forEach(fn => fn(e));
            }else {
              invoker.value();
            }
          }
          // 绑定事件
          el.addEventListener(name, invoker);
        }
        // 更新事件侦听器
        invoker.value = nextValue;
      } else if(invoker) {
        // 没有事件 且之前有事件，需要移除之前的事件
        el.removeEventListener(name, invoker);
        invoker = el._vei = nextValue;
      }
    } else if (key === "class") {
      // ...
    } else if (shouldSetProps(key)) {
      // ...
    }
  }
这样还是有点问题，每种类型的事件只能绑定