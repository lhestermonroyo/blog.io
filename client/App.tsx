import { useCallback } from 'react';
import { LogBox } from 'react-native';
import { NativeBaseProvider, View, extendTheme } from 'native-base';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from '@expo-google-fonts/inter';
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { RecoilRoot } from 'recoil';

import RootContainer from './src/RootContainer';
import { getItem } from './src/utils/SecureStore.util';

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
});

const authLink = setContext(async (_, { headers }) => {
  const token = await getItem('token');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const theme = extendTheme({
  components: {
    Text: {
      defaultProps: {
        color: 'gray.800',
      },
    },
    Heading: {
      defaultProps: {
        color: 'gray.800',
      },
    },
    Button: {
      defaultProps: {
        _text: {
          fontSize: 'lg',
          fontWeight: 'medium',
        },
      },
    },
    Input: {
      baseStyle: {
        _focus: {
          borderColor: 'primary.600',
        },
      },
      defaultProps: {
        _text: {
          fontSize: 'lg',
        },
      },
    },
    config: {
      initialColorMode: 'dark',
    },
  },
});

export default function App() {
  let [fontsLoaded] = useFonts({
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ApolloProvider client={client}>
      <RecoilRoot>
        <NativeBaseProvider theme={theme}>
          <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
            <StatusBar style="auto" />
            <RootContainer />
          </View>
        </NativeBaseProvider>
      </RecoilRoot>
    </ApolloProvider>
  );
}

LogBox.ignoreAllLogs();
