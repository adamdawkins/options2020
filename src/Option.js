import React from "react";
import classNames from "classnames";

import { contains } from "./utils";
import { isSelectable } from "./helpers";

export default function Option(option) {
  const {
    id,
    price,
    isDefault,
    description,
    isSelected,
    appliedRuleIds,
    rules,
    dispatch
  } = option;
  console.log(option);
  const selectable =
    isSelected ||
    isSelectable(rules.filter(rule => contains(rule.id, appliedRuleIds)));

  const disabled = !selectable;

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
        {id}: {description}
      </span>
      <div className="card__actions">
        <button
          className="button primary"
          onClick={() => dispatch({ type: "BASKET.ADD_OPTION", id })}
          disabled={disabled}
        >
          Add
        </button>
      </div>

      <div className="card__details" style={{ fontFamily: "monospace" }}>
        <ul>{isSelected ? <li>Selected</li> : ""}</ul>
      </div>
    </div>
  );
}
