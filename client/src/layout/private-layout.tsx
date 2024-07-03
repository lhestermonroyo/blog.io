import { ScrollView } from 'native-base';
import React, { FC, ReactNode } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ILayoutProps {
  children: ReactNode;
}

const PrivateLayout: FC<ILayoutProps> = ({ children }) => {
  return (
    <SafeAreaView>
      <ScrollView height="full">{children}</ScrollView>
    </SafeAreaView>
  );
};

export default PrivateLayout;
