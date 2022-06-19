# Javascript 运行时接口验证工具 Superstruct

## 为什么需要运行时验证
众所周知，JS是一门对类型转换容忍度极高的语言
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

因此，我们需要一个工具来帮助我们验证运行时的接口
