import { Command, HistoryAction, CommandResult } from './model';
import { Stack } from './stack';

export interface HistoryStackEntry {
  key: string;
  command: Command;
}

export class UndoHistory {
  private undoStack: Stack<HistoryStackEntry> = new Stack();
  private redoStack: Stack<HistoryStackEntry> = new Stack();

  public add(
    entry: HistoryStackEntry,
    result: CommandResult,
    action: HistoryAction): void {

    if (result.canUndo)
      this.undoStack.push(entry);

    let canRedo: boolean = false;
    switch (action) {
      case HistoryAction.Execute:
        this.redoStack.clear();
        canRedo = !!result.canRedo;
        break;
      case HistoryAction.Redo:
        // If the redo can repeated, add back to the redo stack, but only if it was the last command
        canRedo = !!result.canRedo && !this.redoStack.peek();
        break;
    }

    if (canRedo)
      this.pushRedo(entry);
  }

  private pushRedo(entry: HistoryStackEntry): void {
    const nextRedoEntry = this.redoStack.peek();
    if (nextRedoEntry == null || nextRedoEntry !== entry)
      this.redoStack.push(entry);
  }

  public getUndoEntries(): HistoryStackEntry[] {
    return this.undoStack.getAll();
  }

  public getRedoEntries(): HistoryStackEntry[] {
    return this.redoStack.getAll();
  }

  public clear() {
    this.undoStack.clear();
    this.redoStack.clear();
  }

  public popUndo(): HistoryStackEntry | undefined {
    const entry = this.undoStack.pop();
    if (entry) {
      this.pushRedo(entry);
    }
    return entry;
  }


  public popRedo(): HistoryStackEntry | undefined {
    // The item should be pushed back onto the undo-stack if executed succesfully.
    return this.redoStack.pop();
  }

  public peekRedo(): HistoryStackEntry | undefined {
    return this.redoStack.peek();
  }
}
