export interface Folder {
  id: string;
  name: string;
  user_id: string;
  parent_folder_id: string | null;
  status: boolean;
  created_at: string;
  updated_at: string;
  videos_count: string;
}

export interface FolderResponse {
  folders: Folder[];
}

export interface Video {
  length: number;
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  video_player: string;
}

export interface Course {
  id: string;
  name: string;
  topics: Topic[];
  videos: Video[];
}

export interface Topic {
  totalDuration: number;
  id: string;
  name: string;
  videos: Video[];
  subtopics: Topic[];
  expanded?: boolean;
}
