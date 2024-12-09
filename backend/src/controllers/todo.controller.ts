import { validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { getTodos, saveTodos } from '../core/services/todo.service';
import { TodoItem } from '../core/models/todo.model';
import { Controller, Get, Post, Put, Delete, Param, Body, UseBefore, Res, CurrentUser, Authorized } from 'routing-controllers';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { CreateTodoDto, TodoStatus, UpdateTodoDto } from '../core/dtos/todo.dto';
import { User } from '@backend/core/models/user.model';

@Controller('/api/v1/todos')
@UseBefore(AuthMiddleware)
export class TodoController {
  @Get('/')
  async getAll() {
    try {
      const todos = await getTodos();
      return { success: true, todos };
    } catch (error) {
      console.error('Error fetching todos:', error);
      return { success: false, message: 'Failed to fetch todos. Please try again later.' };
    }
  }

  @Get('/user')
  async getUserTodos(@CurrentUser() user: User) {
    const todos = await getTodos();
    const userTodos = todos.filter((t) => t.user && t.user.toString() === user.id.toString()) || [];
    return { success: true, todos: userTodos };
  }

  @Post('/')
  async create(@CurrentUser() user: User, @Body() todo: CreateTodoDto) {
    try {
      // // Validation
      // const errors = validationResult(todo);
      // if (!errors.isEmpty()) {
      //   return { success: false, errors: errors.array() };
      // }

      const { content } = todo;
      const newTodo: TodoItem = { id: uuidv4(), content, status: 'Unfinished', user: user.id };

      const todos = await getTodos();
      todos.push(newTodo);
      await saveTodos(todos);

      return newTodo;
    } catch (error) {
      console.error('Error creating todo:', error);
      return { success: false, message: 'Failed to create todo. Please try again later.' };
    }
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body() body: UpdateTodoDto) {
    try {
      const { content, dueDate, status } = body;

      const todos = await getTodos();
      const todo = todos.find((t) => t.id.toString() === id.toString());
      if (!todo) {
        return { success: false, message: 'Todo not found' };
      }

      if (content) todo.content = content;
      if (dueDate) todo.dueDate = dueDate;
      if (status) todo.status = status;
      if (status && status === TodoStatus.DONE) todo.completedDate = new Date();

      await saveTodos(todos);
      return todo;
    } catch (error) {
      console.error('Error updating todo:', error);
      return { success: false, message: 'Failed to update todo. Please try again later.' };
    }
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    try {
      const todos = await getTodos();
      const updatedTodos = todos.filter((t) => t.id !== id);

      if (todos.length === updatedTodos.length) {
        return { success: false, message: 'Todo not found' };
      }

      await saveTodos(updatedTodos);
      return null
    } catch (error) {
      console.error('Error deleting todo:', error);
      return { success: false, message: 'Failed to delete todo. Please try again later.' };
    }
  }
}
