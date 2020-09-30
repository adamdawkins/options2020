import { removeOption, selectOption } from "./actions";
import { ONE_OF, REQUIRES_ONE, REQUIRES_ALL, INCLUDED_IN } from "./helpers";
import { Factory } from "./tests/factories";

describe("selectOption(optionId, state)", () => {
  describe("basic behaviour", () => {
    const state = {
      options: {
        "1": Factory.option({ id: "1", ruleIds: ["RULE1"] }),
        "2": Factory.option({ id: "2", ruleIds: ["RULE1"] })
      },
      rules: {
        RULE1: { id: "RULE1", type: "OO", optionIds: ["1", "2"] }
      },
      selectedOptionIds: [],
      appliedRuleIds: []
    };

    it("adds option id to selectedOptionIds", () => {
      expect(selectOption("1", state)).toEqual(
        expect.objectContaining({
          selectedOptionIds: ["1"]
        })
      );
    });

    it("adds options rules to appliedRuleIds", () => {
      expect(selectOption("1", state)).toEqual(
        expect.objectContaining({
          appliedRuleIds: ["RULE1"]
        })
      );
    });
  });

  describe("when the option is a primary option in a Requires All rule", () => {
    let state = {
      options: {
        "1": Factory.option({ id: "1", ruleIds: ["RULE1"] }),
        "2": Factory.option({ id: "2", ruleIds: ["RULE1", "RULE2"] })
      },
      rules: {
        RULE1: {
          id: "RULE1",
          type: "RA",
          optionIds: ["1", "2"],
          primaryOptionId: "1"
        },
        RULE2: {
          id: "RULE2",
          type: "OO",
          optionIds: ["2", "3"]
        }
      },
      selectedOptionIds: [],
      appliedRuleIds: []
    };

    it("adds the other options in the rule to selectedOptionIds", () => {
      expect(selectOption("1", state)).toEqual(
        expect.objectContaining({
          selectedOptionIds: ["1", "2"]
        })
      );
    });

    it("adds the other options' rules to appliedRuleIds", () => {
      expect(selectOption("1", state)).toEqual(
        expect.objectContaining({
          appliedRuleIds: ["RULE1", "RULE2"]
        })
      );
    });

    describe("when a child option is also a primary option in a Requires All rule", () => {
      let state = {
        options: {
          "1": Factory.option({ id: "1", ruleIds: ["RULE1"] }),
          "2": Factory.option({ id: "2", ruleIds: ["RULE1", "RULE2"] }),
          "3": Factory.option({ id: "3", ruleIds: ["RULE2", "RULE3"] }),
          "4": Factory.option({ id: "4", ruleIds: ["RULE3"] })
        },
        rules: {
          RULE1: {
            id: "RULE1",
            type: "RA",
            optionIds: ["1", "2"],
            primaryOptionId: "1"
          },
          RULE2: {
            id: "RULE2",
            type: "RA",
            optionIds: ["2", "3"],
            primaryOptionId: "2"
          },
          RULE3: {
            id: "RULE3",
            type: "OO",
            optionIds: ["3", "4"]
          }
        },
        selectedOptionIds: [],
        appliedRuleIds: []
      };

      it("adds the child options of the second rule to selectedOptionIds", () => {
        expect(selectOption("1", state)).toEqual(
          expect.objectContaining({
            selectedOptionIds: ["1", "2", "3"]
          })
        );
      });

      it("adds the rules of the chidlern of the second rule to appliedRuleIds", () => {
        expect(selectOption("1", state)).toEqual(
          expect.objectContaining({
            appliedRuleIds: ["RULE1", "RULE2", "RULE3"]
          })
        );
      });
    });
  });
  describe("when the option is a primary option in an included in rule", () => {
    const state = Factory.state({
      options: {
        "1": Factory.option({ id: "1", ruleIds: ["INCLUDED_IN_RULE"] }),
        "2": Factory.option({ id: "2", ruleIds: ["INCLUDED_IN_RULE"] })
      },
      rules: {
        INCLUDED_IN_RULE: {
          type: INCLUDED_IN,
          optionIds: ["1", "2"],
          primaryOptionId: "1"
        }
      },
      selectedOptionIds: ["1", "2"],
      appliedRuleIds: ["INCLUDED_IN_RULE"]
    });

    it("adds the secondary options", () => {
      expect(selectOption("1", state)).toEqual(
        expect.objectContaining({
          selectedOptionIds: ["1", "2"]
        })
      );
    });
  });
});

