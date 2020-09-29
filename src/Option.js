import React from "react";
import classNames from "classnames";

import { contains } from "./utils";
import { isEnabled } from "./helpers";

export default function Option({
  state,
  id,
  categoryCode,
  categoryDescription,
  description,
  isSelected,
  appliedRuleIds,
  rules,
  dispatch
}) {
  const enabled = isEnabled(id, state);

  const disabled = !enabled;

  return (
    <div
      className={classNames("card", {
        selected: isSelected,
        disabled
      })}
    >
      <div className="card__labels">
        {rules.map(rule => (
          <span
            key={rule.id}
            className={classNames("card-label", {
              selected: contains(rule.id, appliedRuleIds)
            })}
            title={rule.id}
          >
            {rule.type}
          </span>
        ))}
      </div>
      <span className="card__title">
        {id}: {description} ({categoryCode})
      </span>
      <div className="card__actions">
        {isSelected ? (
          <button
            className="button warning"
            onClick={() => dispatch({ type: "BASKET.REMOVE_OPTION", id })}
          >
            Remove
          </button>
        ) : (
          <button
            className="button primary"
            onClick={() => dispatch({ type: "BASKET.ADD_OPTION", id })}
            disabled={disabled}
          >
            Add
          </button>
        )}
      </div>
      <div className="card__category">{categoryDescription}</div>
    </div>
  );
}
