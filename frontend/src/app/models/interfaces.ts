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

export interface AuthResponse {
  access: string;
  refresh: string;
}
