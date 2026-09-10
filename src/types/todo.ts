export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'backlog' | 'in_progress' | 'in_review' | 'completed';
export type CategoryTag = 'work' | 'personal' | 'devops' | 'architecture' | 'feature';
export type FilterStatus = 'all' | TaskStatus;
export type SortOption = 'createdAt' | 'dueDate' | 'priority' | 'alphabetical' | 'progress';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  category: CategoryTag;
  subtasks: Array<SubTask>;
  createdAt: string;
  dueDate?: string;
}

/**
 * TypeScript Generic Types & Interfaces:
 * 
 * 1. ActionWrapper<TType, TPayload>:
 *    - Type = ActionWrapper (the payload wrapper class/blueprint)
 *    - Generic <TPayload> = specifies the exact shape of data riding inside this action payload.
 */
export interface ActionWrapper<TType extends string, TPayload> {
  type: TType;
  payload: TPayload;
}

/**
 * 2. StateContainer<TData>:
 *    - Type = StateContainer (the overall state slice class/blueprint)
 *    - Generic <TData> = specifies the element type contained within the items array.
 */
export interface StateContainer<TData> {
  items: Array<TData>;
  selectedIds: Array<string>;
  filterStatus: FilterStatus;
  filterCategory: 'all' | CategoryTag;
  filterPriority: 'all' | Priority;
  searchQuery: string;
  sortBy: SortOption;
  sortDirection: 'asc' | 'desc';
}

/**
 * 3. FilterConfig<TEntity>:
 *    - Generic specification wrapper defining filter criteria over an entity.
 */
export interface FilterConfig<TEntity> {
  status: FilterStatus;
  category: 'all' | CategoryTag;
  priority: 'all' | Priority;
  search: string;
  predicate?: (item: TEntity) => boolean;
}

/**
 * 4. BulkActionWrapper<TTargetId, TValue>:
 *    - Generic payload wrapper for bulk operations across multiple target IDs.
 */
export interface BulkActionWrapper<TTargetId extends string, TValue> {
  targetIds: Array<TTargetId>;
  updateValue: TValue;
}

/**
 * 5. FormDraft<T>:
 *    - Generic Utility using Partial<T> to represent form draft inputs where fields are optional.
 */
export type FormDraft<T> = Partial<T>;

/**
 * 6. PriorityBadgeMap & StatusBadgeMap:
 *    - Record<K, V> utility wrappers.
 */
export type PriorityBadgeMap = Record<Priority, { label: string; bgClass: string; textClass: string }>;
export type StatusBadgeMap = Record<TaskStatus, { label: string; bgClass: string; textClass: string }>;
export type CategoryBadgeMap = Record<CategoryTag, { label: string; bgClass: string; textClass: string }>;
