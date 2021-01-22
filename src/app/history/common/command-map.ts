import { AddToChildCollectionCommandData } from './commands/add-to-child-collection-command';
import { AddToCollectionCommandData } from './commands/add-to-collection-command';
import { RemoveFromChildCollectionCommandData } from './commands/remove-from-child-collection-command';
import { RemoveFromCollectionCommandData } from './commands/remove-from-collection-command';
import { StepNumberCommandData } from './commands/step-number-command';
import { ToggleBooleanCommandData } from './commands/toggle-boolean-command';
import { UpdatePropertiesCommandData } from './commands/update-properties-command';
import { UpdatePropertyCommandData } from './commands/update-property-command';

/**
 * Maps common command keys to the command data that is needed to
 * execute them.
 */
export interface CommonCommandMap<TTarget> {
  'update-property': UpdatePropertyCommandData<TTarget>;
  'update-properties': UpdatePropertiesCommandData<TTarget>;
  'add-to-collection': AddToCollectionCommandData<TTarget>;
  'add-to-child-collection': AddToChildCollectionCommandData<TTarget, any>;
  'remove-from-collection': RemoveFromCollectionCommandData<TTarget>;
  'remove-from-child-collection': RemoveFromChildCollectionCommandData<TTarget, any>;
  'step-number': StepNumberCommandData<TTarget>;
  'toggle-boolean': ToggleBooleanCommandData<TTarget>;
}

export type commonCommandKeys<T> = keyof CommonCommandMap<T>;

/**
 * A simple helper function that asserts that the command-data/key combination
 * correspond to an expected key in the CommonCommandMap.
 * @example if (isCommonCommand(commandData, key, 'update-properties')) {
 *     return new UpdatePropertiesCommand<T>(commandData); // yes, commandData is UpdatePropertiesCommandData<T>
 *   }
 */
export function isCommonCommand<T, K extends keyof CommonCommandMap<T>>(
  commandData: CommonCommandMap<T>[keyof CommonCommandMap<T>],
  actualKey: string,
  expectedKey: K): commandData is CommonCommandMap<T>[K] {
  return actualKey === expectedKey;
}
