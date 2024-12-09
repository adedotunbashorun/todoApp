export interface Todo {
  id: string;
  content: string;
  dueDate: string;
  completedDate: Date;
  status: 'Done' | 'Unfinished';
}

// Fetch todos from the API
export const fetchTodos = async (): Promise<Todo[]> => {
  try {
    const response = await fetch('/api/v1/todos/user', {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch todos');
    }
    const data = await response.json();
    return data.todos;
  } catch (error) {
    console.error('Error fetching todos:', error);
    return [];
  }
};

// Add a new todo
export const addTodo = async (todoData: Todo): Promise<Todo | null> => {
  try {
    const response = await fetch('/api/v1/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todoData),
    });

    if (!response.ok) {
      throw new Error('Failed to add todo');
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
  todoData: Todo
): Promise<Todo | null> => {
  try {
    const response = await fetch(`/api/v1/todos/${todoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todoData),
    });

    if (!response.ok) {
      throw new Error('Failed to update todo');
    }
    return await response.json();
  } catch (error) {
    console.error('Error editing todo:', error);
    return null;
  }
};

export const deleteTodo = async (
  todoId: string,
) => {
  try {
    const response = await fetch(`/api/v1/todos/${todoId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.log('Failed to delete todo');
    }
    return;
  } catch (error) {
    console.error('Error deleting todo:', error);
    return null;
  }
};
