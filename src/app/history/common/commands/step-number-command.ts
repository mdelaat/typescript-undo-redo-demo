import { Command, CommandResult } from '../../model';
import { PropertiesHavingType } from '../core';

/**
 * Increments a numeric property with a specified amount.
 */
export interface StepNumberCommandData<TTarget> {
  /**
   * The target object.
   */
  target: TTarget;
  /**
   * The name of the numeric property to increment.
   */
  propertyName: PropertiesHavingType<TTarget, number | undefined>;
  /**
   * The value by which the property is incremented. This can also
   * be a negative number, decrementing the value.
   */
  stepIncrement: number;
}

export class StepNumberCommand<T> implements Command {
  public displayName?: string;

  constructor(
    private commandData: StepNumberCommandData<T>
  ) {

  }

  public execute(): CommandResult {
    const key = this.commandData.propertyName;
    this.displayName = this.commandData.stepIncrement > 0 ? `Step ${key}: +${this.commandData.stepIncrement}` : `Step ${key}: ${this.commandData.stepIncrement}`;
    return this.increment(this.commandData.stepIncrement);
  }

  public undo(): CommandResult {
    return this.increment(-this.commandData.stepIncrement);
  }

  public redo(): CommandResult {
    return this.increment(this.commandData.stepIncrement);
  }

  private increment(increment: number): CommandResult {
    const key = this.commandData.propertyName;

    let value = (this.commandData.target as any)[key] as number;
    if (!value) value = 0;

    const newValue = value + increment;

    (this.commandData.target as any)[key] = newValue;

    return {
      success: true,
      canUndo: true,
      canRedo: true // this can be repeated infinitely
    };
  }
}
