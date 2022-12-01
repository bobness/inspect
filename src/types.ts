export interface Source {
  id: number;
  baseurl: string;
  logo_uri: string;
}

export interface User {
  id: number;
  email: string;
  followers: any[]; // TODO: type this
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
  is_draft: boolean;
  logo_uri?: string;
  avatar_uri?: string;
  username?: string;
  is_archived?: boolean;
  updated_at: string;
  comments: Comment[];
  reactions: Reaction[];
  snippets: Snippet[];
}
