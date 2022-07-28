// const o = {
//   a: "hello world"
// }

// const intercept = new Proxy(o, {
//   get(target,p,receiver) {
//     console.log(p)
//     Reflect.get(target,p, receiver);
//   }
// })


// console.log(intercept)
// console.log(intercept.ProxyInfo)

// 代理数组对象
const arr = [1,2,3,4,5];


const intercept = new Proxy(arr, {
  get(target, property, receiver) { 
    console.log("proxy inside", property, target[property]);
    return Reflect.get(...arguments)
  }
})


console.log(intercept[2]);
