import { InitialEditorStateType } from '@lexical/react/LexicalComposer';
import { User } from '@supabase/supabase-js';

export type ProfileEntry = {
  id: string;
  email: string;
  username: string;
  color: string;
  avatar: string | null;
  created_at: string;
  updated_at: string;
};

export type BasicProfile = Pick<ProfileEntry, 'id' | 'username' | 'color' | 'avatar'>;

export type Novel = {
  id: string;
  created_at: string;
  updated_at: string;
  owner: string;
  title: string;
  description: InitialEditorStateType;
  pages: string[];
};

export type NovelWithUsers = Omit<Novel, 'owner'> & { owner: BasicProfile; members: BasicProfile[] };
export type NovelWithMemberIds = Omit<NovelWithUsers, 'members'> & { members: { user_id: string }[] };
export type Page = {
  id: string;
  created_at: string;
  updated_at: string;
  novel_id: string;
  owner: string;
  reference_title: string;
  index: number;
  published: InitialEditorStateType;
  collab: number[];
  comments: number[];
  chat: number[];
  enable_collab: boolean;
};

export type PageWithUsers = Omit<Page, 'owner'> & { owner: BasicProfile; members: BasicProfile[] };
export type PageWithOwner = Omit<Page, 'owner'> & { owner: BasicProfile };

export type AuthProfileEntry = User & {
  user_metadata: {
    avatar?: string;
    color: string;
    username: string;
  };
};

export type UserDataEntry = Omit<ProfileEntry, 'created_at' | 'updated_at' | 'email'>;

export type Message = {
  id: string;
  created_at: string;
  updated_at: string;
  page_id: string;
  user_id: string;
  message: string;
}

export type MessageWithUser = Message & { user: BasicProfile };

export type SVG_Stoke_Component_props = {
  className: string;
  svgColor?: string;
  uniqueId: string;
  svgStroke?: string;
};

export type SVG_Component_props = Omit<SVG_Stoke_Component_props, 'svgStroke'>;

export type Unit =
  | '%'
  | 'cm'
  | 'mm'
  | 'Q'
  | 'in'
  | 'pc'
  | 'pt'
  | 'px'
  | 'em'
  | 'ex'
  | 'ch'
  | 'rem'
  | 'lh'
  | 'vw'
  | 'vh'
  | 'vmin'
  | 'vmax';

// update - new and old
// delete - old
// insert - new?
export type SupabaseBroadcast = {
  commit_timestamp: string;
  errors: null | Error;
  eventType: 'UPDATE' | 'DELETE' | 'INSERT';
  new: unknown;
  old: unknown;
  schema: 'Public';
  table: string;
};

export type Page_Member = {
  page_id: string;
  user_id: string;
};

export type Novel_Member = {
  novel_id: string;
  user_id: string;
};

export type OnlineUser = { novel_id: string; page_id: string; room: string; user_id: string };

// Used for tailwind extension
export type Escape = (className: string) => string;
