import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ToDoList from './ToDoList';
import saveToDo from './saveToDo';
import ToDo from "./ToDo";
import React from "react";

jest.mock('./saveToDo');

test('inital state', () => {
    render(<ToDoList/>);

    expect(screen.getByRole('button', {name: 'Add'})).toBeVisible();
});

test('Add a todo successfully', async () => {
    render(<ToDoList/>);

    userEvent.click(screen.getByRole('button', {name: 'Add'}));

    expect(await screen.findByRole('textbox', {name: 'Name'})).toBeVisible();
    expect(await screen.findByRole('button', {name: 'Save'})).toBeVisible();

    userEvent.type(await screen.findByRole('textbox', {name: 'Name'}), 'Do Stuff');
    userEvent.click(await screen.findByRole('button', {name: 'Save'}));

    const expectedToDo: ToDo = {
        name: 'Do Stuff'
    };
    await waitFor(() => expect(saveToDo as jest.Mock).toHaveBeenCalledWith(expectedToDo));
    expect(await screen.findByRole('listitem', {name: 'Do Stuff'})).toBeVisible();
});

test('An error occurs when saving', async () => {
    const error = new Error("Save failed");
    (saveToDo as jest.Mock).mockRejectedValue(error);

    render(<ToDoList/>);

    userEvent.click(screen.getByRole('button', {name: 'Add'}));

    expect(await screen.findByRole('textbox', {name: 'Name'})).toBeVisible();
    expect(await screen.findByRole('button', {name: 'Save'})).toBeVisible();

    userEvent.type(await screen.findByRole('textbox', {name: 'Name'}), 'Do Stuff');
    userEvent.click(await screen.findByRole('button', {name: 'Save'}));

    expect(await screen.findByRole('alert')).toBeVisible();
});