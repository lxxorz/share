# GDB调试工具使用

此篇文章以（c++）为例
1. 启动调试

GDB是调试二进制的工具，需要在将源代码构建成二进制的构成中加入 `-g`调试参数,生成对GDB有用的调试信息

例如
```bash
g++ main.cc -o main -g
```

2. 开始调试

```bash
gdb ./main
```

3. 调试指令
GDB有如下主要指令

| directive | description        |
|-----------|--------------------|
| break     | 设置断点           |
| list      | 获取源码上下文信息 |
| run       | 运行               |
| step      | 单步执行，会进入到当前的函数内部           |
| next      | 下一步             |
| continue  | 在断点处，继续执行           |
| quit      | 退出调试           |
| help      | 获取帮助           |
| print     | 输出变量           |
| quit      | 推出               |

GDB可以使用缩写或全写的指令来调试,例如`b main`就是`break main`的缩写

在GDB里面同样可以调用函数来调试，
有如下代码
```c++
#include <iostream>
#include <vector>
using namespace std;

vector<int> v;

int get_size() {
	return v.size();
}

int grow_size(int n){
	int size = get_size();
	v.resize(n + size);
}

int main () {
	v[2] = 3;
}

```

通常的调试流程是 设置断点(`b main`)->运行(`r`)->执行(`n/s`)->继续执行(`c`)->退出调试(`quit`)

在设置断点之后，`print`除了可以打印调试中的变量信息，还可以通过`p function_name()`在调试的过程中调用函数，比如`p grow_size()`就可以调用`grow_size()`函数,
