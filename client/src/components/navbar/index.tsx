import { useState } from 'react';
import {
  ActionIcon,
  Anchor,
  Autocomplete,
  Avatar,
  Button,
  Container,
  Group,
  Menu,
  Text,
  UnstyledButton,
  useMantineTheme
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  IconBell,
  IconChevronDown,
  IconEdit,
  IconLogout,
  IconSearch,
  IconSettings,
  IconUserCircle
} from '@tabler/icons-react';
import cx from 'clsx';
import { useNavigate } from 'react-router';
import { useRecoilState } from 'recoil';
import { useMutation } from '@apollo/client';

import states from '../../states';
import { LOGOUT } from '../../graphql/mutations';
import { TAuthState } from '../../../types';

import Logo from '../logo';
import classes from './style.module.css';

const Navbar = () => {
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  const [auth, setAuth] = useRecoilState(states.auth);
  const { isAuth, profile } = auth;

  const [logout] = useMutation(LOGOUT);

  const theme = useMantineTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await logout();
      const key = Object.keys(response.data)[0];
      const data = response.data[key];

      if (data && data.success) {
        setAuth((prev: TAuthState) => ({
          ...prev,
          isAuth: false,
          profile: null
        }));
        navigate('/login');
      }
    } catch (error) {
      console.error(error);
      notifications.show({
        title: 'Error',
        message: 'An error occurred while logging out.',
        color: 'red',
        position: 'top-center'
      });
    }
  };

  return (
    <header className={classes.header}>
      <Container size="lg" h="100%">
        <Group justify="space-between" h="100%">
          <Group>
            <Anchor onClick={() => navigate('/')}>
              <Logo />
            </Anchor>
            <Autocomplete
              placeholder="Search"
              leftSection={<IconSearch size={16} stroke={1.5} />}
              data={[]}
            />
          </Group>

          {isAuth ? (
            <Group gap="lg" justify="center">
              <Button
                onClick={() => navigate('/compose')}
                variant="filled"
                leftSection={<IconEdit size={20} />}
              >
                Compose
              </Button>
              <ActionIcon
                style={{
                  borderWidth: 0
                }}
                variant="transparent"
                radius="xl"
              >
                <IconBell size={24} />
              </ActionIcon>
              <Menu
                width={200}
                position="bottom-end"
                transitionProps={{ transition: 'pop-top-right' }}
                onClose={() => setUserMenuOpened(false)}
                onOpen={() => setUserMenuOpened(true)}
                withinPortal
              >
                <Menu.Target>
                  <UnstyledButton
                    className={cx(classes.user, {
                      [classes.userActive]: userMenuOpened
                    })}
                  >
                    <Group gap={6}>
                      <Avatar
                        src={profile?.avatar}
                        alt={profile?.firstName}
                        name={`${profile?.firstName} ${profile?.lastName}`}
                        radius="xl"
                        color="initials"
                        size="md"
                      />
                      <Text fw={500} size="sm" mx={2}>
                        {`${profile?.firstName} ${profile?.lastName}`}
                      </Text>
                      <IconChevronDown size={12} stroke={1.5} />
                    </Group>
                  </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    leftSection={
                      <IconUserCircle
                        size={16}
                        color={theme.primaryColor}
                        stroke={1.5}
                      />
                    }
                  >
                    Profile
                  </Menu.Item>
                  <Menu.Item
                    leftSection={
                      <IconSettings
                        size={16}
                        color={theme.primaryColor}
                        stroke={1.5}
                      />
                    }
                  >
                    Account Settings
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item
                    onClick={handleLogout}
                    leftSection={
                      <IconLogout
                        size={16}
                        color={theme.colors.red[6]}
                        stroke={1.5}
                      />
                    }
                  >
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          ) : (
            <Group gap="lg">
              <Button
                px={0}
                variant="transparent"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button variant="outline" onClick={() => navigate('/sign-up')}>
                Create Account
              </Button>
            </Group>
          )}
        </Group>
      </Container>
    </header>
  );
};

export default Navbar;
