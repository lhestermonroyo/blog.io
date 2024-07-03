import React, { FC, ReactNode } from 'react';
import { Dimensions, Platform, SafeAreaView } from 'react-native';
import { Box, KeyboardAvoidingView, ScrollView } from 'native-base';

import Logo from '../components/logo';

interface ILayoutProps {
  children: ReactNode;
}

const AuthLayout: FC<ILayoutProps> = ({ children }) => {
  const { height } = Dimensions.get('window');

  return (
    <SafeAreaView>
      <KeyboardAvoidingView
        height={{
          base: height,
        }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView flex={1} height="full">
          <Box marginX={4} marginY={8}>
            <Logo />
          </Box>
          <Box marginX={4}>{children}</Box>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AuthLayout;
