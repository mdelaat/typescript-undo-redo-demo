import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { HistoryStackEntry, HistoryAction } from './history';
import { CommandService } from './services/command.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private commandSuccessSubscription!: Subscription;
  public undoEntries: HistoryStackEntry[] = [];
  public redoEntries: HistoryStackEntry[] = [];

  constructor(private commandService: CommandService) {}

  public ngOnInit(): void {
    this.commandSuccessSubscription = this.commandService
      .commandSuccess()
      .subscribe(args => {
        console.log(`Executed ${HistoryAction[args.action]} command '${args.key}'.`);
        this.updateHistoryTable();
      });
  }

  public ngOnDestroy(): void {
    this.commandSuccessSubscription.unsubscribe();
  }

  private updateHistoryTable(): void {
    this.undoEntries = [...this.commandService.getUndoEntries()].reverse();
    this.redoEntries = [...this.commandService.getRedoEntries()].reverse();
  }


  //#region history event handlers

  public onUndoClick(): void {
    this.commandService.undo();
  }

  public onRedoClick(): void {
    this.commandService.redo();
  }

  @HostListener('document:keydown.control.z', ['$event'])
  public onUndoKey($event: KeyboardEvent) {
    this.commandService.undo();
  }

  @HostListener('document:keydown.control.y', ['$event'])
  public onRedoKey($event: KeyboardEvent) {
    this.commandService.redo();
  }

  public onClearHistoryClick(): void {
    this.commandService.clear();
    this.updateHistoryTable();
  }

  //#endregion history handlers
}
