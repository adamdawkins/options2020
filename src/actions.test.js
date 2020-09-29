import { selectOption } from "./actions";

const Factory = {
  option(props) {
    return Object.assign(
      {
        id: "1",
        price: 100.0,
        isDefault: false,
        categoryCode: 58,
        categoryDescription: "Paint",
        description: "A thing",
        ruleIds: []
      },
      props
    );
  }
};
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
});
