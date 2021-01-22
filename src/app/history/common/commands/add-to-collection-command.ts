import { Command, CommandResult } from '../../model';

/**
 * Adds an element to a target collection.
 */
export interface AddToCollectionCommandData<TElement> {
  /**
   * The collection to which the element must be added.
   */
  collection: TElement[];
  /**
   * The element to add to the collection.
   */
  element: TElement;
}

export class AddToCollectionCommand<TCollection> implements Command {
  public displayName: string;

  constructor(private commandData: AddToCollectionCommandData<TCollection> ) {
    this.displayName = 'Add to collection';
  }

  public execute(): CommandResult {
    this.commandData.collection.push(this.commandData.element);
    return { success: true, canUndo: true };
  }

  public undo(): CommandResult {
    const collection = this.commandData.collection;
    const index = collection.indexOf(this.commandData.element);
    if (index === -1)
      return { success: false }; // the element does not exist in the collection

    collection.splice(index, 1);
    return { success: true, canRedo: true };
  }

  public redo(): CommandResult {
    return this.execute();
  }
}
