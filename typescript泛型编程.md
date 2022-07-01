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

### typescript 泛型

---

### 验证有何作用


如何保证`add`函数是接受的参数都是`number`,

```ts
function add(x, y) {
  return x + y;
}
```

在运行时的时候手动验证

```js
function add(x, y) {
  if(typeof x === 'number' && typeof y === 'number') {
    return x + y;
  }
  throw error;
}

```

---

 利用第三方工具验证

```js
import {object} from "superstruct"
function add(x, y){
  const struct = object({
    x: number(),
    y: number()
  })
  assert(struct, {x, y});
  return x + y;
}
```

  利用ts在编译时的时候验证

```ts
function add(x:number, y:number) {
  return x + y;
}

add('1', 1);
```
---

| 类型验证   | 验证时间 | 优点                                                               | 缺点           |
|------------|---------|------------------------------------------------------------------|---------------|
| js         | 无       | 项目规模小时候配合灵活，开发速度块                                  | 维护困难       |
| ts         | 编译时   | 编译时验证，需要用户书写各种类型,配合编辑器在开发时就能避免一些错误 | 无             |
| 第三方工具 | 运行时   | 对于排查错误(~~甩锅~~)，项目代码健壮性有作用                        | 引入额外的依赖 |

---

### [类型擦除](https://zh.wikipedia.org/wiki/%E7%B1%BB%E5%9E%8B%E6%93%A6%E9%99%A4)

TS最终是会编译到JavaScript，TS的类型会被擦除

TypeScript 3.8 引入了[import type](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html)的语法，可以显式指明引入类型，从而杜绝值空间潜在的循环引用问题


---

### 类型推断

自动类型推断

```ts {monaco}
function add<T extends number>(x: T, y: T) :number | string{
  return x + y;
}

const res1 = add<number>(1,2); // number
const res2 = add('1',2); // type check error
const res3 = add<number>('1','2'); // string
```
---

### 类型的基本操作

* 联合类型

```ts {monaco}
  type Union = string | number;
```

* 交叉类型

```ts {monaco}
type ErrorHandler = {
  success: boolean
  error: Error
}

type PersonVip = {
  desc: string
}
type PersonVisitor = {
  desc: string
}

type PersonVipResponse = ErrorHandler & PersonVip
type PersonVisitorResponse = ErrorHandler & PersonVisitor
```
---

* 约束类型

```ts 
function 
```

---


### 值空间和类型空间

<div class="m-20" v-click>

####  值

> 字面量(literal)、变量(variable)、常量(constant)、函数形参、函数对象、`class`、`enum`......

</div>

<div class="m-20" v-click>

#### 类型

> `string`, `number`, `function`, `type` 关键字定义的类型 `interface`、`class` 和 `enum`...

</div>

---

###  类型编程

从类型当中创造类型

---

### 前置知识

* `extends ?` 分支
* 允许递归 循环
* [依赖类型](https://zh.wikipedia.org/wiki/%E4%BE%9D%E8%B5%96%E7%B1%BB%E5%9E%8B)


---

### 元组操作



---

### 一些好用的工具类型

* omit (忽略type当中的某个属性)
* pick (选择type当中的某写属性)
* exclude (排除联合类型中某些类型)

---

### reference

* [读懂类型体操：TypeScript 类型元编程基础入门]( https://zhuanlan.zhihu.com/p/384172236 )
* [typescript handlebook](https://www.typescriptlang.org/docs/handbook/intro.html)
* [TypeScript类型元编程入门指南](https://juejin.cn/post/7025619077158666270)