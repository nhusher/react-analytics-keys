import { ReactNode, createElement } from "react";
import { AnalyticsNode, useAnalyticsStack } from "./index";

interface RecommendedNodeProps {
  name: string;
  children?: ReactNode;
}

export function AppNode({ name, children }: RecommendedNodeProps) {
  const stack = useAnalyticsStack();

  if (stack.length !== 0) {
    throw new RangeError(
      `Unexpected analytics stack size, found (${stack.join(", ")})`
    );
  }
  return createElement(AnalyticsNode, { value: name, children });
}

export function PageNode({ name, children }: RecommendedNodeProps) {
  const stack = useAnalyticsStack();

  const node = createElement(AnalyticsNode, { value: name, children });

  if (stack.length < 1) {
    return createElement(AppNode, { name: "APPLICATION", children: node });
  } else if (stack.length > 2) {
    throw new RangeError(
      `Unexpected analytics stack size, found [${stack.join(", ")}]`
    );
  } else {
    return node;
  }
}

export function SectionNode({ name, children }: RecommendedNodeProps) {
  const stack = useAnalyticsStack();

  const node = createElement(AnalyticsNode, { value: name, children });

  if (stack.length < 2) {
    return createElement(PageNode, { name: "PAGE", children: node });
  } else if (stack.length > 3) {
    throw new RangeError(
      `Unexpected analytics stack size, found [${stack.join(", ")}]`
    );
  } else {
    return node;
  }
}

export function ComponentNode({ name, children }: RecommendedNodeProps) {
  const stack = useAnalyticsStack();

  const node = createElement(AnalyticsNode, { value: name, children });

  if (stack.length < 3) {
    return createElement(SectionNode, { name: "SECTION", children: node });
  } else if (stack.length > 4) {
    throw new RangeError(
      `Unexpected analytics stack size, found [${stack.join(", ")}]`
    );
  } else {
    return node;
  }
}

export function ElementNode({ name, children }: RecommendedNodeProps) {
  const stack = useAnalyticsStack();

  if (stack.length !== 0) {
    // error: we already have a page node
  }
  return createElement(AnalyticsNode, { value: name, children });
}
