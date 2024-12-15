import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-course-dialog',
  styleUrls: ['./add-course-dialog.component.scss'],
  template: `
    <div class="dialog-newCourse">
        <h1 mat-dialog-title>Adicionar Novo Curso</h1>
        <div mat-dialog-content>
            <mat-form-field appearance="outline" class="full-width">
            <mat-label>Nome do Curso</mat-label>
            <input matInput [(ngModel)]="courseName" />
            </mat-form-field>
        </div>
        <div mat-dialog-actions>
            <button mat-button (click)="onCancel()">Cancelar</button>
            <button mat-raised-button color="primary" (click)="onCreate()">Criar</button>
        </div>
    </div>
  `,
  styles: [`
    .full-width {
      width: 100%;
    }
  `],
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class AddCourseDialogComponent {
  courseName: string = '';

  constructor(private dialogRef: MatDialogRef<AddCourseDialogComponent>) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onCreate(): void {
    this.dialogRef.close(this.courseName);
  }
}
