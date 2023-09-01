import constant from "@app/constants";

export function formatDate<T extends Date | undefined = undefined>(
  date: Date,
  endDate?: T
): T extends undefined ? string : [string, string] {
  const currentDate = new Date(new Date().setUTCHours(0, 0, 0, 0));
  const isPast = date < currentDate;
  const showYear = date.getFullYear() !== currentDate.getFullYear();
  const options: Intl.DateTimeFormatOptions = {
    year: isPast ? "numeric" : showYear ? "numeric" : undefined,
    month: isPast ? "numeric" : showYear ? "numeric" : "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  const formatter = new Intl.DateTimeFormat(constant.locale, options);

  if (endDate) {
    const sameDay =
      date.getMonth() === endDate.getMonth() &&
      date.getDate() === endDate.getDate();
    const endOptions: Intl.DateTimeFormatOptions = {
      year: isPast ? "numeric" : showYear ? "numeric" : undefined,
      month: isPast ? "numeric" : showYear || !sameDay ? "short" : undefined,
      day: isPast ? "numeric" : !sameDay ? "numeric" : undefined,
      hour: "numeric",
      minute: "numeric",
    };
    const endFormatter = new Intl.DateTimeFormat(constant.locale, endOptions);

    return [
      formatter.format(date),
      endFormatter.format(endDate as Date),
    ] as T extends undefined ? string : [string, string];
  } else {
    return formatter.format(date) as T extends undefined
      ? string
      : [string, string];
  }
}

export function booleanFromArray<O extends readonly string[]>(
  o: O,
  u: Partial<BooleanUnion<O>>
) {
  const a = o.reduce((acc, v, i) => {
    acc[v] = !!u[i];
    return acc;
  }, {} as Record<O[number], boolean>);

  return a;
}

export function trueFromUnionArray<
  O extends readonly string[],
  U extends O[number]
>(o: O, u?: U) {
  const a = o.reduce((acc, v) => {
    acc[v] = false;
    return acc;
  }, {} as Record<O[number], boolean>);

  return trueFromUnion(a, u);
}

export function trueFromUnion<
  O extends Record<string, boolean>,
  U extends keyof O
>(o: O, u?: U) {
  return Object.keys(o).reduce((acc, key) => {
    acc[key] = false;
    if (key === u) {
      acc[key] = true;
    }
    return acc;
  }, {} as Pick<O, U>);
}

export function isObject(item: any) {
  return typeof item === "object" && !Array.isArray(item);
}

export function deepMerge<A = Object, B = Object>(target: A, source: B): A & B {
  const isDeep = (prop: string) =>
    isObject(source[prop]) &&
    // @ts-expect-error
    target.hasOwnProperty(prop) &&
    isObject(target[prop]);

  const replaced = Object.getOwnPropertyNames(source)
    .map((prop) => ({
      [prop]: isDeep(prop)
        ? deepMerge(target[prop], source[prop])
        : source[prop],
    }))
    .reduce((a, b) => ({ ...a, ...b }), {});

  return {
    ...(target as Object),
    ...(replaced as Object),
  } as A & B;
}
