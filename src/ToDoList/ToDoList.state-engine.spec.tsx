import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ToDoList from "./ToDoList";
import saveToDo from "./saveToDo";
import ToDo from "./ToDo";
import React from "react";
import { runStateMachine } from "./test-case-state-engine";

jest.mock("./saveToDo");

function initalRender() {
  expect(screen.getByRole("button", { name: "Add" })).toBeVisible();
}

function newItemFormOpened() {
  expect(screen.getByRole("textbox", { name: "Name" })).toBeVisible();
  expect(screen.getByRole("button", { name: "Save" })).toBeVisible();
}

function itemSavedSuccessfully() {
  const expectedToDo: ToDo = {
    name: "Do Stuff",
  };
  expect(saveToDo as jest.Mock).toHaveBeenCalledWith(expectedToDo);
  expect(screen.getByRole("listitem", { name: "Do Stuff" })).toBeVisible();
}

function itemFailedToSave() {
  expect(screen.getByRole("alert")).toBeVisible();
}

runStateMachine({
  transitions: [
    {
      when: () => {
        render(<ToDoList />);
      },
      to: initalRender,
    },
    {
      from: initalRender,
      when: () => {
        userEvent.click(screen.getByRole('button', {name: 'Add'}));
      },
      to: newItemFormOpened,
    },
    {
      from: newItemFormOpened,
      when: () => {
        userEvent.type(screen.getByRole('textbox', {name: 'Name'}), 'Do Stuff');
        userEvent.click(screen.getByRole('button', {name: 'Save'}));
      },
      to: itemSavedSuccessfully,
    },
    {
      from: newItemFormOpened,
      when: function saveWithError() {
        const error = new Error("Save failed");
        (saveToDo as jest.Mock).mockRejectedValue(error);

        userEvent.type(screen.getByRole('textbox', {name: 'Name'}), 'Do Stuff');
        userEvent.click(screen.getByRole('button', {name: 'Save'}));
      },
      to: itemFailedToSave,
    },
  ],
});
