/**
 * 实现一个编译时的 Fib
 */

type concat<A extends any[], B extends any[]> = [...A, ...B];

type shift<Tuple extends any[]> = Tuple extends [infer fist, ... infer rest] ? rest : void;
type unshift<Tuple extends any[], Type> = [Type, ...Tuple];

type pop<Tuple> = Tuple extends [... infer rest, infer last] ? rest : void;
type push<Tuple extends any[], Type> = [...Tuple, Type];



function add<T extends number | string>(x: T, y: T) {
  return x + y;
}

// 允许递归


// type Fib<A extends number, B extends number> =  [...] extends []