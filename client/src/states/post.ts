import { atom } from 'recoil';

const initialState: any = {
  posts: [],
};

export const POST_STATE = atom({
  key: 'POST_STATE',
  default: initialState
});

export default POST_STATE;
