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
    if (isLoading) return;
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
    if (isLoading) return;
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
    if (isLoading) return;
    if (!editTitle.trim()) {
      setEditTitle(todo.title);
      setIsEditing(false);
      return;
    }

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

  const handleDoubleClick = () => {
    if (!isLoading) {
      setIsEditing(true);
    }
  };

  return (
    <li
      className={`flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow`}
    >
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
            onBlur={handleEdit}
            onKeyDown={(e) => {
              if (isLoading) return;
              if (e.key === "Enter") {
                handleEdit();
              } else if (e.key === "Escape") {
                setEditTitle(todo.title);
                setIsEditing(false);
              }
            }}
            className="flex-1 px-2 py-1 border border-blue-300 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
            placeholder="Edit todo title"
            aria-label="Edit todo title"
            autoFocus
          />
        </div>
      ) : (
        <span
          className={`flex-1 ${
            completed
              ? "line-through text-gray-500"
              : "text-gray-800 dark:text-gray-200"
          }`}
          onDoubleClick={handleDoubleClick}
        >
          {todo.title}
        </span>
      )}
      {isLoading && (
        <div className="ml-2 w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      )}
      <button
        onClick={handleDelete}
        className="ml-4 text-red-500 hover:text-red-700"
        disabled={isLoading}
        aria-label="Delete todo"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          />
        </svg>
      </button>
    </li>
  );
}
