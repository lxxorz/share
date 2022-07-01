---
# try also 'default' to start simple
theme: default
# random image from a curated Unsplash collection by Anthony
# like them? see https://unsplash.com/collections/94734566/slidev
background: https://source.unsplash.com/collection/94734566/1920x1080
# apply any windi css classes to the current slide
class: 'text-center'
# https://sli.dev/custom/highlighters.html
highlighter: shiki
# show line numbers in code blocks
lineNumbers: true
# some information about the slides, markdown enabled
info: |
  ## Slidev Starter Template
  Presentation slides for developers.

  Learn more at [Sli.dev](https://sli.dev)
# persist drawings in exports and build
drawings:
  persist: false
monaco: true
---

# Superstruct

Javascript 运行时接口验证工具 

---
layout: image-right
image: https://source.unsplash.com/collection/94734566/1920x1080
---

## 设计原则

  <ul class="mt-50px p-20px">
    <li>可组合的</li>
    <li>可自定义</li>
    <li>有用的运行时错误</li>
    <li>语法自然</li>
  </ul>

---

### 为什么需要运行时验证
众所周知，JS是一门对隐式类型转换容忍度极高的语言
一不注意就会写出意想不到的代码，比如

```js {all|1-2|4-6|all}
const a = '1';
const b = 1;

function add(x, y) {
  return (x + y)/2;
}

// some code ...
add(a,b)
```
<!-- <arrow v-click="3" x1="400" y1="420" x2="230" y2="100" color="#564" width="3" arrowSize="1" /> -->


我们这里期待函数应当是`(x:number, y:number) => number`但是实参是字符串和数字，并且数字和字符串可以相互隐式转换，从而导致意料之外的结果，而这种错误不像某些语言，是不会通过抛出的类型错误暴露给用户的

---

### Superstruct

因此，我们需要一个工具来帮助我们验证运行时的接口,**Superstruct**就是为了应对这种情况而产生的工具

<img src="" class="bg-white"/>

---

### 基本类型

最简单的情况就是基本类型的验证

```js
import { string } from 'superstruct'

const Struct = string()

assert('a string', Struct) // passes
assert(42, Struct) // throws!
```

这里`assert`充当的是一个断言函数，如果和Struct不匹配，那么将会抛出一个StructError的运行时错误

---

### 错误描述

```sh
file:///home/bjorn/test/fuccc/node_modules/superstruct/lib/index.es.js:385
    const error = new StructError(tuple[0], function* () {

StructError: Expected a string, but received: 42
    at validate (file:///home/bjorn/test/fuccc/node_modules/superstruct/lib/index.es.js:385:19)
    at assert (file:///home/bjorn/test/fuccc/node_modules/superstruct/lib/index.es.js:326:18)
    at file:///home/bjorn/test/fuccc/examples/assert.mjs:6:1
    at ModuleJob.run (node:internal/modules/esm/module_job:198:25)
    at async Promise.all (index 0)
    at async ESMLoader.import (node:internal/modules/esm/loader:385:24)
    at async loadESM (node:internal/process/esm_loader:88:5)
    at async handleMainPromise (node:internal/modules/run_main:61:12) {
  value: 42,
  key: undefined,
  type: 'string',
  refinement: undefined,
  path: [],
  branch: [ 42 ],
  failures: [Function (anonymous)]
}
```

---

### 其他类型

除了基本类型意外还有其他高级类型供用户使用

* any
* bigint
* date
* func
* set
* map
* optional
* ...

---
layout: two-cols
---

<style>
.shiki-container {
  margin-right: 20px;
}
</style>

将基本类型组合，来构造更复杂的类型

```js {1-5|8-15}
const User = object({
  id: tt(),
  email: string(),
  name: string(),
})


// passes
assert(
  {
    id: 1,
    email: 'jane@example.com',
    name: 'Jane',
  },
  User
)
```

::right::

将会抛出一个运行时错误
```js {hidden|all}
// also throws! (email is missing)
assert(
  {
    id: 1,
    name: 'Jane',
  },
  User
)
```

---

### 可选类型

可以通过optional函数来指定某个属性可选

```js {all|5|all}
import { optional } from "superstruct"
const User = object({
  id: number(),
  name: string(),
  email: optional(string()), //可选属性
})
```
类比TS的interface

---

### `define`

除了object,superstruct还可以使用`define<T>(name: string, validator: Validator): Struct<T, null>`进行更细粒度的验证

```js
import { define } from 'superstruct'
import isEmail from 'is-email'

const email = () => define('email', (value) => isEmail(value))
```

---

### `refine`

也可以用现有的类型进行进一步的验证

```js
import { number, refine } from 'superstruct'

const Positive = refine(number(), 'positive', (value) => value >= 0)
```

---

### 修改输入的数据

有时候，为了让数据通过验证，我们需要对数据的数据做处理（类型转换，计算，trim...)


---

### 默认值

superstruct提供了 `defaulted`函数来完成这一功能

```js {all|6|6,16}
import { defaulted, create } from 'superstruct'

let i = 0

const User = object({
  id: defaulted(number(), () => i++),
  email: string(),
  name: string(),
})

const data = {
  name: 'Jane',
  email: 'jane@example.com',
}

const user = create(data, User)
```

---
layout: two-cols
---

除了提供默认值，还可以转换输入数据

```js
import {
  coerce,
  number,
  string,
  create
} from 'superstruct'

const MyNumber = coerce(
  number(),
  string(),
  (value) => parseFloat(value)
)
```
::right::

运行结果

```js
import { create } from 'superstruct'

const data = '3.14'
const output = create(data, MyNumber)
// 3.14
```

---

### Typescript支持

配合typescript 使用，需要激活[strictNullChecks](https://www.typescriptlang.org/tsconfig#strictNullChecks)获取设置"strict"选项,以便支持optional方法的使用

---

这里`is`可以充当[类型保护](https://jkchao.github.io/typescript-book-chinese/typings/typeGuard.html),它会让TS自动推断此处的`data`是`User`类型,和`assert`不同的是，它会返回一个布尔值,而非直接抛出一个错误


```js
const User = object({
  id: number(),
  email: email(),
  name: string(),
})

if (is(data, User)) {
  // TS会自动推断出块内的代码是User类型, TS已经知道data通过了类型校验
}
```


---
layout: two-cols
---

`assert` Function

```ts {all|8}
export function assert<T, S>(
  value: unknown,
  struct: Struct<T, S>
): asserts value is T {
  const result = validate(value, struct)

  if (result[0]) {
    throw result[0]
  }
}
```
::right::

`is` Function
```ts  {all|5}
export function is<T, S>(
  value: unknown, struct: Struct<T, S>
): value is T {
  const result = validate(value, struct)
  return !result[0]
}

```
---

可以使用TS定义的类型来确保正确的属性类型
```ts 
import { Describe } from 'superstruct'
type User = {
  id: number
  name: string
}

const User: Describe<User> = object({
  id: string(), // 不会通过类型检查，应该为`number`
  name: string(),
})
```

---

TS也可以从superstruct定义的对象构造类型

```ts {all|3-7|all}
import { Infer } from 'superstruct'

const User = object({
  id: number(),
  email: email(),
  name: string(),
})

type User = Infer<typeof User>
```


---

### reference

https://docs.superstructjs.org/
