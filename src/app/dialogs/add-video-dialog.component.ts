import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-video-dialog',
  styleUrls: ['./add-video-dialog.component.scss'],
  template: `
    <div class="dialog-newVideo">
      <h1 mat-dialog-title>Adicionar Novo Vídeo</h1>
      <div mat-dialog-content>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>URL do Vídeo (M3U8)</mat-label>
          <input matInput [(ngModel)]="url" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Título do Vídeo</mat-label>
          <input matInput [(ngModel)]="title" />
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
export class AddVideoDialogComponent {
  url: string = '';
  title: string = '';

  constructor(private dialogRef: MatDialogRef<AddVideoDialogComponent>) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onCreate(): void {
    if (this.url && this.title) {
      this.dialogRef.close({ url: this.url, title: this.title });
    }
  }
}
