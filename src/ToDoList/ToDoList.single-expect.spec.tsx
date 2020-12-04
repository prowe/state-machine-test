import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ToDoList from './ToDoList';
import saveToDo from './saveToDo';
import ToDo from "./ToDo";
import React from "react";

jest.mock('./saveToDo');

it('should show an Add button', () => {
    render(<ToDoList/>);
    expect(screen.getByRole('button', {name: 'Add'})).toBeVisible();
});

it('should show a name input when the Add button is clicked', async () => {
    render(<ToDoList/>);
    userEvent.click(screen.getByRole('button', {name: 'Add'}));
    expect(await screen.findByRole('input', {name: 'Name'})).toBeVisible();
});

it('should show a Save button when the Add button is clicked', async () => {
    render(<ToDoList/>);
    userEvent.click(screen.getByRole('button', {name: 'Add'}));
    expect(await screen.findByRole('button', {name: 'Save'})).toBeVisible();
});

it('should save a new ToDo when the user clicks save', async () => {
    render(<ToDoList/>);
    userEvent.click(screen.getByRole('button', {name: 'Add'}));
    userEvent.type(await screen.findByRole('input', {name: 'Name'}), 'Do Stuff');
    userEvent.click(await screen.findByRole('button', {name: 'Save'}));
    const expectedToDo: ToDo = {
        name: 'Do Stuff'
    };
    await waitFor(() => expect(saveToDo as jest.Mock).toHaveBeenCalledWith(expectedToDo));
});

it('should show the ToDO when the user saves', async () => {
    render(<ToDoList/>);
    userEvent.click(screen.getByRole('button', {name: 'Add'}));
    userEvent.type(await screen.findByRole('input', {name: 'Name'}), 'Do Stuff');
    userEvent.click(await screen.findByRole('button', {name: 'Save'}));

    expect(await screen.findByRole('listitem', {name: 'Do Stuff'})).toBeVisible();
});

it('should show an error if the save fails', async () => {
    const error = new Error("Save failed");
    (saveToDo as jest.Mock).mockRejectedValue(error);

    render(<ToDoList/>);
    userEvent.click(screen.getByRole('button', {name: 'Add'}));
    userEvent.type(await screen.findByRole('input', {name: 'Name'}), 'Do Stuff');
    userEvent.click(await screen.findByRole('button', {name: 'Save'}));

    expect(await screen.findByRole('alert', {name: 'Error saving ToDo!'})).toBeVisible();
});