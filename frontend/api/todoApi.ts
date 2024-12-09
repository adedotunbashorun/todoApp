import Cookies from 'js-cookie';
import { NextRouter } from 'next/router';

/**
 * A middleware wrapper for fetch that checks for a 401 response.
 * If 401 is detected, it clears cookies and redirects to login.
 *
 * @param {string} url - The URL for the fetch request.
 * @param {RequestInit} [options] - The options for the fetch request.
 * @param {NextRouter} router - Next.js router instance for redirection.
 * @returns {Promise<Response>} - The fetch response.
 */
const fetchMiddleware = async (
  url: string,
  options: RequestInit = {},
  router: NextRouter
): Promise<Response> => {
  try {
    const response = await fetch(url, options);

    // Check if the status is 401
    if (response.status === 401) {
      // Clear cookies
      Cookies.remove('auth_token');
      Cookies.remove('user_id');
      Cookies.remove('full_name');

      // Redirect to login
      router.push('/login');
    }

    return response;
  } catch (error) {
    console.error('Fetch middleware error:', error);
    throw error; // Rethrow the error for higher-level error handling
  }
};

export interface Todo {
  id: string;
  content: string;
  dueDate: string;
  completedDate: Date;
  status: 'Done' | 'Unfinished';
}

// Fetch todos from the API
export const fetchTodos = async (router: NextRouter): Promise<Todo[]> => {
  try {
    const response = await fetchMiddleware('/api/v1/todos/user', { method: 'GET' }, router);
    if (!response.ok) {
      console.log('Failed to fetch todos');
      return [];
    }
    const data = await response.json();
    return data.todos;
  } catch (error) {
    console.error('Error fetching todos:', error);
    return [];
  }
};

// Add a new todo
export const addTodo = async (todoData: Todo, router: NextRouter): Promise<Todo | null> => {
  try {
    const response = await fetchMiddleware(
      '/api/v1/todos',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todoData),
      },
      router
    );

    if (!response.ok) {
      console.log('Failed to add todo');
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Error adding todo:', error);
    return null;
  }
};

// Edit an existing todo
export const editTodo = async (
  todoId: string,
  todoData: Todo,
  router: NextRouter
): Promise<Todo | null> => {
  try {
    const response = await fetchMiddleware(
      `/api/v1/todos/${todoId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todoData),
      },
      router
    );

    if (!response.ok) {
      console.log('Failed to update todo');
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Error editing todo:', error);
    return null;
  }
};

// Delete a todo
export const deleteTodo = async (todoId: string, router: NextRouter): Promise<void> => {
  try {
    const response = await fetchMiddleware(
      `/api/v1/todos/${todoId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      router
    );

    if (!response.ok) {
      console.log('Failed to delete todo');
    }
  } catch (error) {
    console.error('Error deleting todo:', error);
  }
};
