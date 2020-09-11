import React from "react";
import classNames from "classnames";

export default function Option({
  id,
  price,
  isDefault,
  description,
  isSelected,
  rules,
  debug,
  dispatch
}) {
  return (
    <div
      onClick={() => dispatch({ type: "DEBUG.VIEW_OPTION", id })}
      className={classNames("card", {
        selected: isSelected,
        viewed: debug.isViewed,
        related: debug.isRelated
      })}
    >
      <div className="card__labels">
        {rules.map(rule => (
          <span
            key={rule.id}
            className={classNames("card-label", {
              selected: debug.view.id === rule.id
            })}
            title={rule.id}
            onClick={event => {
              event.stopPropagation();
              dispatch({ type: "DEBUG.VIEW_RULE", id: rule.id });
            }}
          >
            {rule.type}
          </span>
        ))}
      </div>
      <span className="card__title">
        {id}: {description}
      </span>
    </div>
  );
}
