import { Command, CommandResult } from '../../model';
import { PropertiesHavingType } from '../core';

/**
 * Adds an element to a target object's child collection.
 */
export interface AddToChildCollectionCommandData<TParent, TElement> {
  /**
   * The target object that has a collection property of type TElement.
   */
  parent: TParent;
  /**
   * The property name of the child collection. The name must be
   * an Array<TElement> property of TParent.
   */
  propertyName: PropertiesHavingType<TParent, TElement[] | undefined>;
   /**
   * The element to add to the collection.
   */
  element: TElement;
}

export class AddToChildCollectionCommand<TTarget, TElement> implements Command {
  public displayName: string | undefined;
  private createdCollection: boolean = false;

  constructor(private commandData: AddToChildCollectionCommandData<TTarget, TElement>) {
    this.displayName = `Add to ${commandData.propertyName}`;
  }

  public execute(): CommandResult {
    let collection: TElement[] | undefined = this.getCollection();
    if (!collection) {
      // The collection does not exist yet, create it
      collection = [];
      this.setCollection(collection);
      this.createdCollection = true; // so that we can cleanup after ourselves after an undo
    }

    collection.push(this.commandData.element);
    return { success: true, canUndo: true };
  }

  public undo(): CommandResult {
    let collection = this.getCollection();
    if (!collection) {
      // The collection does not exist anymore
      return { success: false };
    }
    const index = collection.indexOf(this.commandData.element);
    if (index === -1) {
      // The element does not exist in the collection
      return { success: false };
    }

    // The element exists: remove it
    collection.splice(index, 1);

    // Cleanup if we created the collection
    if (!collection.length && this.createdCollection) {
      this.setCollection(undefined);
      this.createdCollection = false;
    }
    return { success: true, canRedo: true };
  }

  public redo(): CommandResult {
    return this.execute();
  }

  private getCollection(): TElement[] | undefined {
    return (this.commandData.parent as any)[this.commandData.propertyName];
  }

  private setCollection(collection: TElement[] | undefined): void {
    (this.commandData.parent as any)[this.commandData.propertyName] = collection;
  }
}
