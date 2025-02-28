import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './App.css';
import { useEffect } from 'react';
import { createTheme, MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { useLazyQuery } from '@apollo/client';
import { useRecoilState } from 'recoil';

import states from './states';
import { GET_PROFILE } from './graphql/queries';

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
  primaryColor: 'green'
  // components: {
  //   Input: {
  //     styles: (theme: any) => ({
  //       input: {
  //         backgroundColor: theme.colorScheme === 'dark' ? '#1e1e1e' : '#f5f5f5' // Darker gray in light mode, lighter gray in dark mode
  //       }
  //     })
  //   },
  //   TextInput: {
  //     styles: (theme: any) => ({
  //       input: {
  //         backgroundColor: theme.colorScheme === 'dark' ? '#1e1e1e' : '#f5f5f5'
  //       }
  //     })
  //   },
  //   Select: {
  //     styles: (theme: any) => ({
  //       input: {
  //         backgroundColor: theme.colorScheme === 'dark' ? '#1e1e1e' : '#f5f5f5'
  //       }
  //     })
  //   },
  //   Textarea: {
  //     styles: (theme: any) => ({
  //       input: {
  //         backgroundColor: theme.colorScheme === 'dark' ? '#1e1e1e' : '#f5f5f5'
  //       }
  //     })
  //   }
  // }
});

function App() {
  const [auth, setAuth] = useRecoilState(states.auth);

  const [getProfile, { data, loading, error }] = useLazyQuery(GET_PROFILE);

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (auth.isAuth) {
      getProfile();
    }
  }, [auth]);

  useEffect(() => {
    if (data) {
      const key = Object.keys(data)[0];
      const profile = data[key];

      setAuth((prev: any) => ({
        ...prev,
        isAuth: true,
        profile
      }));
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      setAuth((prev: any) => ({
        ...prev,
        isAuth: false,
        profile: null
      }));
    }
  }, [error]);

  return (
    <MantineProvider defaultColorScheme="light" theme={theme}>
      <Notifications />
      <LoadingPage loading={loading}>
        <ModalsProvider>
          <AppRouter />
        </ModalsProvider>
      </LoadingPage>
    </MantineProvider>
  );
}

export default App;
