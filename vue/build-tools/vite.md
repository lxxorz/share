# vite 指南

### 什么是构建工具

* 模块化支持，浏览器不支持裸模块导入 bare module import
* 集成代码处理工具（babel, tsc...)
* 对于使用不同的模块的依赖，需要统一转换成ESM，这个转换过程是

### 模块导入的实现
ESM规范只支持以'/', './' 形式导入的module
```js
//从node_modules当中导入不支持
import foo from "module";
```
**ESM为什么不支持从node_modules里面导入呢?**

浏览器会解析入口模块，确定依赖，并发送对依赖模块的请求。这些文件通过网络返回后，浏览器就会解析它们的内容，确定它们的依赖，如果这些二级依赖还没有加载，则会发送更多请求。这个异步递归加载过程会持续到整个应用程序的依赖图都解析完成。解析完依赖图，应用程序就可以正式加载模块了，可以想象如果依赖的模块很多则会发送很多的网络请求，处于对性能的考虑，ESM不会加载此类裸模块

vite 支持裸模块导入是通过重写导入路径实现的

```js
// 用户编写的代码
import {isEmpty} from 'lodash'

// 通过vite处理过的代码
import __vite__cjsImport3_lodash from "/node_modules/.vite/deps/lodash.js?v=c2494383";
const isEmpty = __vite__cjsImport3_lodash["isEmpty"]
```
vite通过**依赖预构建**将多个模块全部放在一个文件中，只需要请求一次即可,如果通过**vite.config.js**配置禁止此类优化就可以看到浏览器会对每一个模块发起一次请求

```js
// vite.config.js
export default defineConfig({
  optimizeDeps: {
    exclude: ['module']
  }
})
```

### 实现vite的开发服务器

1. 引入koa依赖

先搭建一个简单的文件服务器
```js
import Koa from "koa";
const app = new Koa();


function middleware(ctx){
  console.log("middleware");
  return ctx;
}

app.use(middleware);

// 开启vite服务器 监听5173端口
app.listen(5173, () => {
  console.log(`vite server start 5173`)
})
```

### trouble shotting
在浏览器网络当中，有vue文件，浏览器怎么识别vue文件呢？


