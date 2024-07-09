import { EditorState } from 'lexical';
import { User } from '@supabase/supabase-js';

export type ProfileEntry = {
  id: string;
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
  description: string | EditorState;
  example: boolean;
  private: boolean;
};

export type NovelPrivateDetails = {
  novel_id: string;
  owner_id: string;
  password: string | null;
}

export type Novel_Member = {
  novel_id: string;
  user_id: string;
  last_seen_at: string;
  previous_seen_at: string;
};


export type NovelWithUsers = Omit<Novel, 'owner'> & { owner: BasicProfile; members: Novel_Member[] };
export type NovelWithMemberIds = Omit<NovelWithUsers, 'members'> & { members: { user_id: string }[] };
export type Page = {
  id: string;
  created_at: string;
  updated_at: string;
  novel_id: string;
  owner: string;
  reference_title: string;
  published: string | EditorState;
  private: boolean;
  enable_collab: boolean;
  example: boolean;
};

export type PagePrivateDetails = {
  page_id: string;
  owner_id: string;
  password: string | null;
}

export type Page_Member = {
  page_id: string;
  user_id: string;
  last_seen_message_id: string;
};

export type PageWithUsers = Omit<Page, 'owner'> & { owner: BasicProfile; members: { profiles: BasicProfile }[] };
export type PageWithOwner = Omit<Page, 'owner'> & { owner: BasicProfile };

export type AuthProfileEntry = User & {
  user_metadata: {
    avatar?: string | null;
    color: string;
    username: string;
    tutorial_library: boolean;
    tutorial_novel: boolean;
    tutorial_page: boolean;
    last_logout: string;
  };
};

export type UserDataEntry = AuthProfileEntry['user_metadata'] & { id: string };

export type Message = {
  id: string;
  created_at: string;
  updated_at: string;
  page_id: string;
  user_id: string;
  message: string | EditorState;
}

export type MessageWithUser = Message & { user: BasicProfile };

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

export type OnlineUser = { novel_id: string; page_id: string; room: string; user_id: string };

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

// Used for tailwind extension
export type Escape = (className: string) => string;
