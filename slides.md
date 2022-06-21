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
---

# Superstruct

Javascript 运行时接口验证工具 

---

## 设计原则

  <ul class="mt-50px p-20px">
    <li>可组合的</li>
    <li>可自定义</li>
    <li>有用的运行时错误</li>
    <li>语法自然</li>
  </ul>

---

## 为什么需要运行时验证
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

## Superstruct

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

这里`assert`将会抛出一个运行时错误

---

```sh
error: 
```

---
layout: two-cols
---
<style>
  .shiki-container{
    margin-right: 20px;
  }
</style>

```js {all|1-5|8-15|14|all}
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
可以将基本的类型进行组合，来构造更复杂的类型

::right::

```js
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

### 可选

可以通过optional函数来指定某个属性可选

```js {all|5|all}
import { optional } from "superstruct"
const User = object({
  id: number(),
  name: string(),
  email: optional(string()), //可选属性
})
```

---

### 自定义验证
可以自定义验证
---

### 默认值


---

### Typescript支持
