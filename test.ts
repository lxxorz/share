/**
 * 实现一个编译时的 Fib
 */

import { EmitEvent_3 } from "./components/__VLS_types";

type concat<A extends any[], B extends any[]> = [...A, ...B];

type shift<Tuple extends any[]> = Tuple extends [infer fist, ... infer rest] ? rest : void;
type unshift<Tuple extends any[], Type> = [Type, ...Tuple];

type pop<Tuple> = Tuple extends [... infer rest, infer last] ? rest : void;
type push<Tuple extends any[], Type> = [...Tuple, Type];


// 利用元组的length和extends实现四则运算
type Length<R extends any[] = []> = R['length'];
type n = Length<[1, 2, 3]>
type List<Type, n extends number, result extends any[] = []> = result['length'] extends n ? result :
  List<Type, n, [...result, Type]>

type add<x extends number, y extends number> = [...List<number, x>, ...List<number, y>]['length'] extends number ?  [...List<number, x>, ...List<number, y>]['length'] : 0;

type t<T extends any[] = []> = T['length']

type test<x extends number, y extends number> = add<x, add<x, y>>;

type tuple_3 = List<number, 3>; // [number, number, number]

type hhh = test<3, 4>;

type fib<n extends number, x extends number = 1, y extends number = 1, counter extends number = 1> = counter extends n ? x :
  fib<n, y, add<x, y>, add<counter, 1>>

type res_1 = fib<1>
type res_2 = fib<2>
type res_3 = fib<3>
type res_4 = fib<4>
type res_5 = fib<5>
type res_6 = fib<6>
type res_7 = fib<7>
type res_8 = fib<8>
type res_9 = fib<9>
type res_10 = fib<10>


// 更多操作 参考 https://zhuanlan.zhihu.com/p/426966480