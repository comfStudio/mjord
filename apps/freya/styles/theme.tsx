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

type NativeStyle =
  | ViewStyle
  | TextStyle
  | ImageStyle
  | StyleProp<ViewStyle | TextStyle | ImageStyle>;

export type NamedStyles<S> = StyleSheet.NamedStyles<Omit<S, "overrides">> &
  (S extends { overrides?: NamedStyles<unknown> }
    ? { overrides?: S["overrides"] }
    : {});

export type StyleFactory<T = any> = {
  factory: (theme: Theme) => NamedStyles<T>;
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

export function createStyles<
  C extends keyof ComponentStyles | "" = "",
  K extends string = string,
  O1 extends Record<K, NativeStyle> = Record<K, NativeStyle>,
  O2 extends ComponentStyles[Exclude<C, "">] = ComponentStyles[Exclude<C, "">]
>(
  styles: C extends ""
    ? (theme: Theme) => NamedStyles<O1>
    : (theme: Theme) => NamedStyles<O2>
): StyleFactory<C extends "" ? O1 : O2> {
  return {
    factory: styles as any,
  };
}

const t = createStyles<"">;

export function useStyles<S extends unknown>(
  style: StyleFactory<S>,
  ...overrides: (Partial<S> | undefined | null)[]
) {
  const ctx = useThemeManager();
  return useMemo(() => {
    const s = style.factory(ctx.theme);

    return ctx.manager.mergeOverrides(s, ...overrides);
  }, [ctx.theme, ...overrides]);
}

export function composeStyles<S extends unknown>(
  styles: NamedStyles<S>,
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

  return [...s, ...propStyles.filter(Boolean)];
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

export type defineComponentStyles<
  T extends string,
  O extends keyof ComponentStyles | "" = ""
> = UnionToIntersection<
  { base: NativeStyle } & (T extends ""
    ? {}
    : {
        [P in T]: NativeStyle;
      }) &
    (O extends ""
      ? {}
      : {
          overrides?: {
            [P in Exclude<O, "">]?: Partial<ComponentStyles[P]>;
          };
        })
>;
