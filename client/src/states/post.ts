import { atom } from 'recoil';
import { TPostState } from '../../types';

const initialState: TPostState = {
  feed: {
    forYou: {
      filters: [],
      count: 0,
      list: []
    },
    explore: {
      count: 0,
      list: []
    },
    following: {
      count: 0,
      list: []
    }
  },
  postDetails: null,
  creatorProfile: null,
  creatorStats: {
    posts: {
      count: 0,
      list: []
    },
    savedPosts: {
      count: 0,
      list: []
    },
    followers: {
      count: 0,
      list: []
    },
    following: {
      count: 0,
      list: []
    }
  },
  tags: []
};

export const POST_STATE = atom({
  key: 'POST_STATE',
  default: initialState
});

export default POST_STATE;
