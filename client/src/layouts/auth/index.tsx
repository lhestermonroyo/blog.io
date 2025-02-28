import { FC, ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { Anchor, Group, Paper } from '@mantine/core';

import Logo from '../../components/logo';
import classes from './style.module.css';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p="xl" pt={80}>
        <Group mb="lg">
          <Anchor onClick={() => navigate('/')}>
            <Logo />
          </Anchor>
        </Group>
        {children}
      </Paper>
    </div>
  );
};

export default AuthLayout;
