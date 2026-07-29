import { useReducer, useState } from "react";
import "./App.css";

const initialTodos = [
  {
    id: 1,
    title: "Find that missing sock",
    completed: false,
  },
  {
    id: 2,
    title: "Finish React homework",
    completed: true,
  },
  {
    id: 3,
    title: "Go to the gym",
    completed: false,
  },
];

function todoReducer(state, action) {
  switch (action.type) {
    case "ADD_TODO":
      return [action.payload, ...state];

    case "TOGGLE_TODO":
      return state.map((todo) =>
        todo.id === action.payload
          ? { ...todo, completed: !todo.completed }
          : todo
      );

    case "DELETE_TODO":
      return state.filter((todo) => todo.id !== action.payload);

    case "EDIT_TODO":
      return state.map((todo) =>
        todo.id === action.payload.id
          ? { ...todo, title: action.payload.title }
          : todo
      );

    default:
      return state;
  }
}

function App() {
  const [todos, dispatch] = useReducer(todoReducer, initialTodos);
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  function handleAddTodo(event) {
    event.preventDefault();

    if (!newTodo.trim()) {
      return;
    }

    const todo = {
      id: Date.now(),
      title: newTodo.trim(),
      completed: false,
    };

    dispatch({
      type: "ADD_TODO",
      payload: todo,
    });

    setNewTodo("");
  }

  function startEditing(todo) {
    setEditingId(todo.id);
    setEditText(todo.title);
  }

  function saveEdit(id) {
    if (!editText.trim()) {
      return;
    }

    dispatch({
      type: "EDIT_TODO",
      payload: {
        id,
        title: editText.trim(),
      },
    });

    setEditingId(null);
    setEditText("");
  }

  return (
    <main className="app-container">
      <section className="todo-card">
        <h1>Todo List</h1>

        <form className="add-form" onSubmit={handleAddTodo}>
          <input
            type="text"
            value={newTodo}
            onChange={(event) => setNewTodo(event.target.value)}
            placeholder="Enter a new todo"
          />

          <button type="submit">Add Todo</button>
        </form>

        <ul className="todo-list">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className={todo.completed ? "todo-item completed" : "todo-item"}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() =>
                  dispatch({
                    type: "TOGGLE_TODO",
                    payload: todo.id,
                  })
                }
              />

              {editingId === todo.id ? (
                <>
                  <input
                    className="edit-input"
                    type="text"
                    value={editText}
                    onChange={(event) => setEditText(event.target.value)}
                  />

                  <button
                    className="save-button"
                    type="button"
                    onClick={() => saveEdit(todo.id)}
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <span className="todo-title">{todo.title}</span>

                  <button
                    className="edit-button"
                    type="button"
                    onClick={() => startEditing(todo)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-button"
                    type="button"
                    disabled={!todo.completed}
                    onClick={() =>
                      dispatch({
                        type: "DELETE_TODO",
                        payload: todo.id,
                      })
                    }
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>

        {todos.length === 0 && (
          <p className="empty-message">There are no todos remaining.</p>
        )}
      </section>
    </main>
  );
}

export default App;