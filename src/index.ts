import {
  Fragment,
  ReactElement,
  ReactNode,
  createElement,
  useCallback,
  createContext,
  useContext,
} from "react";
import { createContextStack } from "react-context-stack";

const { useStack, Stack } = createContextStack<string>();

type ConfigFn = (names: readonly string[]) => Record<string, string> | null;
type KeyBuilderFn = (ns?: string | readonly string[]) => Record<string, string>;

function defaultConfigFn(names: readonly string[]): Record<string, string> {
  return { "data-analytics": names.join("/") };
}

/**
 * Late-binding configuration for how analytics keys are generated. This is to
 * support a different analytics attribute or separator
 */
const AnalyticsContext = createContext<ConfigFn>(defaultConfigFn);

export const AnalyticsContextProvider = AnalyticsContext.Provider;

export function useAnalyticsStack() {
  return useStack();
}

/**
 * Docs tbd
 */
export function useAnalyticsKeyBuilder(name?: string): KeyBuilderFn {
  const stack = useAnalyticsStack();
  const generator = useContext(AnalyticsContext);

  function analyticsKeyBuilder(nameOrNames?: string | readonly string[]) {
    if (!name) return {};

    const generatedAttributes = generator(
      stack.concat(name, nameOrNames ?? [])
    );

    if (!generatedAttributes) return {};
    return generatedAttributes;
  }

  return useCallback(analyticsKeyBuilder, [stack, generator]);
}

interface AnalyticsStackProps {
  /**
   * Docs tbd
   */
  value?: string;
  children: ReactNode;
}

/**
 * Docs tbd
 */
export function AnalyticsNode({
  value,
  children,
}: AnalyticsStackProps): ReactElement {
  if (!value) return createElement(Fragment, null, children);
  else return createElement(Stack, { value, children });
}
