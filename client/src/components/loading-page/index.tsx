import { Loader, useMantineTheme } from '@mantine/core';
import { FC, ReactNode } from 'react';

interface LoadingPageProps {
  loading: boolean;
  children: ReactNode;
}

const LoadingPage: FC<LoadingPageProps> = ({ loading, children }) => {
  const theme = useMantineTheme();

  if (loading) {
    return (
      <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
        <Loader
          type="bars"
          color={theme.primaryColor}
          size={48}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        />
      </div>
    );
  }

  return children;
};

export default LoadingPage;
