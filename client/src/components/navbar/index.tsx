import { useState } from 'react';
import {
  ActionIcon,
  Anchor,
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
  IconBallpen,
  IconChevronDown,
  IconLogout,
  IconSearch,
  IconSettings,
  IconUserCircle
} from '@tabler/icons-react';
import cx from 'clsx';
import { useNavigate } from 'react-router';
import { useMediaQuery } from '@mantine/hooks';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { useMutation } from '@apollo/client';

import states from '../../states';
import { LOGOUT } from '../../graphql/mutations';
import { TAuthState } from '../../../types';

import Logo from '../logo';
import SearchPanel from '../search-panel';

import classes from './style.module.css';
import NotificationPanel from '../notification-panel';

const Navbar = () => {
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  const [auth, setAuth] = useRecoilState(states.auth);
  const resetPost = useResetRecoilState(states.post);
  const resetNotification = useResetRecoilState(states.notification);
  const { isAuth, profile } = auth;

  const isMd = useMediaQuery('(max-width: 768px)');

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
          profile: null,
          stats: {
            posts: {
              count: 0,
              list: []
            },
            savedPosts: {
              count: 0,
              list: []
            },
            followers: {
              count: 0,
              list: []
            },
            following: {
              count: 0,
              list: []
            }
          },
          onboarding: {
            profileInfoForm: {
              email: '',
              firstName: '',
              lastName: '',
              pronouns: '',
              title: '',
              location: '',
              birthdate: null as Date | null,
              bio: '',
              facebook: '',
              twitter: '',
              instagram: '',
              linkedin: '',
              github: '',
              website: ''
            },
            uploadForm: {
              avatar: null,
              coverPhoto: null
            },
            tagsForm: []
          }
        }));
        resetPost();
        resetNotification();
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
          <Group justify="flex-start">
            <Anchor onClick={() => navigate('/')}>
              <Logo />
            </Anchor>
            <SearchPanel />
          </Group>

          {isAuth && profile ? (
            <Group gap={!isMd ? 'lg' : 'md'} justify="center">
              <Button
                variant="filled"
                leftSection={<IconBallpen size={20} />}
                onClick={() => navigate('/compose')}
                visibleFrom="md"
              >
                Compose
              </Button>
              <ActionIcon
                variant="filled"
                size="lg"
                radius="md"
                onClick={() => navigate('/compose')}
                hiddenFrom="md"
              >
                <IconBallpen size={24} />
              </ActionIcon>
              <ActionIcon
                style={{
                  borderWidth: 0
                }}
                size="lg"
                variant="default"
                c="dimmed"
                radius="xl"
                onClick={() => navigate('/search')}
                hiddenFrom="sm"
              >
                <IconSearch size={24} />
              </ActionIcon>

              <NotificationPanel />
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
                      <Text fw={500} size="sm" mx={2} visibleFrom="sm">
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
                    onClick={() => navigate('/profile')}
                  >
                    Profile
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => navigate('/profile/edit?tab=5')}
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
            <Group gap={!isMd ? 'lg' : 'md'}>
              <ActionIcon
                style={{
                  borderWidth: 0
                }}
                size="lg"
                variant="default"
                c="dimmed"
                radius="xl"
                onClick={() => navigate('/search')}
                hiddenFrom="sm"
              >
                <IconSearch size={24} />
              </ActionIcon>
              <Button
                px={0}
                variant="transparent"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button variant="filled" onClick={() => navigate('/sign-up')}>
                Sign Up
              </Button>
            </Group>
          )}
        </Group>
      </Container>
    </header>
  );
};

export default Navbar;
