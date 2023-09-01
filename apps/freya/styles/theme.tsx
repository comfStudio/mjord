import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import {
  Appearance,
  ImageStyle,
  StyleProp,
  StyleSheet,
  TextStyle,
  useColorScheme,
  ViewStyle,
} from "react-native";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRecoilValue } from "recoil";

import { deepMerge } from "@app/misc/utils";
import { AppState } from "@app/state";
import {
  ComponentStyles,
  VariantTypeGroups,
  VariantTypes,
} from "@app/styles/interface";

import { Colors } from "./colors";
import sizing, { Sizing } from "./sizing";
import spacing, { Spacing } from "./spacing";
import lightTheme from "./themes/light";

type NativeStyleValue = ViewStyle | TextStyle | ImageStyle | undefined;

type NativeStyle<V extends NativeStyleValue = NativeStyleValue> = V;

type SpeficStyleTypes<S> = Partial<Record<keyof S, NativeStyleValue>>;

export type GetStylesOverrides<C> = C extends {
  overrides: Partial<NamedStyles<any, any>>;
}
  ? NonNullable<C["overrides"]>
  : C extends {
      overrides?: {
        [P in string]?: Partial<NamedStyles<any>>;
      };
    }
  ? NonNullable<C["overrides"]>
  : never;

type NamedNativeStyles<S, T extends SpeficStyleTypes<S>> = {
  [P in keyof S]: T[P] extends NativeStyleValue
    ? NativeStyle<T[P]>
    : S[P] extends NativeStyleValue
    ? NativeStyle<S[P]>
    : never;
};

type NamedOverridesStyles<S, T extends SpeficStyleTypes<S>> = PrettifyObject<
  {
    overrides?: GetStylesOverrides<S>;
  } & NamedNativeStyles<Omit<S, "overrides">, Omit<T, "overrides">>
>;

export type NamedStyles<
  S,
  T extends SpeficStyleTypes<S> = {}
> = GetStylesOverrides<S> extends never
  ? NamedNativeStyles<
      Omit<S, "overrides">,
      SpeficStyleTypes<Omit<S, "overrides">>
    >
  : NamedOverridesStyles<S, T>;

export type StyleFactory<S = any, T extends SpeficStyleTypes<S> = any> = {
  factory: (theme: Theme) => NamedStyles<S, T>;
};

export interface Theme {
  colors: Partial<Colors>;
  spacing: Spacing;
  sizing: Sizing;
  typography: {};
  insets: EdgeInsets;
}

export type CustomTheme = DeepPartial<Theme>;

export type ThemeVariant = "light" | "dark";

interface ContextProps {
  theme: Theme;
  variant: ThemeVariant;
  manager: ThemeManager;
}

export class ThemeManager {
  context: ContextProps;

  constructor({
    variant = "light",
    insets,
  }: {
    variant: ThemeVariant;
    insets?: EdgeInsets;
  }) {
    this.context = {
      manager: this,
      variant,
      theme: {
        colors: {},
        spacing: spacing(),
        sizing: sizing(spacing()),
        typography: {},
        insets: {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          ...insets,
        },
      },
    };

    this.setVariant(variant);
  }

  setVariant(variant: ThemeVariant): ContextProps {
    let ctheme: CustomTheme;

    switch (variant) {
      case "light":
        ctheme = lightTheme();
        break;
      default:
        ctheme = lightTheme();
        break;
    }

    const theme = this.context.theme
      ? deepMerge(this.context.theme, ctheme)
      : (ctheme as Theme);

    this.context = {
      ...this.context,
      theme,
      variant: variant,
    };

    return this.context;
  }

  mergeOverrides<S extends unknown>(
    styles: NamedStyles<S>,
    ...overrides: (Partial<S> | undefined | null)[]
  ): NamedStyles<S> {
    const s = { ...styles };

    overrides.forEach((o) => {
      if (o) {
        Object.keys(o).forEach((key) => {
          if (key === "overrides") {
            if (!s[key]) {
              s[key] = {};
            }
            s[key] = this.mergeOverrides(s[key], o[key]);
          } else if (s[key]) {
            s[key] = StyleSheet.compose(s[key], o[key]);
          }
        });
      }
    });

    return s;
  }

  setItem(key: string, value: any) {}

  getItem(key: string) {}
}

const ThemeContext = createContext(undefined as any as ContextProps);

