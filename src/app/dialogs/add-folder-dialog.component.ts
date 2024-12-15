import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-folder-dialog',
  styleUrls: ['./add-folder-dialog.component.scss'],
  template: `
    <div class="dialog-newFolder">
      <h1 mat-dialog-title>Adicionar Nova Pasta</h1>
      <div mat-dialog-content>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nome da Pasta</mat-label>
          <input matInput [(ngModel)]="folderName" />
        </mat-form-field>
      </div>
      <div mat-dialog-actions>
        <button mat-button (click)="onCancel()">Cancelar</button>
        <button mat-raised-button color="primary" (click)="onCreate()">Adicionar</button>
      </div>
    </div>
  `,
  styles: [`.full-width { width: 100%; }`],
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class AddFolderDialogComponent {
  folderName: string = '';

  constructor(private dialogRef: MatDialogRef<AddFolderDialogComponent>) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onCreate(): void {
    if (this.folderName.trim().length >= 3) {
      this.dialogRef.close(this.folderName);
    }
  }
}
