import React from "react";

import { prop } from "./utils";
import { decorateOption } from "./helpers";

const Basket = ({ state, dispatch }) => {
  const { selectedOptionIds } = state;
  const selectedOptions = selectedOptionIds.map(decorateOption(state));
  return (
    <div>
      {/* <h2> */}
      {/*   <div className="id">{option.id}</div> */}
      {/*   {option.description} */}
      {/*   <p className="summary">£{(option.price / 36).toFixed(2)} p/m</p> */}
      {/* </h2> */}
      {/* <div style={{ marginTop: "1em" }}> */}
      {/*   <h3>Rules</h3> */}
      {/*   {option.rules.map(rule => ( */}
      {/*     <div */}
      {/*       className="card" */}
      {/*       key={rule.id} */}
      {/*       onClick={() => dispatch({ type: "DEBUG.VIEW_RULE", id: rule.id })} */}
      {/*     > */}
      {/*       <div className="card__title"> */}
      {/*         {rule.id} ({rule.type}) */}
      {/*       </div> */}
      {/*     </div> */}
      {/*   ))} */}
      {/* </div> */}

      <h2>Your Options</h2>
      {selectedOptions.map(selectedOption => (
        <div
          className="card"
          key={selectedOption.id}
          onClick={() =>
            dispatch({ type: "DEBUG.VIEW_OPTION", id: selectedOption.id })
          }
        >
          <span className="card__title">
            {selectedOption.id}: {selectedOption.description}
          </span>
          <span className="card__price">
            +£{(selectedOption.price / 24).toFixed(2)}/mo
          </span>
        </div>
      ))}
      {selectedOptions.length > 0 && (
        <div className="basket__total">
          +£
          {(
            selectedOptions.map(prop("price")).reduce((a, b) => a + b, 0) / 24
          ).toFixed(2)}
          /mo
        </div>
      )}
    </div>
  );
};

export default Basket;
