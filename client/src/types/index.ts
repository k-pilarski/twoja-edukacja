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
}