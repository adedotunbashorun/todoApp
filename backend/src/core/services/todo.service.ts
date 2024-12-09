import { promises as fs } from 'fs';
import path from 'path';
import { TodoItem } from '../models/todo.model';

const FILE_PATH = path.resolve(__dirname, '../../data/todos.json');

export const getTodos = async (): Promise<TodoItem[]> => {
  try {
    const data = await fs.readFile(FILE_PATH, 'utf-8');
    return JSON.parse(data) as TodoItem[];
  } catch (error) {
    return [];
  }
};

export const saveTodos = async (todos: TodoItem[]): Promise<void> => {
  await fs.writeFile(FILE_PATH, JSON.stringify(todos, null, 2));
};
