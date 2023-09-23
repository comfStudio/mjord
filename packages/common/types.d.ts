declare type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object
    ? RecursivePartial<T[P]>
    : T[P];
};

declare type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;

declare type Replace<T, P extends keyof T, R extends Partial<Record<keyof T, any>>> = Omit<T, P> & R;

declare type PartialExcept<T, K extends keyof T> = Pick<T, K> & Partial<T>;

// Flatten an intersection type by merging keys:
declare type Flatten<T> = T extends Record<string, any> ? { [k in keyof T]: T[k] } : never;

// unwrap generic
declare type Unwrap<T> = T extends Array<infer U>
  ? U
  : T extends Promise<infer U>
  ? U
  : T extends (...args: any) => Promise<infer U>
  ? U
  : T extends (...args: any) => infer U
  ? U
  : T;

declare type DiscriminateUnion<T, K extends keyof T, V extends T[K]> = T extends Record<K, V> ? T : never;

declare type ValueOf<T> = T[keyof T];

declare type MakeRequired<T, Key extends keyof T> = T & Required<Pick<T, Key>>;

declare type RecordFromUnion<T extends Record<K, string>, K extends keyof T> = {
  [V in T[K]]: DiscriminateUnion<T, K, V>;
};

declare type Expand<T> = T extends infer U ? { [K in keyof U]: U[K] } : never;

declare type Merge<X, Y> = {
  [K in keyof X | keyof Y]: (K extends keyof X ? X[K] : never) | (K extends keyof Y ? Y[K] : never);
};

// https://github.com/ts-essentials/ts-essentials/tree/master/lib/union-to-intersection
declare type UnionToIntersection<Union> = (Union extends any ? (arg: Union) => void : never) extends (
  arg: infer Intersection
) => void
  ? Intersection
  : never;

declare type PrettifyObject<T> = { [KeyType in keyof T]: T[KeyType] } & {};

declare type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

declare type PickKeys<T, K extends keyof T> = keyof Pick<T, K>;

declare type BooleanUnion<T> = {
  [P in keyof T]: T[P] | boolean;
};
