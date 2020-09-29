export const Factory = {
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
  },
  state(settings) {
    return Object.assign(
      {
        options: {},
        rules: {},
        selectedOptionIds: [],
        appliedRuleIds: []
      },
      settings
    );
  }
};
