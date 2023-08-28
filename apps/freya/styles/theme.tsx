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
import { useRecoilValue } from "recoil";

import { ComponentStyles } from "@app/components/interface";
import { AppState } from "@app/state";

import { Colors } from "./colors";
import lightTheme from "./themes/light";
import { VariantTypeGroups, VariantTypes } from "./variants";

type NativeStyle = ViewStyle | TextStyle | ImageStyle;

export type NamedStyles<S> = StyleSheet.NamedStyles<Omit<S, "overrides">> &
  (S extends { overrides?: NamedStyles<unknown> }
    ? { overrides: S["overrides"] }
    : {});

export type StyleFactory<T = any> = {
  factory: (theme: Theme) => NamedStyles<T>;
};

export interface Theme {
  colors: Partial<Colors>;
  spacing: {};
  typography: {};
}

export type ThemeVariant = "light" | "dark";

interface ContextProps {
  theme: Theme;
  variant: ThemeVariant;
  manager: ThemeManager;
}

export class ThemeManager {
  context: ContextProps;

  constructor(variant: ThemeVariant = "light") {
    this.context = this.setVariant(variant);
  }

  setVariant(variant: ThemeVariant): ContextProps {
    if (this.context?.variant === variant) {
      return this.context;
    }

    return {
      theme: variant === "light" ? lightTheme() : lightTheme(),
      variant: variant,
      manager: this,
    };
  }

  mergeOverrides<S extends unknown>(
    styles: NamedStyles<S>,
    ...overrides: (Partial<S> | undefined)[]
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
  const colorScheme = useColorScheme();
  const userVariant = useRecoilValue(AppState.themeVariant);
  const [currentVariant, setVariant] = useState<ThemeVariant>(
    variant ?? userVariant ?? colorScheme ?? "light"
  );

  const manager = useMemo(() => new ThemeManager(currentVariant), []);

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

export function createStyles<C extends keyof ComponentStyles>(
  styles: (theme: Theme) => NamedStyles<ComponentStyles[C]>
): StyleFactory<ComponentStyles[C]> {
  return {
    factory: styles,
  };
}

export function useStyles<S extends unknown>(
  style: StyleFactory<S>,
  ...overrides: (Partial<S> | undefined)[]
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
  return Object.keys(styles).reduce(
    (acc, key) => {
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
    },
    [...propStyles.filter(Boolean)] as NativeStyle[]
  );
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
  O extends keyof ComponentStyles = any
> = { base: NativeStyle } & {
  [P in T]: NativeStyle;
} & (O extends never
    ? {}
    : {
        overrides?: {
          [P in O]?: Partial<ComponentStyles[P]>;
        };
      });
