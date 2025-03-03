import { atom } from 'recoil';

const initialState: any = {
  isAuth: false,
  profile: null,
  follows: null
};

export const AUTH_STATE = atom({
  key: 'AUTH_STATE',
  default: initialState
});

export default AUTH_STATE;
