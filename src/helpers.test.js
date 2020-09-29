import {
  ONE_OF,
  REQUIRES_ONE,
  REQUIRES_ALL,
  NOT_WITH,
  INCLUDED_IN,
  INCLUDE_ONE,
  isEnabled
} from "./helpers";
import { Factory } from "./tests/factories";

describe("isEnabled(optionId, state)", () => {
  describe("the option is selected", () => {
    const state = Factory.state({
      options: { "1": Factory.option({ id: "1" }) },
      selectedOptionIds: ["1"]
    });

    it("returns true", () => {
      expect(isEnabled("1", state)).toEqual(true);
    });
  });

  describe("the option is not selected", () => {
    describe("when the option has no rules applied", () => {
      const state = Factory.state({
        options: {
          "1": Factory.option({ id: "1" })
        },
        selectedOptionIds: []
      });
    });
    it.todo("returns ???"); // what about "Requires One of?"
  });
  describe("when the option has a 'One Of' rule that is applied", () => {
    const state = Factory.state({
      options: {
        "1": Factory.option({ id: "1", ruleIds: ["ONE_OF_RULE"] }),
        "2": Factory.option({ id: "2", ruleIds: ["ONE_OF_RULE"] })
      },
      rules: {
        ONE_OF_RULE: { type: ONE_OF, optionIds: ["1", "2"] }
      },
      selectedOptionIds: ["2"],
      appliedRuleIds: ["ONE_OF_RULE"]
    });

    it("returns false", () => {
      expect(isEnabled("1", state)).toBe(false);
    });
  });

  describe("when the option has a 'Requires One Of' rule", () => {
    const requiresOneState = Factory.state({
      options: {
        "1": Factory.option({ id: "1", ruleIds: ["REQUIRES_ONE_RULE"] }),
        "2": Factory.option({ id: "2", ruleIds: ["REQUIRES_ONE_RULE"] })
      },
      rules: {
        REQUIRES_ONE_RULE: {
          type: REQUIRES_ONE,
          optionIds: ["1", "2"]
        }
      }
    });

    describe("it is the primary option", () => {
      const primaryRequiresOneState = {
        ...requiresOneState,
        rules: {
          ...requiresOneState.rules,
          REQUIRES_ONE_RULE: {
            ...requiresOneState.rules.REQUIRES_ONE_RULE,
            primaryOptionId: "1"
          }
        }
      };

      describe("a secondary option is selected", () => {
        const state = {
          ...primaryRequiresOneState,
          selectedOptionIds: ["2"],
          appliedRuleIds: ["REQUIRES_ONE_RULE"]
        };

        it("returns true", () => {
          expect(isEnabled("1", state)).toBe(true);
        });
      });

      describe("a secondary option is not selected", () => {
        const state = {
          ...primaryRequiresOneState,
          selectedOptionIds: [],
          appliedRuleIds: []
        };

        it("returns false", () => {
          expect(isEnabled("1", state)).toBe(false);
        });
      });
    });

    describe("it is a secondary option", () => {
      it.todo("returns true");
    });
  });

  describe("when the option has a 'Not With' rule'", () => {
    describe("it is the primary option", () => {
      describe("a secondary option is selected", () => {
        it.todo("returns false");
        // is this strictly true? the rule states:
        // "If the primary option is chosen, none of the other marked options may be chosen."
      });
      describe("a secondary option is not selected", () => {
        it.todo("returns true");
      });
    });
    describe("it is a secondary option", () => {
      describe("the primary option is selected", () => {
        it.todo("returns false");
      });
      describe("the primary option is not selected", () => {
        it.todo("returns true");
      });
    });
  });
});
