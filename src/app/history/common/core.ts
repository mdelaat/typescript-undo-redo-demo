/**
 * Restrict keyof T so that it only accepts keys that are of a certain type (TK).
 * For example, "key: PropertiesOfType<T, boolean>" restricts key to properties
 * of type T that have a boolean type.
 */
export type PropertiesHavingType<T, TK> = keyof Pick<T, { [K in keyof T]: T[K] extends TK ? K : never }[keyof T]>;

export const enum EmptyValueHandling {
  /**
   * Do not deal with empty values.
   */
  None = 0,
  /**
   * Set the value to undefined.
   */
  SetUndefined = 1,
  /**
   * Set the value to null.
   */
  SetNull = 2
}
