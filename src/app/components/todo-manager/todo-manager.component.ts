import { Component, OnInit } from '@angular/core';
import { TodoItem } from 'src/app/model/todo-item';
import { TodoDataService } from 'src/app/services/todo-data.service';

@Component({
  selector: 'app-todo-manager',
  templateUrl: './todo-manager.component.html',
  styleUrls: ['./todo-manager.component.scss']
})
export class TodoManagerComponent implements OnInit {
  public allItems: TodoItem[] = [];
  public currentItem?: TodoItem;

  constructor(private dataService: TodoDataService) { }

  public ngOnInit(): void {
    this.dataService
      .fetchTodoList()
      .then(result => {
        this.allItems = result;
      })
  }

  public onItemRowClick(item: TodoItem): void {
    this.currentItem = item;
  }

  public onCreateItemClick(): void {
    // Taking a shortcut here and not asking the user for a title
    this.currentItem = this.dataService.addTodo('untitled');
  }

  public onDeleteItemClick(item: TodoItem, event: MouseEvent): void {
    this.dataService.deleteTodo(item);
    event.cancelBubble = true; // avoid onItemRowClick events
  }

  //#region item detail event handlers

  private executeUpdatePropertiesCommand(newValues: Partial<TodoItem>): void {
    if (!this.currentItem)
      return;

    this.dataService.executeCommand('update-properties', { target: this.currentItem, newValues: newValues });
  }

  public onTitleChange(value: string): void {
    this.executeUpdatePropertiesCommand({ title: value });
  }

  public onDescriptionChange(value: string): void {
    this.executeUpdatePropertiesCommand({ description: value });
  }

  public onPriorityUpClick(): void {
    if (!this.currentItem)
      return;

    this.dataService.executeCommand('step-number', { target: this.currentItem, propertyName: 'priority', stepIncrement: 3 });
  }

  public onPriorityDownClick(): void {
    if (!this.currentItem)
      return;

    this.dataService.executeCommand('step-number', { target: this.currentItem, propertyName: 'priority', stepIncrement: -3 });
  }

  public onToggleDoneClick(): void {
    if (!this.currentItem)
      return;

    this.dataService.executeCommand('toggle-boolean', { target: this.currentItem, propertyName: 'done' });
  }

  //#endregion item detail event handlers
}
