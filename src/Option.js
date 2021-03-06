import React from "react";
import classNames from "classnames";

import { contains } from "./utils";
import { decorateRule } from "./helpers";
import {
  INCLUDED_IN,
  isEnabled,
  isEnabledByRule,
  RULE_TYPE_NAMES
} from "./helpers";

export default function Option({
  state,
  id,
  price,
  categoryCode,
  categoryDescription,
  description,
  isSelected,
  isZeroPricePackOption,
  appliedRuleIds,
  rules,
  dispatch
}) {
  const enabled = isEnabled(id, state);

  const disabled = !enabled;
  let includedRule = null;
  // categoryCode 34 is Packs
  if (categoryCode === 34) {
    const includedRules = rules
      .filter(
        ({ type, primaryOptionId }) =>
          type === INCLUDED_IN && primaryOptionId === id
      )
      .map(rule => rule && decorateRule(state, rule.id));

    includedRule = includedRules && includedRules[0];
  }

  return (
    <div
      className={classNames("card", {
        selected: isSelected,
        hidden: isZeroPricePackOption,
        disabled,
        pack: categoryDescription === "Packs"
      })}
    >
      <div className="card__labels">
        {rules.map(rule => (
          <span
            key={rule.id}
            className={classNames("card-label", {
              selected: contains(rule.id, appliedRuleIds),
              warning: !isEnabledByRule(id, rule.id, state),
              oneRule: rule.optionIds.length === 1
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
      <span className="card__price">+£{(price / 24).toFixed(2)}/mo</span>
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
      {includedRule && (
        <div>
          Includes:
          <ul>
            {includedRule.options
              .filter(({ id }) => id !== includedRule.primaryOptionId)
              .map(option => (
                <li key={option.id}>{option.description}</li>
              ))}
          </ul>
        </div>
      )}
      <div className="card__category">{categoryDescription}</div>
      {disabled && (
        <div className="card__debug">
          {rules
            .filter(rule => !isEnabledByRule(id, rule.id, state))
            .map(rule => (
              <li key={rule.id}>
                This option is disabled by the{" "}
                <strong>{RULE_TYPE_NAMES[rule.type]}</strong> Rule ({rule.id})
              </li>
            ))}
        </div>
      )}
    </div>
  );
}
