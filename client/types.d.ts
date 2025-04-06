declare module 'lodash';
declare module 'react-helmet';
declare module 'editorjs-text-alignment-blocktune' {
  const TextAlignTune: any;
  export default TextAlignTune;
}
declare module '@editorjs/embed' {
  import { ToolConstructable } from '@editorjs/editorjs';
  const Embed: ToolConstructable;
  export default Embed;
}

export type TProfile = TProfileBadge & {
  pronouns: string;
  title: string;
  location: string;
  birthdate: string;
  bio: string;
  age: string;
  coverPhoto: string;
  socials: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    github: string;
    website: string;
  };
  tags: string[];
  createdAt: string;
};

export type TProfileBadge = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
};

export type TPosts = TPostItem[];

export type TPostItem = {
  id: string;
  title: string;
  content: string;
  creator: TProfileBadge;
  tags: string[];
  likeCount: number;
  commentCount: number;
  saveCount: number;
  createdAt: string;
};

export type TPostDetails = TPostItem & {
  likes: TLikeItem[];
  comments: TCommentItem[];
  saves: TSaveItem[];
  isLiked: boolean;
  isCommented: boolean;
  isSaved: boolean;
};

export type TLikeItem = {
  id: string;
  liker: TProfileBadge;
  createdAt: string;
};

export type TCommentItem = {
  id: string;
  body: string;
  commentor: TProfileBadge;
  replies: TReplyItem[];
  likes: TLikeItem[];
  isEdited: boolean;
  createdAt: string;
};

export type TReplyItem = {
  id: string;
  body: string;
  replier: TProfileBadge;
  likes: TLikeItem[];
  isEdited: boolean;
  createdAt: string;
};

export type TSaveItem = {
  id: string;
  user: TProfileBadge;
  createdAt: string;
};

export type TStats = {
  posts: {
    count: number;
    list: TPostItem[];
  };
  savedPosts: {
    count: number;
    list: TPostItem[];
  };
  followers: {
    count: number;
    list: TProfileBadge[];
  };
  following: {
    count: number;
    list: TProfileBadge[];
  };
};

export type TAuthState = {
  isAuth: boolean | null;
  profile: TProfile | null;
  stats: TStats;
  onboarding: {
    profileInfoForm: {
      email: string;
      firstName: string;
      lastName: string;
      pronouns: string;
      title: string;
      location: string;
      birthdate: Date | null;
      bio: string;
      facebook: string;
      twitter: string;
      instagram: string;
      linkedin: string;
      github: string;
      website: string;
    };
    uploadForm: {
      avatar: string | null;
      coverPhoto: string | null;
    };
    tagsForm: string[];
  };
};

export type TPostState = {
  feed: {
    forYou: {
      filters: string[];
      count: number;
      list: TPostItem[];
    };
    explore: {
      count: number;
      list: TPostItem[];
    };
    following: {
      count: number;
      list: TPostItem[];
    };
  };
  postDetails: TPostDetails | null;
  creatorProfile: TProfile | null;
  creatorStats: TStats;
};

export type TNotificationState = {
  unreadCount: number;
  list: TNotificationItem[];
};

export type TNotificationItem = {
  id: string;
  type:
    | 'new_post'
    | 'new_comment'
    | 'like'
    | 'like_comment'
    | 'reply_comment'
    | 'like_reply'
    | 'save'
    | 'follow';
  user: TProfileBadge;
  sender: TProfileBadge;
  latestUser: [TProfileBadge];
  post?: {
    id: string;
    title: string;
  };
  comment?: string;
  isRead: boolean;
  message: string;
  createdAt: string;
};
