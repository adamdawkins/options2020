import React from "react";
import classNames from "classnames";

const relationshipTypes = {
  OO: {
    name: "One Of",
    description: "From the marked options, a maximum of one may be selected"
  },
  RO: {
    name: "Requires One Of",
    description:
      "If the primary option is chosen, it must be accompanied by at least one of the non-primary options in that rule"
  },
  RA: {
    name: "Requires All",
    description:
      "If the primary option is chosen, it is accompanied by all the non-primary options in that rule"
  },
  NW: {
    name: "Not With",
    description:
      "If the primary option is chosen, none of the other marked options may be chosen."
  },
  IN: {
    name: "Included In",
    description:
      "The marked options are included in the price of the primary option, which is a pack."
  },
  IO: {
    name: "Include One Of",
    description:
      "If the primary option is chosen, it must be accompanied by one of the non-primary options. The selected non-primary option will be included at 0 cost."
  }
};

export default function DebugRuleView({ rule, dispatch }) {
  const relationshipType = relationshipTypes[rule.type];
  return (
    <div>
      <h2>
        {rule.id}: {relationshipType.name}
      </h2>
      <p>{relationshipType.description}</p>
      <div>
        <h3>Options</h3>
        {rule.options.map(option => (
          <div
            className={classNames("card", {
              primary: option.id === rule.primaryOptionId
            })}
            key={option.id}
            onClick={() =>
              dispatch({ type: "DEBUG.VIEW_OPTION", id: option.id })
            }
          >
            <span className="card__title">
              {option.id}: {option.description}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
