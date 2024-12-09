export interface TodoItem {
  id: string;
  user: string;
  content?: string;
  dueDate?: string;
  completedDate?: Date;
  status: 'Unfinished' | 'Done';
}
