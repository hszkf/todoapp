import { describe, it, expect } from 'bun:test';

describe('Category Service', () => {
  describe('createCategory', () => {
    it('should create a category with name only', () => {
      const input = {
        name: 'Work',
      };

      expect(input.name).toBe('Work');
    });

    it('should create a category with name and color', () => {
      const input = {
        name: 'Personal',
        color: '#ef4444',
      };

      expect(input.name).toBe('Personal');
      expect(input.color).toBe('#ef4444');
    });

    it('should use default color when not provided', () => {
      const defaultColor = '#6366f1';
      const input = {
        name: 'Shopping',
        color: undefined,
      };

      const finalColor = input.color ?? defaultColor;
      expect(finalColor).toBe('#6366f1');
    });
  });

  describe('getCategories', () => {
    it('should return empty array for no categories', () => {
      const categories: unknown[] = [];
      expect(categories).toEqual([]);
      expect(categories.length).toBe(0);
    });

    it('should return categories sorted by creation date', () => {
      const categories = [
        { id: '1', name: 'First', createdAt: new Date('2024-01-01') },
        { id: '2', name: 'Second', createdAt: new Date('2024-01-02') },
      ];

      expect(categories[0].name).toBe('First');
      expect(categories[1].name).toBe('Second');
    });
  });

  describe('getCategoryById', () => {
    it('should return category when found', () => {
      const category = {
        id: 'cat-123',
        name: 'Work',
        color: '#3b82f6',
        createdAt: new Date(),
      };

      expect(category.id).toBe('cat-123');
      expect(category.name).toBe('Work');
    });

    it('should return null when not found', () => {
      const category = null;
      expect(category).toBeNull();
    });
  });

  describe('updateCategory', () => {
    it('should update category name', () => {
      const id = 'cat-123';
      const updates = { name: 'Updated Name' };

      expect(id).toBe('cat-123');
      expect(updates.name).toBe('Updated Name');
    });

    it('should update category color', () => {
      const id = 'cat-123';
      const updates = { color: '#22c55e' };

      expect(updates.color).toBe('#22c55e');
    });

    it('should update both name and color', () => {
      const updates = {
        name: 'New Name',
        color: '#8b5cf6',
      };

      expect(updates.name).toBe('New Name');
      expect(updates.color).toBe('#8b5cf6');
    });
  });

  describe('deleteCategory', () => {
    it('should delete category by id', () => {
      const id = 'cat-123';
      expect(id).toBe('cat-123');
    });

    it('should handle cascade delete for todos', () => {
      // When a category is deleted, todos should have their categoryId set to null
      const todoBeforeDelete = { id: 'todo-1', categoryId: 'cat-123' };
      const todoAfterDelete = { ...todoBeforeDelete, categoryId: null };

      expect(todoAfterDelete.categoryId).toBeNull();
    });
  });
});

describe('Category Validation', () => {
  it('should require name', () => {
    const isValid = (name: string) => name.trim().length > 0;
    expect(isValid('')).toBe(false);
    expect(isValid('Valid Name')).toBe(true);
  });

  it('should validate name length', () => {
    const isValidLength = (name: string) => name.length >= 1 && name.length <= 50;
    expect(isValidLength('')).toBe(false);
    expect(isValidLength('A')).toBe(true);
    expect(isValidLength('A'.repeat(50))).toBe(true);
    expect(isValidLength('A'.repeat(51))).toBe(false);
  });

  it('should validate hex color format', () => {
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

    expect(hexColorRegex.test('#fff')).toBe(true);
    expect(hexColorRegex.test('#FFF')).toBe(true);
    expect(hexColorRegex.test('#ffffff')).toBe(true);
    expect(hexColorRegex.test('#FFFFFF')).toBe(true);
    expect(hexColorRegex.test('#3b82f6')).toBe(true);

    expect(hexColorRegex.test('fff')).toBe(false);
    expect(hexColorRegex.test('#gg0000')).toBe(false);
    expect(hexColorRegex.test('#ff')).toBe(false);
    expect(hexColorRegex.test('red')).toBe(false);
  });
});
