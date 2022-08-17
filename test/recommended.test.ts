require("jsdom-global")();

import { createElement } from "react";
import { screen, render } from "@testing-library/react";
import { equal, deepStrictEqual, throws } from "assert";
import { useAnalyticsKey } from "../src";
import { AppNode } from "../src/recommended";

describe("Recommended usage", () => {
  const $ = createElement;

  function Dump() {
    const analyticsKey = useAnalyticsKey();
    return $("div", { ...analyticsKey, "data-testid": "dump-element" });
  }

  describe("<AppNode />", () => {
    it("should accept a name and add a name to the analytics stack", () => {
      render($(AppNode, { name: "MyApplication" }, $(Dump)));

      const el = screen.getByTestId("dump-element");

      equal(el.hasAttribute("data-analytics"), true);
      equal(el.getAttribute("data-analytics"), "MyApplication");
    });
    it("should throw an error if an application name already exists in the stack", () => {
      // Hide the annoying error from the console: it is expected
      const e = console.error;
      console.error = () => {};

      throws(
        () => {
          render(
            $(
              AppNode,
              { name: "MyApplication" },
              $(AppNode, { name: "MyNestedApplication" }, $(Dump))
            )
          );
        },
        RangeError,
        "Unexpected analytics stack size, found (MyApplication)"
      );
      console.error = e;
    });
  });
});