export function ThemeProvider({
  variant,
  children,
}: {
  variant?: ThemeVariant | null;
  children: React.ReactNode;
}) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const userVariant = useRecoilValue(AppState.themeVariant);
  const [currentVariant, setVariant] = useState<ThemeVariant>(
    variant ?? userVariant ?? colorScheme ?? "light"
  );

  const manager = useMemo(
    () => new ThemeManager({ variant: currentVariant, insets }),
    []
  );

  useLayoutEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      if (userVariant) {
        return;
      }

      if (colorScheme) {
        setVariant(colorScheme);
      }
    });

    return sub.remove;
  }, [userVariant]);

  useLayoutEffect(() => {}, [currentVariant]);

  return (
    <ThemeContext.Provider value={manager.context}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeManager() {
  return useContext(ThemeContext);
}

export function useTheme() {
  return useThemeManager().theme;
}

type SCreateStyles<C> = C extends keyof ComponentStyles
  ? ComponentStyles[Exclude<C, "">]
  : C extends Record<string, any>
  ? C
  : never;

type NCreateStyles<S = any> = NamedStyles<S, SpeficStyleTypes<S>>;

type OCreateStyles<C extends keyof ComponentStyles | NCreateStyles> =
  C extends keyof ComponentStyles
    ? NamedStyles<SCreateStyles<C>, SpeficStyleTypes<SCreateStyles<C>>>
    : C;

export function createStyles<
  C extends keyof ComponentStyles | NamedStyles<any, any>
>(
  styles: ((t: Theme) => OCreateStyles<C>) | OCreateStyles<C>
): StyleFactory<OCreateStyles<C>, SpeficStyleTypes<OCreateStyles<C>>> {
  const f = typeof styles === "function" ? styles : () => styles;
  return {
    factory: f as any,
  };
}

export function useStyles<S extends unknown>(
  style: StyleFactory<S>,
  ...overrides: (Partial<S> | undefined | null)[]
): NamedStyles<S, SpeficStyleTypes<S>> {
  const ctx = useThemeManager();
  return useMemo(() => {
    const s = style.factory(ctx.theme);

    return ctx.manager.mergeOverrides(s, ...overrides);
  }, [ctx.theme, ...overrides]);
}

export function composeStyles<S extends unknown>(
  styles: NamedStyles<S, SpeficStyleTypes<S>>,
  filter: { [P in keyof S]?: boolean | (() => boolean) },
  ...propStyles: (StyleProp<any> | undefined)[]
) {
  const s = Object.keys(styles).reduce((acc, key) => {
    if (filter[key] === undefined) {
      return acc;
    }

    if (filter[key]) {
      if (
        (typeof filter[key] === "function" && filter[key]()) ||
        filter[key] === true
      ) {
        acc.push(styles[key]);
      }
    }
    return acc;
  }, [] as NativeStyle[]);

  return [...s, ...propStyles.filter(Boolean)] as StyleProp<any>;
}

export interface ThemeStyleProps<
  C,
  Override extends keyof ComponentStyles = never
> {
  style?: ComponentStyleProp<C>;
  overrideStyle?: Override extends never
    ? never
    : Partial<ComponentStyles[Override]> | undefined;
}

type OmitNever<T> = { [K in keyof T as T[K] extends never ? never : K]: T[K] };

type _ThemePropsHelper<props, T> = keyof T & props extends never
  ? { [k in keyof T]: never }
  : {
      [p in keyof Pick<T, keyof T & props>]: T[p];
    };

type _ThemeProps<props extends keyof VariantTypes | keyof VariantTypeGroups> =
  OmitNever<_ThemePropsHelper<props, VariantTypes>> &
    UnionToIntersection<
      _ThemePropsHelper<props, VariantTypeGroups>[keyof VariantTypeGroups &
        props]
    >;

export type ThemeProps<
  props extends keyof VariantTypes | keyof VariantTypeGroups
> = Partial<PrettifyObject<OmitNever<_ThemeProps<props>>>>;

export type ThemePropsNames<
  props extends keyof VariantTypes | keyof VariantTypeGroups
> = keyof OmitNever<_ThemeProps<props>>;

export type defineComponentStyles<
  T extends {
    names?: string;
    overrides?: keyof ComponentStyles;
    customOverrides?: string;
  }
> = UnionToIntersection<
  { base: NativeStyle } & (T["names"] extends undefined
    ? {}
    : {
        [P in NonNullable<T["names"]>]: NativeStyle;
      }) &
    (T["overrides"] extends undefined
      ? {}
      : {
          overrides?: {
            [P in NonNullable<T["overrides"]>]?: Partial<ComponentStyles[P]>;
          };
        }) &
    (T["customOverrides"] extends undefined
      ? {}
      : {
          overrides?: {
            [P in NonNullable<T["customOverrides"]>]: NativeStyle;
          };
        })
>;
