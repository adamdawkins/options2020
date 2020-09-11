import React from "react";
import { path } from "./utils";
import { decorateOption, relatedOptionIds, decorateRule } from "./helpers";

import DebugRuleView from "./DebugRuleView";
import DebugOptionView from "./DebugOptionView";

export default function DebugSidebar({ state, dispatch }) {
  const debugView = path(["debug", "view"], state);

  if (!debugView.type) return null;

  if (debugView.type === "option") {
    return (
      <DebugOptionView
        option={decorateOption(state, state.debug.view.id)}
        relatedOptions={relatedOptionIds(state.debug.view.id, state).map(
          decorateOption(state)
        )}
        dispatch={dispatch}
      />
    );
  }
  if (debugView.type === "rule") {
    return (
      <DebugRuleView
        rule={decorateRule(state, state.debug.view.id)}
        dispatch={dispatch}
      />
    );
  }
}
