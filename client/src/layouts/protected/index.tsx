import { FC, Fragment, ReactNode } from 'react';
import { Container, MantineSize } from '@mantine/core';
import Navbar from '../../components/navbar';

type ProtectedLayoutProps = {
  children: ReactNode;
  size?: number | MantineSize | (string & {}) | undefined;
};

const ProtectedLayout: FC<ProtectedLayoutProps> = ({
  children,
  size = 'lg'
}) => {
  return (
    <Fragment>
      <Navbar />
      <Container size={size} py={80}>
        {children}
      </Container>
    </Fragment>
  );
};

export default ProtectedLayout;