describe("removeOption(id, state)", () => {
  const state = Factory.state({
    options: {
      "1": Factory.option({ id: "1", ruleIds: ["RULE1"] })
    },
    rules: {
      RULE1: { optionIds: ["1"], type: ONE_OF }
    },
    selectedOptionIds: ["1"],
    appliedRuleIds: ["RULE1"]
  });

  it("removes the option from selectedOptionIds", () => {
    expect(removeOption("1", state)).toEqual(
      expect.objectContaining({
        selectedOptionIds: []
      })
    );
  });

  describe("when the option is the only selected option for a rule", () => {
    it("removes the rule id from appliedRuleIds", () => {
      expect(removeOption("1", state)).toEqual(
        expect.objectContaining({
          appliedRuleIds: []
        })
      );
    });
  });

  describe("when the option is not the only selected option for a rule", () => {
    const state = Factory.state({
      options: {
        "1": Factory.option({ id: "1", ruleIds: ["RULE1"] }),
        "2": Factory.option({ id: "2", ruleIds: ["RULE1"] })
      },
      rules: {
        RULE1: {
          type: REQUIRES_ONE,
          optionIds: ["1", "2", "3"],
          primaryOptionId: "3"
        }
      },
      selectedOptionIds: ["1", "2"],
      appliedRuleIds: ["RULE1"]
    });

    it("does not remove the rule id from appliedRuleIds", () => {
      expect(removeOption("1", state)).toEqual(
        expect.objectContaining({
          appliedRuleIds: ["RULE1"]
        })
      );
    });
  });

  describe("when the option is a secondary option in a 'Requires All' Rule", () => {
    const state = Factory.state({
      options: {
        "1": Factory.option({ id: "1", ruleIds: ["REQUIRES_ALL_RULE"] }),
        "2": Factory.option({ id: "2", ruleIds: ["REQUIRES_ALL_RULE"] })
      },
      rules: {
        REQUIRES_ALL_RULE: {
          type: REQUIRES_ALL,
          optionIds: ["1", "2"],
          primaryOptionId: "2"
        }
      },
      selectedOptionIds: ["1", "2"],
      appliedRuleIds: ["REQUIRES_ALL_RULE"]
    });

    it("removes the primary option from selectedOptionIds", () => {
      expect(removeOption("1", state)).toEqual(
        expect.objectContaining({
          selectedOptionIds: []
        })
      );
    });

    it("removes the rule", () => {
      expect(removeOption("1", state)).toEqual(
        expect.objectContaining({
          appliedRuleIds: []
        })
      );
    });
  });

  describe("when the option is a secondary option for a 'Requires One Of' rule", () => {
    const secondaryRequiresOneState = Factory.state({
      options: {
        "1": Factory.option({ id: "1", ruleIds: ["REQUIRES_ONE_RULE"] }),
        "2": Factory.option({ id: "2", ruleIds: ["REQUIRES_ONE_RULE"] })
      },
      rules: {
        REQUIRES_ONE_RULE: {
          type: REQUIRES_ONE,
          optionIds: ["1", "2"],
          primaryOptionId: "2"
        }
      },
      selectedOptionIds: ["1", "2"],
      appliedRuleIds: ["REQUIRES_ONE_RULE"]
    });

    describe("when no other secondary options are selected for the rule", () => {
      const state = secondaryRequiresOneState;

      it("removes the primary option", () => {
        expect(removeOption("1", state)).toEqual(
          expect.objectContaining({
            selectedOptionIds: []
          })
        );
      });

      it("removes the rule", () => {
        expect(removeOption("1", state)).toEqual(
          expect.objectContaining({
            appliedRuleIds: []
          })
        );
      });
    });

    describe("when other secondary options are selected for the rule", () => {
      const state = {
        ...secondaryRequiresOneState,
        options: {
          ...secondaryRequiresOneState.options,
          "3": Factory.option({ id: "3", ruleIds: ["REQUIRES_ONE_RULE"] })
        },
        rules: {
          REQUIRES_ONE_RULE: {
            ...secondaryRequiresOneState.rules.REQUIRES_ONE_RULE,
            optionIds: ["1", "2", "3"]
          }
        },
        selectedOptionIds: ["1", "2", "3"]
      };

      it("does not remove the primary option", () => {
        expect(removeOption("1", state)).toEqual(
          expect.objectContaining({
            selectedOptionIds: ["2", "3"]
          })
        );
      });

      it("does not remove the rule", () => {
        expect(removeOption("1", state)).toEqual(
          expect.objectContaining({
            appliedRuleIds: ["REQUIRES_ONE_RULE"]
          })
        );
      });
    });

    describe("when the option is a primary option in an included in rule", () => {
      const state = Factory.state({
        options: {
          "1": Factory.option({ id: "1", ruleIds: ["INCLUDED_IN_RULE"] }),
          "2": Factory.option({ id: "2", ruleIds: ["INCLUDED_IN_RULE"] })
        },
        rules: {
          INCLUDED_IN_RULE: {
            type: INCLUDED_IN,
            optionIds: ["1", "2"],
            primaryOptionId: "1"
          }
        },
        selectedOptionIds: ["1", "2"],
        appliedRuleIds: ["INCLUDED_IN_RULE"]
      });

      it("removes the secondary options", () => {
        expect(removeOption("1", state)).toEqual(
          expect.objectContaining({
            selectedOptionIds: []
          })
        );
      });
    });
  });
});
