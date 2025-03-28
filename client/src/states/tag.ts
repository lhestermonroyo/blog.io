import { atom } from 'recoil';

const initialState: { list: string[] } = {
  list: []
};

export const TAG_STATE = atom({
  key: 'TAG_STATE',
  default: initialState
});

export default TAG_STATE;
