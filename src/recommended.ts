import { ReactNode, createElement } from "react";
import { AnalyticsNode, useAnalyticsStack } from "./index";

interface AppNodeProps {
  name: string;
  children: ReactNode;
}
export function AppNode({ name, children }: AppNodeProps) {
  const stack = useAnalyticsStack();
}

export function PageNode() {}

export function SectionNode() {}

export function ComponentNode() {}

export function ElementNode() {}
