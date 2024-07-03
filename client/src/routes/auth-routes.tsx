import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '../pages/login';
import SignUp from '../pages/sign-up';

const Stack = createNativeStackNavigator();

const PublicRoutes: FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Sign Up" component={SignUp} />
    </Stack.Navigator>
  );
};

export default PublicRoutes;
