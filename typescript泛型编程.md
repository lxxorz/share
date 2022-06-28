---
# try also 'default' to start simple
theme: seriph
# random image from a curated Unsplash collection by Anthony
# like them? see https://unsplash.com/collections/94734566/slidev
background: https://source.unsplash.com/collection/94734566/1920x1080
# apply any windi css classes to the current slide
class: 'text-center'
# https://sli.dev/custom/highlighters.html
highlighter: shiki
# show line numbers in code blocks
lineNumbers: false
# some information about the slides, markdown enabled
info: |
  ## Slidev Starter Template
  Presentation slides for developers.

  Learn more at [Sli.dev](https://sli.dev)
# persist drawings in exports and build
drawings:
  persist: false
---

### typescript 类型元编程

---

### 值空间和类型空间

<div class="m-20" v-click>

####  值

> 字面量、变量、常量、函数形参、函数对象、class、enum......

</div>

<div class="m-20" v-click>

#### 类型

> type 关键字定义的类型 interface、class 和 enum

</div>


---


### [类型擦除](https://zh.wikipedia.org/wiki/%E7%B1%BB%E5%9E%8B%E6%93%A6%E9%99%A4)

TS最终是会编译到JavaScript，TS的类型会被擦除

TypeScript 3.8 引入了[import type](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html)的语法，可以显式指明引入类型，从而杜绝值空间潜在的循环引用问题


---

### 自动类型推断

```ts
function add(x: T, y: T) T{
  return x + y;
}

add(1,2); // number
add('1',2); // type check error
add('1','2'); // string
```

---

###  类型元编程

从类型当中创造类型



---

### reference

* [读懂类型体操：TypeScript 类型元编程基础入门]( https://zhuanlan.zhihu.com/p/384172236 )
* [typescript handlebook](https://www.typescriptlang.org/docs/handbook/intro.html)