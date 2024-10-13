import { SupportedOauthProviders } from './auth.model';

export interface ApiError<T = void> {
  code: string;
  message?: string;
  isError: boolean;
  data?: T;
}

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  image: string;
  authType: SupportedOauthProviders;
  createdAt: Date;
  accessToken: any;
}

export interface ApiPreviewPost {
  postId: number;
  title: string;
  description: string;
  tags: string[];
  postCreatedAt: Date;
  userId: number;
  name: string;
  image: string;
  likes: number;
  readTime: number;

  _id: any;
  createdAt: Date;
  author: string;
  authorId: number;
  body: string;
  chapter: number;
  notesBoard: string;
  notesClass: string;
  notesSubject: string;
  updatedAt: Date;
}

export interface ApiUserStatistics {
  userPosts: number;
  userLikes: number;
  userStreak: number;
}

export interface ApiStatistics {
  totalPosts: number;
  postsLastWeek: number;
}

export interface ApiFullPost extends ApiPreviewPost {
  content: string;
  authorId: number;
}

export type ApiPost = ApiPreviewPost & {
  userHasLiked: boolean;
};

export interface ApiPreviewPosts {
  posts: ApiPreviewPost[];
  hasMore: boolean;
}
