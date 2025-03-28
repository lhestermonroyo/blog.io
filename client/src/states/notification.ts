import { atom } from 'recoil';
import { TNotificationState } from '../../types';

const initialState: TNotificationState = {
  unreadCount: 0,
  list: []
};

export const NOTIFICATION_STATE = atom({
  key: 'NOTIFICATION_STATE',
  default: initialState
});

export default NOTIFICATION_STATE;
