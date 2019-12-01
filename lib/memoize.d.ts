export default function memoize<
  Fn extends (this: any, ...args: any[]) => ReturnType<Fn>
>(fn: Fn): Fn;
