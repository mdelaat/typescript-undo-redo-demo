import { Command, CommandResult } from '../../model';

/**
 * Updates multiple properties of a target object.
 */
export interface UpdatePropertiesCommandData<TTarget> {
  /**
   * The target object.
   */
  target: TTarget;
  /**
   * A partial instance of the target type with only the values to be updated.
   */
  newValues: Partial<TTarget>;
}

export class UpdatePropertiesCommand<T> implements Command {
  private previousValues?: Partial<T>;
  public displayName?: string;

  constructor(
    private commandData: UpdatePropertiesCommandData<T>
  ) {

  }

  public execute(): CommandResult {
    const newValues = this.commandData.newValues;
    if (!newValues) {
      return { success: false };
    }

    this.displayName = `Update ${Object.keys(this.commandData.newValues).join(' | ')}`;

    this.previousValues = this.updateProperties(newValues);
    return {
      success: true,
      canUndo: true,
      canRedo: false // setting the same properties twice is not useful
     };
  }

  public undo(): CommandResult {
    if (!this.previousValues)
      return { success: false };

    this.updateProperties(this.previousValues);
    this.previousValues = undefined;
    return { success: true };
  }

  public redo(): CommandResult {
    if (this.previousValues) // we can only redo in this state
      return { success: false };

    return this.execute();
  }

  private updateProperties(newValues: Partial<T>): Partial<T> {
    const target = this.commandData.target;
    const keys = Object.keys(newValues);

    const previousValues: Partial<T> = {};
    keys.forEach(key => {
      // 1: store the current value for an undo
      (previousValues as any)[key] = (target as any)[key];
      // 2: update
      (target as any)[key] = (newValues as any)[key];
    });

    return previousValues;
  }
}
