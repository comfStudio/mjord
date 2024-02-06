export function reduce<T>(s: Partial<T>, ...f: ((v: Partial<T>) => Partial<T>)[]) {
  return f.reduce((acc, v) => ({ ...acc, ...v(acc) }), s);
}
