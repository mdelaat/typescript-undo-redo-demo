import { Command, CommandResult } from '../../model';

/**
 * Updates a single property of a target object.
 */
export interface UpdatePropertyCommandData<TTarget> {
  /**
   * The target object.
   */
  target: TTarget;
  /**
   * The name of the property to be updated. The name must be a property of TTarget.
   */
  propertyName: keyof(TTarget);
  /**
   * The new property value.
   */
  newValue?: any;
}

export class UpdatePropertyCommand<TTarget> implements Command {
  private previousValue?: any;
  public displayName: string;

  constructor(private commandData: UpdatePropertyCommandData<TTarget>) {
    this.displayName = `Update ${commandData.propertyName}`;
  }

  public execute(): CommandResult {
    this.previousValue = this.updateProperty(this.commandData.newValue);
    return { success: true, canUndo: true };
  }

  public undo(): CommandResult {
    this.updateProperty(this.previousValue);
    this.previousValue = undefined;
    return { success: true, canRedo: true };
  }

  public redo(): CommandResult {
    return this.execute();
  }

  private updateProperty(value?: any): any {
    const target = this.commandData.target;
    const key = this.commandData.propertyName;

    const currentValue = target[key];
    target[key] = value;
    return currentValue;
  }
}
