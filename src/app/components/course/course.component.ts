import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PandaVideosService } from '../../services/panda-videos.service';
import { Course, Topic, Video } from '../../types/video.model';
import { SafeUrlPipe } from '../../pipes/safe-url.pipe';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { AddVideoDialogComponent } from '../../dialogs/add-video-dialog.component';
import { AddFolderDialogComponent } from '../../dialogs/add-folder-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-course',
  standalone: true,
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss'],
  imports: [SafeUrlPipe, CommonModule, MatExpansionModule, MatProgressSpinnerModule]
})
export class CourseComponent implements OnInit {
  course: Course | null = null;
  selectedVideo: Video | null = null;
  isUploading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private pandaVideosService: PandaVideosService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      this.pandaVideosService.getCourses().subscribe((courses) => {
        const foundCourse = courses.find((c) => c.id === courseId);
        if (foundCourse) {
          this.course = foundCourse;

          this.initializeExpandedState(foundCourse.topics);
          this.calculateTopicDurations(foundCourse.topics);

          this.pandaVideosService.getVideosByFolder(foundCourse.id).subscribe((videos) => {
            foundCourse.videos = videos;
            this.loadVideosForTopics(foundCourse.topics);

            const playableVideo = this.findFirstPlayableVideo(foundCourse);
            if (playableVideo) {
              this.selectedVideo = playableVideo;
            }
          });
        }
      });
    }
  }

  private loadVideosForTopics(topics: Topic[]): void {
    topics.forEach((topic) => {
      this.pandaVideosService.getVideosByFolder(topic.id).subscribe((videos) => {
        topic.videos = videos;
        this.calculateTopicDurations([topic]);
        if (topic.subtopics) {
          this.loadVideosForTopics(topic.subtopics); // Recursividade
        }
      });
    });
  }

  private initializeExpandedState(topics: Topic[]): void {
    topics.forEach((topic) => {
      topic.expanded = false; // Inicializar o estado como fechado
      if (topic.subtopics?.length) {
        this.initializeExpandedState(topic.subtopics); // Recursão para sub-tópicos
      }
    });
  }

  private calculateTopicDurations(topics: Topic[]): void {
    topics.forEach((topic) => {
      topic.totalDuration = topic.videos.reduce((sum, video) => sum + video.length, 0);
      if (topic.subtopics?.length) {
        this.calculateTopicDurations(topic.subtopics);
        topic.totalDuration += topic.subtopics.reduce((sum, subtopic) => sum + subtopic.totalDuration, 0);
      }
    });
  }

  playVideo(video: Video): void {
    this.selectedVideo = video;
  }

  formatDuration(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs > 0 ? hrs + ':' : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  private findFirstPlayableVideo(course: Course): Video | null {
    return course.videos.find((video) => video.title !== 'thumbnail') || null;
  }

  get filteredVideos(): Video[] {
    return this.course?.videos?.filter(v => v.title !== 'thumbnail') || [];
  }

  toggleTopic(topic: Topic): void {
    topic.expanded = !topic.expanded;
  }

  openAddVideoDialog(folderId?: string): void {
    const dialogRef = this.dialog.open(AddVideoDialogComponent);
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const { url, title } = result;
        const targetFolderId = folderId || this.course?.id;
  
        if (!targetFolderId) return;
  
        this.pandaVideosService.addVideo({ url, title, folder_id: targetFolderId }).subscribe({
          next: () => console.log('Vídeo adicionado com sucesso!'),
          error: (err) => console.error('Erro ao adicionar vídeo:', err.message)
        });
      }
    });
  }
  
  openAddFolderDialog(parentFolderId?: string): void {
    const dialogRef = this.dialog.open(AddFolderDialogComponent);
  
    dialogRef.afterClosed().subscribe((folderName) => {
      if (folderName && parentFolderId) {
        this.pandaVideosService.createFolder(folderName, parentFolderId).subscribe({
          next: () => console.log('Pasta criada com sucesso!'),
          error: (err) => console.error('Erro ao criar pasta:', err.message)
        });
      }
    });
  }

  handleFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    const folderId = this.course?.id; // ID da pasta raiz do curso
  
    if (file && folderId) {
      // Upload do vídeo com o título 'thumbnail'
      const url = URL.createObjectURL(file); // Simula um URL, ajuste se necessário para o upload real
      this.pandaVideosService.addVideo({ url, title: 'thumbnail', folder_id: folderId }).subscribe({
        next: (video) => {
          // Após o upload, usar o ID do novo vídeo para alterar a thumbnail
          this.pandaVideosService.updateThumbnail(video.id, file).subscribe({
            next: () => alert('Thumbnail alterada com sucesso!'),
            error: (err) => alert('Erro ao alterar a thumbnail: ' + err.message),
          });
        },
        error: (err) => alert('Erro ao fazer upload do vídeo: ' + err.message),
      });
    }
  } 
  
  openFileUploadDialog(folderId?: string): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
  
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        this.isUploading = true; // Começa o upload
        this.pandaVideosService.uploadVideo(file, folderId).subscribe({
          next: () => {
            console.log('Vídeo enviado com sucesso!');
            this.isUploading = false; // Finaliza o upload
          },
          error: (err) => {
            console.error('Erro ao enviar o vídeo:', err.message);
            this.isUploading = false; // Finaliza o upload em caso de erro
          },
        });
      }
    };
  
    input.click();
  }  
  
  private getThumbnailVideoId(): string | null {
    const thumbnailVideo = this.course?.videos.find((video) => video.title === 'thumbnail');
    return thumbnailVideo?.id || null;
  }   
}
