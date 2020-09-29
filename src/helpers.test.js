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

  // CAP > ONE OF: From the marked options, a maximum of one may be selected
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

  // CAP > REQUIRES ONE OF: If the primary option is chosen, it must be accompanied by at least one
  //                        of the non-primary options in that rule
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
      const state = {
        ...requiresOneState,
        rules: {
          ...requiresOneState.rules,
          REQUIRES_ONE_RULE: {
            ...requiresOneState.rules.REQUIRES_ONE_RULE,
            primaryOptionId: "2"
          }
        }
      };

      it("returns true", () => {
        expect(isEnabled("1", state)).toBe(true);
      });
    });
  });

  // CAP > NOT WITH: If the primary option is chosen, none of the other marked options may be chosen
  describe.only("when the option has a 'Not With' rule'", () => {
    const notWithState = Factory.state({
      options: {
        "1": Factory.option({ id: "1", ruleIds: ["NOT_WITH_RULE"] }),
        "2": Factory.option({ id: "2", ruleIds: ["NOT_WITH_RULE"] })
      },
      rules: {
        NOT_WITH_RULE: { type: NOT_WITH, optionIds: ["1", "2"] }
      }
    });

    describe("it is the primary option", () => {
      const state = {
        ...notWithState,
        rules: {
          NOT_WITH_RULE: {
            ...notWithState.rules.NOT_WITH_RULE,
            primaryOptionId: "1"
          }
        }
      };

      it("returns true", () => {
        expect(isEnabled("1", state)).toBe(true);
      });
    });

    describe("it is a secondary option", () => {
      const secondaryNotWithState = {
        ...notWithState,
        rules: {
          NOT_WITH_RULE: {
            ...notWithState.rules.NOT_WITH_RULE,
            primaryOptionId: "2"
          }
        }
      };

      describe("the primary option is selected", () => {
        const state = {
          ...secondaryNotWithState,
          selectedOptionIds: ["2"],
          appliedRuleIds: ["NOT_WITH_RULE"]
        };

        it("returns false", () => {
          expect(isEnabled("1", state)).toBe(false);
        });
      });

      describe("the primary option is not selected", () => {
        const state = {
          ...secondaryNotWithState,
          selectedOptionIds: [],
          appliedRuleIds: []
        };

        it("returns true", () => {
          expect(isEnabled("1", state)).toBe(true);
        });
      });
    });
  });
});
