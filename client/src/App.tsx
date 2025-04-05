import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dropzone/styles.css';
import './App.css';
import { useEffect } from 'react';
import { createTheme, MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { useQuery } from '@apollo/client';
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';

import states from './states';
import { GET_PROFILE, GET_TAGS } from './graphql/queries';
import { TAuthState } from '../types';

import AppRouter from './routes';
import LoadingPage from './components/loading-page';

const theme = createTheme({
  defaultRadius: 'sm',
  black: '#1b1b1b',
  white: '#fff',
  colors: {
    green: [
      '#eafaf1',
      '#d1f2e3',
      '#b7e9d5',
      '#9de1c7',
      '#83d9b9',
      '#6ad1ac',
      '#50c99e',
      '#36c190',
      '#1cb982',
      '#02b174'
    ]
  },
  primaryColor: 'green',
  components: {
    Title: {
      styles: () => ({
        root: {
          fontWeight: 650 // <--- Default font weight
        }
      })
    }
  }
});

function App() {
  const [auth, setAuth] = useRecoilState(states.auth);
  const setTag = useSetRecoilState(states.tag);

  const resetPost = useResetRecoilState(states.post);
  const resetNotification = useResetRecoilState(states.notification);

  const {
    data: profileResponse,
    loading: profileLoading,
    error,
    refetch: refetchProfile
  } = useQuery(GET_PROFILE, {
    fetchPolicy: 'network-only'
  });
  const {
    data: tagResponse,
    loading: tagLoading,
    refetch: fetchTags
  } = useQuery(GET_TAGS, {
    fetchPolicy: 'network-only'
  });

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    if (auth.isAuth) {
      refetchProfile();
    }
  }, [auth.isAuth]);

  useEffect(() => {
    if (tagResponse) {
      const key = Object.keys(tagResponse)[0];
      const tags = tagResponse[key];
      setTag({
        list: tags
      });
    }
  }, [tagResponse]);

  useEffect(() => {
    if (profileResponse) {
      const key = Object.keys(profileResponse)[0];
      const profile = profileResponse[key];

      setAuth((prev: TAuthState) => ({
        ...prev,
        isAuth: true,
        profile
      }));
    }
  }, [profileResponse]);

  useEffect(() => {
    if (error) {
      setAuth((prev: TAuthState) => ({
        ...prev,
        isAuth: false,
        profile: null
      }));
      resetPost();
      resetNotification();
    }
  }, [error]);

  return (
    <MantineProvider defaultColorScheme="light" theme={theme}>
      <Notifications />
      <LoadingPage loading={profileLoading || tagLoading}>
        <ModalsProvider>
          <AppRouter />
        </ModalsProvider>
      </LoadingPage>
    </MantineProvider>
  );
}

export default App;
