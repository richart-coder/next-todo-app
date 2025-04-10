"use client";

import { useState } from "react";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export default function TodoItem({
  todo,
  onDelete,
}: {
  todo: Todo;
  onDelete: (id: number) => void;
}) {
  const [completed, setCompleted] = useState(todo.completed);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [isLoading, setIsLoading] = useState(false);

  const toggleCompleted = async () => {
    const prevCompleted = completed;
    try {
      setIsLoading(true);
      setCompleted(!completed);
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ completed: !completed }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      setCompleted(prevCompleted);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onDelete(todo.id);
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ title: editTitle }),
      });

      if (response.ok) {
        setIsEditing(false);
        todo.title = editTitle;
      }
    } catch (error) {
      console.error("Error updating todo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <li className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow">
      <input
        type="checkbox"
        checked={completed}
        onChange={toggleCompleted}
        className="w-5 h-5 mr-4 rounded border-gray-300"
        aria-label={`Mark ${todo.title} as ${
          completed ? "incomplete" : "complete"
        }`}
        disabled={isLoading}
      />
      {isEditing ? (
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="flex-1 px-2 py-1 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
            aria-label="Edit todo title"
            placeholder="Edit todo title"
            disabled={isLoading}
          />
          <button
            onClick={handleEdit}
            className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-green-300 flex items-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setEditTitle(todo.title);
            }}
            className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:bg-gray-300"
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      ) : (
        <>
          <span
            className={`flex-1 ${
              completed
                ? "line-through text-gray-500"
                : "text-gray-800 dark:text-gray-200"
            }`}
          >
            {todo.title}
          </span>
          <span className="text-sm text-gray-500 mr-4">
            {new Date(todo.createdAt).toLocaleDateString()}
          </span>
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-500 hover:text-blue-700 mr-2"
                aria-label={`Edit ${todo.title}`}
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="text-red-500 hover:text-red-700"
                aria-label={`Delete ${todo.title}`}
              >
                Delete
              </button>
            </>
          )}
        </>
      )}
    </li>
  );
}
