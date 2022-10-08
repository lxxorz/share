### vue 组件化


在 vue 内部，组件被视为一个虚拟结点

描述普通标签的 vnode
```js
const vnode = {
  type: "div"
  // ...
}
```

描述片段的结点
```js
const vnode = {
  type: Fragment
  // ...
}
```

描述文本结点
```js
const vnode = {
  type: Text,
  // ...
}
```

在被渲染的时候，vue 也证实了这一点，根据 vnode 的 type 属性来对应处理 vue 当中的内容

在vue当中也是差不多的实现
```ts
    switch (type) {
      case Text:
        processText(n1, n2, container, anchor)
        break
      case Comment:
        processCommentNode(n1, n2, container, anchor)
        break
      case Static:
        if (n1 == null) {
          mountStaticNode(n2, container, anchor, isSVG)
        } else if (__DEV__) {
          patchStaticNode(n1, n2, container, isSVG)
        }
        break
      case Fragment:
        processFragment(
          n1,
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          optimized
        )
        break
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          )
        } else if (shapeFlag & ShapeFlags.COMPONENT) {
          processComponent(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          )
        } else if (shapeFlag & ShapeFlags.TELEPORT) {
          ;(type as typeof TeleportImpl).process(
            n1 as TeleportVNode,
            n2 as TeleportVNode,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized,
            internals
          )
        } else if (__FEATURE_SUSPENSE__ && shapeFlag & ShapeFlags.SUSPENSE) {
          ;(type as typeof SuspenseImpl).process(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized,
            internals
          )
        } else if (__DEV__) {
          warn('Invalid VNode type:', type, `(${typeof type})`)
        }
    }
```
可以看到对于针对不同结点的type，vue进行针对性的处理
这里重点关注一下对于组件的处理,根据上面的代码可以知道vue处理组件时调用了`processComponent` 函数，进入这个函数看下它到底做了什么事情呢?

```ts
const processComponent = (
    n1: VNode | null,
    n2: VNode,
    container: RendererElement,
    anchor: RendererNode | null,
    parentComponent: ComponentInternalInstance | null,
    parentSuspense: SuspenseBoundary | null,
    isSVG: boolean,
    slotScopeIds: string[] | null,
    optimized: boolean
  ) => {
    n2.slotScopeIds = slotScopeIds
    if (n1 == null) {
      if (n2.shapeFlag & ShapeFlags.COMPONENT_KEPT_ALIVE) {
        ;(parentComponent!.ctx as KeepAliveContext).activate(
          n2,
          container,
          anchor,
          isSVG,
          optimized
        )
      } else {
        mountComponent(
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          isSVG,
          optimized
        )
      }
    } else {
      updateComponent(n1, n2, optimized)
    }
  }
```

可以看到，这个函数主要做了两件事
1. 挂载组件
2. 更新组件

这和挂载更新普通结点流程是一样的，当旧组件vnode不存在时，挂载组件，否则更新组件

实际上的渲染任务是在 `mountComponent`函数里面实现的,在`mountComponent`函数当中，有这么一段代码

```ts
 // create reactive effect for rendering
 const effect = (instance.effect = new ReactiveEffect(
   componentUpdateFn,
   () => queueJob(update),
   instance.scope // track it in component's effect scope
 ))
```
这里把组件更新的函数注册为一个响应式的副作用函数，当组件的状态发生变化时，将会重新执行`componentUpdateFn`，更新组件


