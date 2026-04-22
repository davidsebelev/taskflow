export interface User {
  id?: number;
  username: string;
}

export interface Category {
  id?: number;
  name: string;
  description: string;
  author?: number;
}

export interface Task {
  id?: number;
  title: string;
  description: string;
  category: number;
  completed: boolean;
}

export interface Comment {
  id?: number;
  text: string;
  author?: number;
  author_username?: string;
  task?: number;
}

export interface CreateCategoryPayload {
  name: string;
  description: string;
}

export interface CreateTaskPayload {
  title: string;
  description: string;
  category: number;
  completed?: boolean;
}

export interface CreateCommentPayload {
  text: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
}
