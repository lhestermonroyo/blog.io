import { atom } from 'recoil';

const initialState: any = {
  posts: [],
  postDetails: null,
  creatorTotalPosts: 0
};

export const POST_STATE = atom({
  key: 'POST_STATE',
  default: initialState
});

export default POST_STATE;
