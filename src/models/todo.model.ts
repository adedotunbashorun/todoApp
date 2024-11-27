export interface TodoItem {
  id: string;
  content: string;
  dueDate?: string;
  status: 'Unfinished' | 'Done';
}
