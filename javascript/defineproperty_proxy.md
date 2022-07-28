### defineProperty 和 proxy 的异同



1. `Object.defineProperty()`会直接在原有对象上新增一个属性或者修改原有对象上的属性，原对象会直接受到影响 而`Proxy`是对源对象的各种操作(`get`, `set`, `has`,`deleteProperty`...)进行拦截

2. `proxy`可以代理任意对象(数组，函数对象， 另一个代理...),而`defineProperty`  没法侦听数组的变化,因为数组的`push`方法没办法侦听

3. 因为`defineProperty`每次只能设置对象的单个属性, 如果侦听一个对象上的所有属性，`defineProperty`需要手动添加所有的属性.而`proxy`是对象层次的代理，例如`get(target, property, receiver){...}`可以对该对象上所有属性的`get`操作进行拦截



