import { FC, Fragment, ReactNode } from 'react';
import { Container } from '@mantine/core';
import Navbar from '../../components/navbar';

type ProtectedLayoutProps = {
  children: ReactNode;
};

const ProtectedLayout: FC<ProtectedLayoutProps> = ({ children }) => {
  return (
    <Fragment>
      <Navbar />
      <Container size="lg" py={80}>
        {children}
      </Container>
    </Fragment>
  );
};

export default ProtectedLayout;
