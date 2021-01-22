import { Command } from '../history';
import { CommonCommandFactory, commonCommandKeys, CommonCommandMap } from '../history/common';

import { TodoItem } from '../model/todo-item';

export interface TodoCommandMap extends CommonCommandMap<TodoItem> {
  // Implement todo-specific commands here
  // 'my-todo-command': MyCommandData;
}

type todoCommandkeys = keyof TodoCommandMap;

export class TodoCommandFactory extends CommonCommandFactory<TodoItem> {
  public create<K extends todoCommandkeys>(key: K, commandData: TodoCommandMap[K]): Command {
    // if (isTodoCommand(commandData, key, 'my-todo-command')) {
    //
    // }
    return super.create(key as commonCommandKeys<TodoItem>, commandData as any);
  }
}

export function isTodoCommand<K extends keyof TodoCommandMap>(
  commandData: TodoCommandMap[keyof TodoCommandMap],
  actualKey: string,
  expectedKey: K): commandData is TodoCommandMap[K] {
  return actualKey === expectedKey;
}
