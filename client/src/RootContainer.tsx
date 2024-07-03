import React, { FC, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useRecoilState } from 'recoil';
import { useQuery } from '@apollo/client';

import states from './states';
import { GET_OWN_PROFILE } from './queries/user';

import AuthRoutes from './routes/auth-routes';
import PrivateRoutes from './routes/private-routes';
import Loading from './components/loading';

const RootContainer: FC = () => {
  const { loading, error, data } = useQuery(GET_OWN_PROFILE);

  const [auth, setAuth] = useRecoilState(states.auth);

  useEffect(() => {
    console.log('inside useEffect', auth.isAuthenticated);
    console.log('inside useEffect', data);
    if (data) {
      setAuth(prev => ({
        ...prev,
        isAuthenticated: true,
        user: data?.getOwnProfile,
      }));
    }
  }, [auth.isAuthenticated]);

  useEffect(() => {
    if (error) {
      setAuth(prev => ({
        ...prev,
        isAuthenticated: false,
        user: null,
      }));
    }
  }, [error]);

  if (loading) {
    return <Loading />;
  }

  return (
    <NavigationContainer>
      {auth.isAuthenticated ? <PrivateRoutes /> : <AuthRoutes />}
    </NavigationContainer>
  );
};

export default RootContainer;
