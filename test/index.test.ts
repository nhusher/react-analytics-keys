require("jsdom-global")();

import { cleanup, renderHook } from "@testing-library/react";
import { ReactNode, createElement } from "react";
import { deepStrictEqual } from "assert";
import {
  AnalyticsContextProvider,
  AnalyticsNode,
  useAnalyticsKeyBuilder,
} from "../src";

describe("useAnalyticsKeyBuilder", () => {
  const analytics = (key: string, children: ReactNode) =>
    createElement(AnalyticsNode, { value: key, children });

  afterEach(() => cleanup());

  it("should yield an empty props object when no name is provided", () => {
    const { result } = renderHook(() => useAnalyticsKeyBuilder());
    deepStrictEqual(result.current(/* no name provided */), {});
  });

  it("should yield a single name if that is what is provided", () => {
    const { result } = renderHook(() =>
      useAnalyticsKeyBuilder("search-widget")
    );

    deepStrictEqual(result.current(), {
      "data-analytics": "search-widget",
    });
  });

  it("should accept a single subname", () => {
    const { result } = renderHook(() =>
      useAnalyticsKeyBuilder("search-widget")
    );

    deepStrictEqual(result.current("input"), {
      "data-analytics": "search-widget/input",
    });
  });
  it("should accept a multiple subnames", () => {
    const { result } = renderHook(() =>
      useAnalyticsKeyBuilder("search-widget")
    );

    deepStrictEqual(result.current(["input", "loading-indicator"]), {
      "data-analytics": "search-widget/input/loading-indicator",
    });
  });

  it("should stack parent analytics nodes if they exist", () => {
    const { result } = renderHook(
      () => useAnalyticsKeyBuilder("search-widget"),
      {
        wrapper: ({ children }) =>
          analytics("users", analytics("search-bar", children)),
      }
    );

    deepStrictEqual(result.current("input"), {
      "data-analytics": "users/search-bar/search-widget/input",
    });
  });

  it("should allow reconfiguration way that analytics keys are generated", () => {
    const analyticsContext = (
      separator: string,
      attribute: string,
      children: ReactNode
    ) =>
      createElement(AnalyticsContextProvider, {
        value: (names: readonly string[]) => ({
          "data-heap": names.join("::"),
        }),
        children,
      });

    const { result } = renderHook(
      () => useAnalyticsKeyBuilder("search-widget"),
      {
        wrapper: ({ children }) =>
          analyticsContext(
            "::",
            "data-heap",
            analytics("users", analytics("search-bar", children))
          ),
      }
    );

    deepStrictEqual(result.current("input"), {
      "data-heap": "users::search-bar::search-widget::input",
    });
  });

  it("should allow the analytics key generator to selectively return nothing", () => {
    const analyticsContext = (
      separator: string,
      attribute: string,
      children: ReactNode
    ) =>
      createElement(AnalyticsContextProvider, { value: () => null, children });

    const { result } = renderHook(
      () => useAnalyticsKeyBuilder("search-widget"),
      {
        wrapper: ({ children }) =>
          analyticsContext(
            "::",
            "data-heap",
            analytics("users", analytics("search-bar", children))
          ),
      }
    );

    deepStrictEqual(result.current("input"), {});
  });
});
