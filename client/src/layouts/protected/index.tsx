import { FC, Fragment, ReactNode } from 'react';
import { Container } from '@mantine/core';
import Navbar from '../../components/navbar';

interface ProtectedLayoutProps {
  children: ReactNode;
}

const ProtectedLayout: FC<ProtectedLayoutProps> = ({ children }) => {
  return (
    <Fragment>
      <Navbar />
      <Container size="xl" py={80}>
        {children}
      </Container>
    </Fragment>
  );
};

export default ProtectedLayout;
