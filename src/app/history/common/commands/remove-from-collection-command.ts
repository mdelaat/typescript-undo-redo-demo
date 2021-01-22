import { Command, CommandResult } from '../../model';

interface RemoveElementByReferenceCommandData<TElement> {
  /**
  * The collection from which the element must be removed.
  */
  collection: TElement[];
  /**
   * The element to remove from the collection.
   */
  element: TElement;
  /**
   * Reserved for RemoveElementByIndexCommandData.
   */
  elementIndex?: never;
}

interface RemoveElementByIndexCommandData<TElement> {
  /**
  * The collection from which the element must be removed.
  */
  collection: TElement[];
  /**
   * The 0-based index of the element to remove from the collection.
   */
  elementIndex: number;
  /**
   * Reserved for RemoveElementByIndexCommandData
   */
  element?: never;
}

export type RemoveFromCollectionCommandData<TElement> =
    RemoveElementByReferenceCommandData<TElement>
  | RemoveElementByIndexCommandData<TElement>;

export class RemoveFromCollectionCommand<TElement> implements Command {
  public displayName: string;
  private originalState?: { index: number, element: TElement };

  constructor(private commandData: RemoveFromCollectionCommandData<TElement>) {
    this.displayName = 'Remove from collection';
  }

  public execute(): CommandResult {
    const index = this.getElementIndex();
    if (index < 0) {
      // The element does not exist, or caller provided a negative number.
      return { success: false };
    }
    const collection = this.commandData.collection;
    if (index >= collection.length) {
      // Caller provided a value greater than the length of the array. Avoid Array.splice
      // adding new elements.
      return { success: false };
    }

    this.originalState = { index: index, element: collection[index] };
    collection.splice(index, 1);
    return { success: true, canUndo: true };
  }

  public undo(): CommandResult {
    if (!this.originalState)
      return { success: false };

    const collection = this.commandData.collection;
    collection.splice(this.originalState.index, 0, this.originalState.element);
    this.originalState = undefined;
    return { success: true, canRedo: true };
  }

  public redo(): CommandResult {
    return this.execute();
  }

  private getElementIndex(): number {
    const byReferenceCommand = this.commandData as RemoveElementByReferenceCommandData<TElement>;
    if (byReferenceCommand.element) {
      // Remove by reference
      return this.commandData.collection.indexOf(byReferenceCommand.element);
    }
    else {
      // Remove by index
      return (this.commandData as RemoveElementByIndexCommandData<TElement>).elementIndex;
    }
  }
}
