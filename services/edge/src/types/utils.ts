// The builtin `join` method supports all these natively in the same way that typescript handles them so we can safely accept all of them.
type JoinableItem = string;

// `null` and `undefined` are treated uniquely in the built-in join method, in a way that differs from the default `toString` that would result in the type `${undefined}`. That's why we need to handle it specifically with this helper.
// @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join#description
type NullishCoalesce<Value extends JoinableItem | undefined, Fallback extends string> = Value extends undefined | null
  ? NonNullable<Value> | Fallback
  : Value;

/**
Join an array of strings and/or numbers using the given string as a delimiter.

Use-case: Defining key paths in a nested object. For example, for dot-notation fields in MongoDB queries.

@example
```
// Mixed (strings & numbers) items; result is: 'foo.0.baz'
const path: Join<['foo', 0, 'baz'], '.'> = ['foo', 0, 'baz'].join('.');

```

@category Array
@category Template literal
*/
export type Join<Items extends readonly JoinableItem[], Delimiter extends string> = Items extends []
  ? ""
  : Items extends readonly [JoinableItem?]
  ? `${NullishCoalesce<Items[0], "">}`
  : Items extends readonly [infer First extends JoinableItem, ...infer Tail extends readonly JoinableItem[]]
  ? `${NullishCoalesce<First, "">}${Delimiter}${Join<Tail, Delimiter>}`
  : Items extends readonly [...infer Head extends readonly JoinableItem[], infer Last extends JoinableItem]
  ? `${Join<Head, Delimiter>}${Delimiter}${NullishCoalesce<Last, "">}`
  : string;
