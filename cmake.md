# CMake 基础使用(version >= 3.12)

## 前置知识

### 多文件编译

1. 单文件编译虽然简单，但是不利于模块化和项目的可读性
2. 只要改动一点就需要重新编译，如果工程项目十分庞大，所花费的时间也非常久

针对这种情况，提出了多文件编译的概念

```
g++ -c hello.c -o hello.o
g++ -c main.c -o main.o
g++ main.o hello.o -o a.out
```
-c 指定生成对应的object文件,
各个 `object file` 通过符号声明互相引用


### 动态链接库

动态链接库的是为了节省程序内存占用，多个程序共享同一个动态链接库，而不是每个程序都单独的加载一个动态链接库。
<!--TODO:动态链接库的概念 -->
###  静态链接库

<!--TODO:静态链接库的概念 -->

## MakeFile是什么?

构建程序时，我们通常要将源码分成不同的模块进行构建，因为这样可以
1. 提高编译的速度（增量编译Incremental compiler）
2. 方便开发



## 安装CMake

Ubuntu
```
sudo apt install cmake
```

如果在windows上也可以使用`pip`安装
```
pip install  cmake
```

