function isInitalState() {
  // expect an empty list
  expect();
}

function newItemFormOpened() {}

function itemNameEntered() {}

function itemSavedSuccessfully() {}

function itemFailedToSave() {}

function setup() {}

describeStateMachine({
  setup,
  initialState: isInitalState,
  transitions: [
    {
      from: isInitalState,
      on: () => {
        // click add button
      },
      to: newItemFormOpened,
    },
    {
      from: newItemFormOpened,
      on: () => {
        // cancel
      },
      to: isInitalState,
    },
    {
      from: newItemFormOpened,
      on: () => {
        // type text
      },
      to: itemNameEntered,
    },
    {
      from: itemNameEntered,
      on: () => {
        // click save
      },
      to: itemSavedSuccessfully,
    },
    {
      from: itemNameEntered,
      on: () => {
        // setup error
        // click save
      },
      to: itemFailedToSave,
    },
  ],
});
