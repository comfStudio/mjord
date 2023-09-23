import React, { forwardRef, ForwardRefRenderFunction } from "react";

export function createComponent<P = {}, Ref extends unknown = any>(
  render: ForwardRefRenderFunction<
    Ref extends React.Component
      ? NonNullable<React.ClassAttributes<Ref>["ref"]> extends React.LegacyRef<infer U>
        ? U
        : Ref
      : Ref extends React.ForwardRefExoticComponent<infer R>
      ? R extends React.RefAttributes<infer RA>
        ? RA
        : R
      : Ref,
    P
  >
) {
  return forwardRef(render);
}
