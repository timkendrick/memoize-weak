export default function<
  Fn extends (this: any, ...args: any[]) => ReturnType<Fn>
>(fn: Fn): Fn;
