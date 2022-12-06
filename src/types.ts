export interface Source {
  id: number;
  baseurl: string;
  logo_uri: string;
}

export interface User {
  id: number;
  email: string;
  following: any[]; // TODO: type this
}

export interface Snippet {
  id: number;
  value: string;
  summary_id: number;
}

export interface Comment {
  id: number;
  snippet_id: number;
  comment: string;
  created_at: string;
  user_id: number;
  summary_id: number;
  avatar_uri?: string;
}

export interface Reaction {
  id: number;
  reaction: string;
  snippet_id: number;
  user_id: number;
  created_at: string;
  summary_id: number;
}

export interface ReactionMap {
  [reaction: string]: number;
}

export interface Summary {
  id?: number;
  url: string;
  title: string;
  user_id: number;
  source_id: number;
  logo_uri?: string;
  source_baseurl?: string;
  avatar_uri?: string;
  username?: string;
  is_archived?: boolean;
  created_at: string;
  updated_at: string;
  comments: Comment[];
  reactions: Reaction[];
  snippets: Snippet[];
  author: User;
}
