import { Command, CommandResult } from '../../model';
import { PropertiesHavingType } from '../core';

/**
 * Toggles the value of a boolean property.
 */
export interface ToggleBooleanCommandData<TTarget> {
  target: TTarget;
  propertyName: PropertiesHavingType<TTarget, boolean | undefined>;
}

export class ToggleBooleanCommand<T> implements Command {
  public displayName?: string;

  constructor(
    private commandData: ToggleBooleanCommandData<T>
  ) {

  }

  public execute(): CommandResult {
    this.displayName = `Toggle ${this.commandData.propertyName}`;
    return this.toggle();
  }

  public undo(): CommandResult {
    return this.toggle();
  }

  public redo(): CommandResult {
    return this.toggle();
  }

  private toggle(): CommandResult {
    const key = this.commandData.propertyName;

    let value = !!(this.commandData.target as any)[key];
    (this.commandData.target as any)[key] = !value;

    return {
      success: true,
      canUndo: true,
      canRedo: true // this can be repeated infinitely
    };
  }
}
