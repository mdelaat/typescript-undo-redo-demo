import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TodoItem } from '../model/todo-item';
import { CommandService } from './command.service';
import { TodoCommandFactory, TodoCommandMap } from './todo-commands';

@Injectable({ providedIn: 'root' })
export class TodoDataService implements OnDestroy {
  private commandFactory: TodoCommandFactory;
  private commandSuccessSubscription!: Subscription;

  private todoData: TodoItem[] = [
    { id: 1, title: 'Create data model', description: 'Create the application\'s data model.', priority: 1, done: true },
    { id: 2, title: 'Define mock data', description: 'Create some realistic mock data.', priority: 2 },
    { id: 3, title: 'Create main layout', description: 'Create the main layout and navigation for the application.', priority: 3 },
    { id: 4, title: 'Design pages', description: 'Create initial design of most important pages.', priority: 4 },
    { id: 5, title: 'Get customer feedback', description: 'Get feedback on the design from the customer.', priority: 5 }
  ]

  constructor(private commandService: CommandService) {
    this.commandFactory = new TodoCommandFactory();
    this.commandSuccessSubscription = commandService
      .commandSuccess()
      .subscribe((args) => {
        const key = args.key as keyof TodoCommandMap; // contains the command's unique key
        const action = args.action; //  Execute, Undo, or Redo
        // TODO: you might want to sync your data here
      });
  }

  public fetchTodoList(): Promise<TodoItem[]> {
    // TODO: you might want to make the todo list observable
    return Promise.resolve(this.todoData);
  }

  public executeCommand<K extends keyof TodoCommandMap>(key: K, commandData: TodoCommandMap[K]) {
    const command = this.commandFactory.create(key, commandData);
    this.commandService.execute(key, command);
  }

  public addTodo(title: string): TodoItem {
    const newItem: TodoItem = { id: this.todoData.length + 1, title: title};
    this.executeCommand('add-to-collection', { collection: this.todoData, element: newItem });
    return newItem;
  }

  public deleteTodo(item: TodoItem): void {
    this.executeCommand('remove-from-collection', { collection: this.todoData, element: item });
  }

  public ngOnDestroy(): void {
    this.commandSuccessSubscription.unsubscribe();
  }
}
