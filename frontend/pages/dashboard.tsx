import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LogoutIcon from '@mui/icons-material/Logout';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { fetchTodos, addTodo, editTodo, deleteTodo, Todo } from '../api/todoApi';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [todoForm, setTodoForm] = useState({ content: '', dueDate: '', status: 'Unfinished' });
  const [loading, setLoading] = useState(false);
  const [operationLoading, setOperationLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  useEffect(() => {
    const loadTodos = async () => {
      setLoading(true);
      try {
        const fetchedTodos = await fetchTodos();
        setTodos(fetchedTodos);
      } catch (error) {
        console.error('Failed to fetch todos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTodos();
  }, []);

  const handleAddTodo = async () => {
    setOperationLoading(true);
    try {
      const newTodo = await addTodo(todoForm as Todo);
      if (newTodo) setTodos([...todos, newTodo]);
      setIsAddOpen(false);
      setTodoForm({ content: '', dueDate: '', status: 'Unfinished' });
    } catch (error) {
      console.error('Error adding todo:', error);
    } finally {
      setOperationLoading(false);
    }
  };

  const handleEditTodo = async () => {
    if (!selectedTodo) return;
    setOperationLoading(true);
    try {
      const updatedTodo = await editTodo(selectedTodo.id, todoForm as Todo);
      if (updatedTodo) {
        setTodos(todos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)));
      }
      setIsEditOpen(false);
      setSelectedTodo(null);
      setTodoForm({ content: '', dueDate: '', status: 'Unfinished' });
    } catch (error) {
      console.error('Error editing todo:', error);
    } finally {
      setOperationLoading(false);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    setOperationLoading(true);
    try {
      await deleteTodo(id);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    } finally {
      setOperationLoading(false);
    }
  };

  const handleOpenEdit = (todo: Todo) => {
    setSelectedTodo(todo);
    setTodoForm({ content: todo.content, dueDate: todo.dueDate, status: todo.status });
    setIsEditOpen(true);
  };

  return (
    <Box>
      <AppBar position="static" sx={{ bgcolor: 'purple' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <strong>TodoApp</strong> - Dashboard
          </Typography>
          <Typography sx={{ marginRight: 2 }}>Logged in as: {user?.fullName}</Typography>
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ padding: 3 }}>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          onClick={() => setIsAddOpen(true)}
        >
          Add Todo
        </Button>

        <Box sx={{ mt: 3 }}>
          {loading ? (
            <CircularProgress />
          ) : todos.length === 0 ? (
            <Typography variant="h6" color="textSecondary">
              No todos available. Please add one!
            </Typography>
          ) : (
            todos.map((todo) => (
              <Box
                key={todo.id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                  padding: 2,
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ marginRight: 2 }}>
                    {todo.status === 'Done' && (
                      <CheckCircleIcon sx={{ color: 'green' }} />
                    )}
                  </Box>
                  <Box>
                    <Typography variant="subtitle1">{todo.content}</Typography>
                    <Typography variant="body2">Due: {todo.dueDate}</Typography>
                    <Typography variant="body2">
                      Completed: {todo.completedDate ? new Date(todo.completedDate).toLocaleString() : 'N/A'}
                    </Typography>
                    <Typography
                      variant="body2"
                      color={todo.status === 'Done' ? 'green' : 'red'}
                    >
                      Status: {todo.status}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <IconButton color="primary" onClick={() => handleOpenEdit(todo)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteTodo(todo.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            ))
          )}
        </Box>
      </Box>

      <Dialog open={isAddOpen} onClose={() => setIsAddOpen(false)}>
        <DialogTitle>Add Todo</DialogTitle>
        <DialogContent>
          <TextField
            label="Content"
            fullWidth
            margin="normal"
            value={todoForm.content}
            onChange={(e) => setTodoForm({ ...todoForm, content: e.target.value })}
          />
          <TextField
            label="Due Date"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={todoForm.dueDate}
            onChange={(e) => setTodoForm({ ...todoForm, dueDate: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAddTodo}
            disabled={operationLoading}
          >
            {operationLoading ? <CircularProgress size={24} /> : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isEditOpen} onClose={() => setIsEditOpen(false)}>
        <DialogTitle>Edit Todo</DialogTitle>
        <DialogContent>
          <TextField
            label="Content"
            fullWidth
            margin="normal"
            value={todoForm.content}
            onChange={(e) => setTodoForm({ ...todoForm, content: e.target.value })}
          />
          <TextField
            label="Due Date"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={todoForm.dueDate}
            onChange={(e) => setTodoForm({ ...todoForm, dueDate: e.target.value })}
          />
          <TextField
            label="Status"
            select
            fullWidth
            margin="normal"
            value={todoForm.status}
            onChange={(e) => setTodoForm({ ...todoForm, status: e.target.value })}
          >
            <MenuItem value="Unfinished">Unfinished</MenuItem>
            <MenuItem value="Done">Finished</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleEditTodo}
            disabled={operationLoading}
          >
            {operationLoading ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard
