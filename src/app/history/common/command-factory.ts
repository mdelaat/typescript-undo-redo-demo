import { Command } from '../model';
import { commonCommandKeys, CommonCommandMap, isCommonCommand } from './command-map';

// Specific commands
import { StepNumberCommand } from './commands/step-number-command';
import { ToggleBooleanCommand } from './commands/toggle-boolean-command';
import { UpdatePropertiesCommand } from './commands/update-properties-command';
import { UpdatePropertyCommand } from './commands/update-property-command';
import { AddToCollectionCommand } from './commands/add-to-collection-command';
import { AddToChildCollectionCommand } from './commands/add-to-child-collection-command';
import { RemoveFromCollectionCommand } from './commands/remove-from-collection-command';
import { RemoveFromChildCollectionCommand } from './commands/remove-from-child-collection-command';

export class CommonCommandFactory<TTarget> {
  public create<K extends commonCommandKeys<TTarget>>(key: K, commandData: CommonCommandMap<TTarget>[K]): Command {
    if (isCommonCommand(commandData, key, 'update-properties')) {
      return new UpdatePropertiesCommand<TTarget>(commandData);
    }
    if (isCommonCommand(commandData, key, 'update-property')) {
      return new UpdatePropertyCommand<TTarget>(commandData);
    }
    else if (isCommonCommand(commandData, key, 'step-number')) {
      return new StepNumberCommand(commandData);
    }
    else if (isCommonCommand(commandData, key, 'toggle-boolean')) {
      return new ToggleBooleanCommand(commandData);
    }
    else if (isCommonCommand(commandData, key, 'add-to-collection')) {
      return new AddToCollectionCommand(commandData);
    }
    else if (isCommonCommand(commandData, key, 'add-to-child-collection')) {
      return new AddToChildCollectionCommand(commandData);
    }
    else if (isCommonCommand(commandData, key, 'remove-from-collection')) {
      return new RemoveFromCollectionCommand(commandData);
    }
    else if (isCommonCommand(commandData, key, 'remove-from-child-collection')) {
      return new RemoveFromChildCollectionCommand(commandData);
    }
    else
      throw `Unable to create common command. Unknown command key '${key}'.`;
  }
}
