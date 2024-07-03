import { atom } from 'recoil';

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

const AUTH_STATE = atom({
  key: 'AUTH_STATE',
  default: initialState,
});

export default AUTH_STATE;
