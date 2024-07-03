import React, { FC } from 'react';
import { Text } from 'native-base';

import PrivateLayout from '../../layout/private-layout';

const Home: FC = () => {
  return (
    <PrivateLayout>
      <Text>Home Page</Text>
    </PrivateLayout>
  );
};

export default Home;
