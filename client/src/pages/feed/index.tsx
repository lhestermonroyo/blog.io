import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Stack, Tabs, Text, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useRecoilState } from 'recoil';
import { useQuery } from '@apollo/client';

import states from '../../states';
import { GET_STATS_BY_EMAIL } from '../../graphql/queries';
import { greetUser } from '../../utils/time.util';
import { TAuthState } from '../../../types';

import MainLayout from '../../layouts/main';
import ForYou from '../../components/feed/for-you';
import Explore from '../../components/feed/explore';
import Following from '../../components/feed/following';

// For You tab - recommend posts that are based to user's interests/tags
// Explore tab - show posts from all users
// Following tab - show posts from users that the user follows

const Feed = () => {
  const [auth, setAuth] = useRecoilState(states.auth);
  const { profile, isAuth } = auth;

  const isMd = useMediaQuery('(max-width: 768px)');

  const { data: statsResponse, refetch: fetchStats } = useQuery(
    GET_STATS_BY_EMAIL,
    {
      variables: { email: profile?.email },
      skip: !profile?.email,
      fetchPolicy: 'network-only'
    }
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (profile) {
      const needsOnboarding = !profile?.tags.length;

      if (needsOnboarding) {
        navigate('/onboarding');
      } else {
        console.log('init');
        init();
      }
    }
  }, [profile]);

  useEffect(() => {
    if (statsResponse) {
      const key = Object.keys(statsResponse)[0];
      const data = statsResponse[key];

      setAuth((prev: TAuthState) => ({
        ...prev,
        stats: {
          ...prev.stats,
          posts: data.posts,
          savedPosts: data.savedPosts,
          followers: data.followers,
          following: data.following
        }
      }));
    }
  }, [statsResponse]);

  const init = async () => {
    try {
      await fetchStats();
    } catch (error) {
      console.error(error);
    }
  };

  if (profile && isAuth) {
    return (
      <MainLayout>
        {profile && (
          <Stack gap={0} mb="sm">
            <Title order={1}>
              {greetUser()},{' '}
              <Text span c="green" inherit>
                {profile?.firstName} 👋
              </Text>
            </Title>
            <Text c="dimmed">
              Here are some posts that you might be interested in. Enjoy!
            </Text>
          </Stack>
        )}
        <Tabs defaultValue="1">
          <Tabs.List justify="center">
            <Tabs.Tab value="1">For You</Tabs.Tab>
            <Tabs.Tab value="2">Explore</Tabs.Tab>
            <Tabs.Tab value="3">Following</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="1">
            <ForYou />
          </Tabs.Panel>
          <Tabs.Panel value="2">
            <Explore />
          </Tabs.Panel>
          <Tabs.Panel value="3">
            <Following />
          </Tabs.Panel>
        </Tabs>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Stack gap={0} mb="sm">
        <Title order={1}>Explore Feed</Title>
        <Text c="dimmed">
          Here are some posts that you might be interested in. Enjoy!
        </Text>
      </Stack>
      <Explore />
    </MainLayout>
  );
};

export default Feed;
