# Javascript 运行时接口验证工具 Superstruct

## 为什么需要运行时验证
众所周知，JS是一门对隐式类型转换容忍度极高的语言
一不注意就会写出意想不到的到吗，比如

```js
function add(x, y){
  return (x + y)/2;
}
const a = '1';

const b = 1;

// some code ...

add(a,b)

```
我们这里期待函数应当是`(x:number, y:number)=>number`但是传入是一个字符串和数字，并且数字和字符串可以相互默认转换，从而导致意料之外的结果，而这种错误不像传统静态类型语言，是不会通过抛出的类型错误暴露给用户的

## Superstruct 

因此，我们需要一个工具来帮助我们验证运行时的接口,Superstruct就是为了应对这种情况而产生的工具

### 基本类型

最简单的情况就是基本类型的验证

```js
import { string } from 'superstruct'

const Struct = string()

assert('a string', Struct) // passes
assert(42, Struct) // throws!
```

这里assert将会抛出一个运行时错误

###  组合

可以将基本的类型进行组合，来构造更复杂的类型

```js
const User = object({
  id: number(),
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

// throws! (id is invalid)
assert(
  {
    id: '1',
    email: 'jane@example.com',
    name: 'Jane',
  },
  User
)

// also throws! (email is missing)
assert(
  {
    id: 1,
    name: 'Jane',
  },
  User
)
```
### 可选

可以通过optional函数来指定某个属价可选
```js
import { optional } from "superstruct"

const User = object({
  id: number(),
  name: string(),
  email: optional(string()), //可选属性
})
```

### 自定义验证


### 默认值
