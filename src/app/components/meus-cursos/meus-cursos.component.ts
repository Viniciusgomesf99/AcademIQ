import { Component, OnInit } from '@angular/core';
import { PandaVideosService } from '../../services/panda-videos.service';
import { Course, Topic } from '../../types/video.model';
import { MatDialog } from '@angular/material/dialog';
import { AddCourseDialogComponent } from '../../dialogs/add-course-dialog.component'; // Novo dialog
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-meus-cursos',
  standalone: true,
  templateUrl: './meus-cursos.component.html',
  styleUrls: ['./meus-cursos.component.scss'],
  imports: [CommonModule, RouterModule, FormsModule]
})
export class MeusCursosComponent implements OnInit {
  courses: Course[] = [];
  errorMessage: string | null = null;

  constructor(
    private pandaVideosService: PandaVideosService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  private loadCourses(): void {
    this.pandaVideosService.getCourses().subscribe(
      (courses) => {
        this.courses = courses;
        this.courses.forEach((course) => {
          this.loadVideosForFolder(course);
          course.topics.forEach((topic) => this.loadVideosForTopics(topic));
        });
      },
      (error) => {
        console.error('Erro ao carregar os cursos:', error);
        this.errorMessage = 'Erro ao carregar os cursos. Tente novamente mais tarde.';
      }
    );
  }

  private loadVideosForFolder(course: Course): void {
    this.pandaVideosService.getVideosByFolder(course.id).subscribe((videos) => {
      course.videos = videos;
    });
  }

  private loadVideosForTopics(topic: Topic): void {
    this.pandaVideosService.getVideosByFolder(topic.id).subscribe({
      next: (videos) => {
        topic.videos = videos;
        if (topic.subtopics) {
          topic.subtopics.forEach((subtopic: Topic) => this.loadVideosForTopics(subtopic));
        }
      },
      error: (error) => {
        console.error(`Error loading videos for folder ${topic.id}:`, error);
        topic.videos = [];
      },
    });
  }

  openAddCourseDialog(): void {
    const dialogRef = this.dialog.open(AddCourseDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.addCourse(result);
      }
    });
  }

  addCourse(courseName: string): void {
    if (courseName.trim().length < 3) {
      this.errorMessage = 'O nome do curso deve ter pelo menos 3 caracteres.';
      return;
    }

    this.pandaVideosService.createFolder(courseName).subscribe({
      next: (newCourse) => {
        this.courses.push({ id: newCourse.id, name: newCourse.name, topics: [], videos: [] });
        this.errorMessage = null;
      },
      error: (error) => {
        console.error('Erro ao criar o curso:', error);
        this.errorMessage = 'Erro ao criar o curso. Tente novamente mais tarde.';
      },
    });
  }

  getThumbnail(course: Course): string | null {
    const thumbnailVideo = course.videos.find(video => video.title === 'thumbnail');
    return thumbnailVideo ? thumbnailVideo.thumbnail : null;
  }
}
