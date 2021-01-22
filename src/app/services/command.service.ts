import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Command,  CommandHandler, CommandHandlerResult, HistoryStackEntry, UndoHistory } from '../history';

/**
 * An Angular wrapper around the CommandHandler.
 * This wrapper is registered as a singleton service, assuming a single undo
 * stack for the entire application.
 */
@Injectable({ providedIn: 'root' })
export class CommandService {
  private undoHistory: UndoHistory;
  private handler: CommandHandler;
  private commandSuccessSubject = new Subject<CommandHandlerResult>();

  constructor() {
    this.undoHistory = new UndoHistory();
    this.handler = new CommandHandler(this.undoHistory);
  }

  /**
   * An observable that emits a result each time a command is
   * executed or undone successfully.
   */
  public commandSuccess(): Observable<CommandHandlerResult> {
    return this.commandSuccessSubject.asObservable();
  }

  private emitCommandSuccess(handlerResult: CommandHandlerResult | undefined): void {
    if (!handlerResult || !handlerResult.result.success)
      return

    // Notify commandSuccess subscribers
    this.commandSuccessSubject.next(handlerResult);
  }

  public execute(key: string, command: Command): void {
    const executeResult = this.handler.execute(key, command);
    this.emitCommandSuccess(executeResult);
  }

  public undo(): void {
    const undoResult = this.handler.undo();
    this.emitCommandSuccess(undoResult);
  }

  public redo(): void {
    const redoResult = this.handler.redo();
    this.emitCommandSuccess(redoResult);
  }

  public clear(): void {
    this.undoHistory.clear();
  }

  /**
   * Exposes the undo stack. Usually only needed for debugging.
   */
  public getUndoEntries(): HistoryStackEntry[] {
    return this.undoHistory.getUndoEntries();
  }

  /**
   * Exposes the redo stack. Usually only needed for debugging.
   */
  public getRedoEntries(): HistoryStackEntry[] {
    return this.undoHistory.getRedoEntries();
  }
}
