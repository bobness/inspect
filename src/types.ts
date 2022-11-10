export interface Source {
  id: number;
  baseurl: string;
  logo_uri: string;
}

export interface User {
  id: number;
  email: string;
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

export interface Summary {
  id?: number;
  url: string;
  title: string;
  user_id: number;
  source_id: number;
  is_draft: boolean;
  logo_uri?: string;
  avatar_uri?: string;
  is_archived?: boolean;
  updated_at: string;
  comments?: Comment[];
  reactions?: Reaction[];
  snippets?: any[]; // TODO: type Snippets
}
