/**
 * Represents a single item on a todo list.
 */
export interface TodoItem {
  /**
   * A unique item ID.
   */
  id: number;

  /**
   * The title of the TODO item.
   */
  title: string;

  /**
   * The item description.
   */
  description?: string;

  /**
   * An integer that indicates the item priority.
   */
  priority?: number;

  /**
   * True if the item is done.
   */
  done?: boolean;
}
