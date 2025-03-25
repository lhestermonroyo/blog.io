import { atom } from 'recoil';
import { TAuthState } from '../../types';

const initialState: TAuthState = {
  isAuth: null,
  profile: null,
  stats: {
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
  onboarding: {
    profileInfoForm: {
      email: '',
      firstName: '',
      lastName: '',
      pronouns: '',
      title: '',
      location: '',
      birthdate: null as Date | null,
      bio: '',
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
      github: '',
      website: ''
    },
    uploadForm: {
      avatar: null,
      coverPhoto: null
    },
    tagsForm: []
  }
};

export const AUTH_STATE = atom({
  key: 'AUTH_STATE',
  default: initialState
});

export default AUTH_STATE;
