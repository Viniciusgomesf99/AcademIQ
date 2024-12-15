import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { FolderResponse, Folder, Course, Topic, Video } from '../types/video.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PandaVideosService {

  constructor(private http: HttpClient) {}

  // Pegar pastas (folders)
  getFolders(): Observable<Folder[]> {
    const headers = new HttpHeaders({
      Authorization: environment.pandaApiKey,
      Accept: 'application/json',
    });

    return this.http
      .get<FolderResponse>(`${environment.pandaApiUrl}/folders`, { headers })
      .pipe(map((response) => response.folders || []));
  }

  // Pegar vídeos de uma pasta
  getVideosByFolder(folderId: string): Observable<Video[]> {
    const headers = new HttpHeaders({
      Authorization: environment.pandaApiKey,
    });

    const params = new HttpParams().set('folder_id', folderId);

    return this.http
      .get<{ videos: Video[] }>(`${environment.pandaApiUrl}/videos`, { headers, params })
      .pipe(map((response) => response.videos));
  }

  // Pegar os cursos principais
  getCourses(): Observable<Course[]> {
    return this.getFolders().pipe(
      map((folders) => {
        const mainFolders = folders.filter((folder) => folder.parent_folder_id === null);

        return mainFolders.map((mainFolder) => this.buildCourse(mainFolder, folders));
      })
    );
  }

  private buildCourse(mainFolder: Folder, allFolders: Folder[]): Course {
    const topics = this.getSubFolders(mainFolder.id, allFolders);

    return {
      id: mainFolder.id,
      name: mainFolder.name,
      topics: topics,
      videos: [],
    };
  }

  private getSubFolders(folderId: string, allFolders: Folder[]): Topic[] {
    const subfolders = allFolders.filter((folder) => folder.parent_folder_id === folderId);

    return subfolders.map((subfolder) => ({
      id: subfolder.id,
      name: subfolder.name,
      subtopics: this.getSubFolders(subfolder.id, allFolders),
      videos: [],
      totalDuration: 0,
    }));
  }

  createFolder(name: string, parentFolderId?: string): Observable<Folder> {
    const headers = new HttpHeaders({
      Authorization: environment.pandaApiKey,
      Accept: 'application/json',
    });
  
    // Cria o corpo da requisição sem incluir `parent_folder_id` se ele for `undefined`
    const body: any = { name };
    if (parentFolderId) {
      body.parent_folder_id = parentFolderId;
    }
  
    return this.http.post<Folder>(
      `${environment.pandaApiUrl}/folders`,
      body,
      { headers }
    );
  }  

  // Alterar thumbnail
  updateThumbnail(videoId: string, file: File): Observable<void> {
    const headers = new HttpHeaders({
      Authorization: environment.pandaApiKey,
    });
  
    const formData = new FormData();
    formData.append('file', file);
  
    return this.http.post<void>(
      `${environment.pandaApiUrl}/thumbs/${videoId}`,
      formData,
      { headers }
    );
  }  

  addVideo(videoData: { url: string; title: string; folder_id: string }): Observable<Video> {
    const headers = new HttpHeaders({
      Authorization: environment.pandaApiKey,
      Accept: 'application/json',
    });
  
    return this.http.post<Video>(
      'https://import.pandavideo.com:9443/videos/m3u8',
      videoData,
      { headers }
    );
  }

  uploadVideo(file: File, folderId?: string): Observable<void> {
    const API_KEY = environment.pandaApiKey;
    const metadata: string[] = [
      `authorization ${btoa(API_KEY)}`,
      `filename ${btoa(file.name)}`,
    ];
  
    if (folderId) {
      metadata.push(`folder_id ${btoa(folderId)}`);
    }
  
    return this.http.get<{ hosts: Record<string, string[]> }>(`${environment.pandaApiUrl}/hosts/uploader`, {
      headers: { Authorization: API_KEY },
    }).pipe(
      switchMap((response) => {
        const allHosts = Object.values(response.hosts).flat();
        const selectedHost = allHosts[Math.floor(Math.random() * allHosts.length)];
  
        const formData = new FormData();
        formData.append('file', file);
  
        return this.http.post<void>(`https://${selectedHost}.pandavideo.com.br/files`, file, {
          headers: {
            'Tus-Resumable': '1.0.0',
            'Upload-Length': file.size.toString(),
            'Content-Type': 'application/offset+octet-stream',
            'Upload-Metadata': metadata.join(', '),
          },
        });
      }),
      catchError((err) => {
        console.error('Erro no upload de vídeo:', err);
        return throwError(() => new Error('Falha no upload do vídeo.'));
      })
    );
  }
    
}
