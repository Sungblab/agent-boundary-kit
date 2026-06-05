function createDropdown(items) {
  const state = {
    open: false
  };

  return {
    state,
    onButtonClick() {
      return state.open;
    },
    render() {
      return {
        triggerText: "Choose",
        menuItems: state.open ? items : []
      };
    }
  };
}

module.exports = { createDropdown };

