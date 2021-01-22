import { Command, HistoryAction, CommandResult } from './model';
import { HistoryStackEntry, UndoHistory } from './undo-history';

export interface CommandHandlerResult {
  key: string;
  action: HistoryAction,
  result: CommandResult;
}

export class CommandHandler {
  private undoHistory: UndoHistory;

  constructor(undoHistory?: UndoHistory) {
    this.undoHistory = undoHistory || new UndoHistory();
  }

  /**
   * Executes the command, inspects its result and adds it to the undo history.
   * @param key A unique key for the command.
   * @param command The command to execute. This can be any object that implements the Command interface.
   */
  public execute(key: string, command: Command): CommandHandlerResult {
    const commandResult = command.execute();
    if (commandResult.success && commandResult.canUndo) {
      const entry: HistoryStackEntry = { key: key, command: command };
      this.undoHistory.add(entry, commandResult, HistoryAction.Execute);
    }
    return { key: key, result: commandResult, action: HistoryAction.Execute };
  }

  /**
   * Undoes the last successfully executed command.
   */
  public undo(): CommandHandlerResult | undefined {
    const historyItem = this.undoHistory.popUndo();
    if (!historyItem) return;

    const commandResult = historyItem.command.undo();
    return { key: historyItem.key, result: commandResult, action: HistoryAction.Undo };
  }

  /**
   * Redoes the last command that is on the redo-stack and
   * moves it back to the undo history if successfull.
   */
  public redo(): CommandHandlerResult | undefined {
    const entry = this.undoHistory.popRedo();
    if (!entry) return;

    const commandResult = entry.command.redo();
    if (commandResult.success) {
      // Add back to the undo history
      this.undoHistory.add(entry, commandResult, HistoryAction.Redo);
    }

    return { key: entry.key, result: commandResult, action: HistoryAction.Redo };
  }
}
