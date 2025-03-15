export type TProfile = TProfileBadge & {
  birthdate: string;
  location: string;
  pronouns: string;
  bio: string;
  coverPhoto: string;
  tags: string[];
  age: string;
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
  isLiked: boolean;
  isCommented: boolean;
  createdAt: string;
};

export type TPostDetails = TPostItem & {
  likes: TLikeItem[];
  comments: TCommentItem[];
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
  isEdited: boolean;
  createdAt: string;
};

export type TStats = {
  posts: {
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
      birthdate: Date | null;
      location: string;
      pronouns: string;
      bio: string;
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
