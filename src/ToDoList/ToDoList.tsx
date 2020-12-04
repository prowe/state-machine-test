import React, { FormEvent, useState } from "react";

import saveToDo from './saveToDo';
import ToDo from "./ToDo";

interface AddToDoFormProps {
    onSave: (todo: ToDo) => Promise<void>;
}

function AddToDoForm({onSave}: AddToDoFormProps) {
    function submitToDo(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const nameInput = form.elements.namedItem('name') as HTMLInputElement;
        const todo: ToDo = {
            name: nameInput?.value
        };
        onSave(todo);
    }

    return (
        <form onSubmit={submitToDo}>

            <label>Name
                <input name='name' required />
            </label>

            <button type='submit'>Save</button>
        </form>
    );
}

export default function ToDoList() {
    const [addFormOpen, setAddFormOpen] = useState(false);
    const [error, setError] = useState<Error>();
    const [toDos, setToDos] = useState<ToDo[]>([]);

    async function onSave(todo: ToDo) {
        try {
            await saveToDo(todo);
            setToDos((existing: ToDo[]) => [...existing, todo]);
            setError(undefined);
        } catch (e) {
            setError(e);
        }

        setAddFormOpen(false);
    }

    return (
        <div>
            {error && <div role='alert'>Error saving ToDo!</div>}

            <ul>
                {toDos.map((todo: ToDo, index: number) => <li key={index} aria-label={todo.name}>{todo.name}</li>)}
            </ul>

            <button onClick={() => setAddFormOpen(true)}>Add</button>
            {addFormOpen && <AddToDoForm onSave={onSave} />}
        </div>
    );
}