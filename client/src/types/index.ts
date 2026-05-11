export interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnailUrl: string | null;
  category: {
    id: number;
    name: string;
  };
  instructor: {
    user: {
      firstName: string;
      lastName: string;
    };
  };
  _count?: {
    purchases?: number;
    lessons?: number;
  };
  lessons?: Lesson[];
}

export interface Lesson {
  id: number;
  title: string;
  contentType: 'VIDEO' | 'TEXT' | 'QUIZ' | 'EXERCISE' | 'IMAGE';
  contentPath?: string;
  videoUrl?: string;
  durationMin: number;
  order: number;
  isFree: boolean;
  courseId: number;
}

export interface PaginationData {
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface PaginatedResponse {
  courses: Course[];
  pagination: PaginationData;
}