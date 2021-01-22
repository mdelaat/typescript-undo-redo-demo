import { Command, CommandResult } from '../../model';
import { EmptyValueHandling, PropertiesHavingType } from '../core';

interface CommandDataBase<TParent, TElement> {
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
   * Defines how to deal with the target collection after the last element is removed.
   * By default, the collection is unmodified.
   */
  emptyCollectionHandling?: EmptyValueHandling;
}

interface RemoveElementByReferenceCommandData<TParent, TElement> extends CommandDataBase<TParent, TElement> {
  /**
   * The element to remove from the collection.
   */
  element: TElement;
  /**
   * Reserved for RemoveElementByIndexCommandData.
   */
  elementIndex?: never;
}

interface RemoveElementByIndexCommandData<TParent, TElement> extends CommandDataBase<TParent, TElement> {
  /**
   * The 0-based index of the element to remove from the collection.
   */
  elementIndex: number;
  /**
   * Reserved for RemoveElementByIndexCommandData.
   */
  element?: never;
}

/**
 * Removes an element form a target object's child collection.
 */
export type RemoveFromChildCollectionCommandData<TParent, TElement> =
    RemoveElementByReferenceCommandData<TParent, TElement>
  | RemoveElementByIndexCommandData<TParent, TElement>;

export class RemoveFromChildCollectionCommand<TParent, TElement> implements Command {
  public displayName?: string | undefined;
  private originalState?: { index: number, element: TElement };

  constructor(private commandData: RemoveFromChildCollectionCommandData<TParent, TElement>) {
    this.displayName = `Remove from ${commandData.propertyName}`;
  }

  public execute(): CommandResult {
    const collection = this.getCollection();
    if (!collection) {
      // No collection means nothing to delete either
      return { success: false };
    }

    const index = this.getElementIndex(collection);
    if (index < 0) {
      // The element does not exist in the collection, or the caller provided a negative number.
      return { success: false };
    }
    if (index >= collection.length) {
      // Caller provided a value greater than the length of the array. Avoid Array.splice
      // adding new elements.
      return { success: false };
    }

    this.originalState = { index: index, element: collection[index] };
    collection.splice(index, 1);
    if (!collection.length) {
      // The collection is empty now. Should we clear the property?
      switch (this.commandData.emptyCollectionHandling) {
        case EmptyValueHandling.SetNull:
          this.setCollection(null)
          break;
        case EmptyValueHandling.SetUndefined:
          this.setCollection(undefined);
          break;
      }
    }
    return { success: true, canUndo: true };
  }

  /**
   * Adds the element back into the collection at its original position.
   */
  public undo(): CommandResult {
    if (!this.originalState)
      return { success: false };

    let collection = this.getCollection();
    if (!collection) {
      // The collection does not exist anymore, recreate it
      collection = [this.originalState.element];
      this.setCollection(collection);
    }
    else
      collection.splice(this.originalState.index, 0, this.originalState.element);

    this.originalState = undefined;
    return { success: true, canRedo: true };
  }

  public redo(): CommandResult {
    return this.execute();
  }

  private getElementIndex(collection: TElement[]): number {
    const byReferenceCommand = this.commandData as RemoveElementByReferenceCommandData<TParent, TElement>;
    if (byReferenceCommand.element) {
      // Remove by reference
      return collection.indexOf(byReferenceCommand.element);
    }
    else {
      // Remove by index
      return (this.commandData as RemoveElementByIndexCommandData<TParent, TElement>).elementIndex;
    }
  }

  private getCollection(): TElement[] | undefined {
    return (this.commandData.parent as any)[this.commandData.propertyName];
  }

  private setCollection(collection: TElement[] | undefined | null): void {
    (this.commandData.parent as any)[this.commandData.propertyName] = collection;
  }
}
