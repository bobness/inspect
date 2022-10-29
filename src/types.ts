export interface Source {
  id: number;
  baseurl: string;
  logo_uri: string;
}

export interface User {
  id: number;
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
}
