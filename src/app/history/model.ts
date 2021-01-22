export interface CommandResult {
  success: boolean;
  canUndo?: boolean;
  canRedo?: boolean;
}

export interface Command {
  /**
   * Executes the command for the first time.
   */
  execute(): CommandResult;
  /**
   * Cancels the action that was executed by the execute() function.
   */
  undo(): CommandResult;
  /**
  * Re-executes the action that was executed by the execute() function.
  */
  redo(): CommandResult;
  /**
   * An optional name that can be used for logging or debugging.
   */
  displayName?: string;
}

export enum HistoryAction {
  Execute,
  Undo,
  Redo
}
