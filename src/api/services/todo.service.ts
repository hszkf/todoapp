import { eq, and, like, desc } from 'drizzle-orm';
import { db, todos, type Todo, type NewTodo } from '@/db';
import type {
  CreateTodoInput,
  UpdateTodoInput,
  TodoFilter,
} from '@/features/todos/types';

export const todoService = {
  async findAll(filter: TodoFilter): Promise<Todo[]> {
    const conditions = [];

    // Filter by completion status
    if (filter.filter === 'active') {
      conditions.push(eq(todos.completed, false));
    } else if (filter.filter === 'completed') {
      conditions.push(eq(todos.completed, true));
    }

    // Filter by priority
    if (filter.priority) {
      conditions.push(eq(todos.priority, filter.priority));
    }

    // Filter by category
    if (filter.categoryId) {
      conditions.push(eq(todos.categoryId, filter.categoryId));
    }

    // Search by title (use 'like' for SQLite instead of 'ilike')
    if (filter.search) {
      conditions.push(like(todos.title, `%${filter.search}%`));
    }

    if (conditions.length === 0) {
      return db.select().from(todos).orderBy(desc(todos.createdAt));
    }

    return db
      .select()
      .from(todos)
      .where(and(...conditions))
      .orderBy(desc(todos.createdAt));
  },

  async findById(id: string): Promise<Todo | undefined> {
    const result = await db
      .select()
      .from(todos)
      .where(eq(todos.id, id))
      .limit(1);
    return result[0];
  },

  async create(data: CreateTodoInput): Promise<Todo> {
    const newTodo: NewTodo = {
      title: data.title,
      description: data.description,
      priority: data.priority,
      dueDate: data.dueDate || null,
      categoryId: data.categoryId,
    };

    const result = await db.insert(todos).values(newTodo).returning();
    return result[0]!;
  },

  async update(id: string, data: UpdateTodoInput): Promise<Todo | undefined> {
    const updateData: Partial<NewTodo> & { updatedAt: string } = {
      updatedAt: new Date().toISOString(),
    };

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.completed !== undefined) updateData.completed = data.completed;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.dueDate !== undefined) {
      updateData.dueDate = data.dueDate || null;
    }
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;

    const result = await db
      .update(todos)
      .set(updateData)
      .where(eq(todos.id, id))
      .returning();
    return result[0];
  },

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(todos).where(eq(todos.id, id)).returning();
    return result.length > 0;
  },

  async toggleComplete(id: string): Promise<Todo | undefined> {
    const todo = await this.findById(id);
    if (!todo) return undefined;

    return this.update(id, { completed: !todo.completed });
  },
};
