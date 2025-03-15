import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Stack, Tabs, Text, Title } from '@mantine/core';
import { useRecoilState } from 'recoil';
import { useQuery } from '@apollo/client';

import states from '../../states';
import { GET_FOLLOWS_BY_EMAIL } from '../../graphql/queries';
import { greetUser } from '../../utils/time.util';
import { TAuthState } from '../../../types';

import ProtectedLayout from '../../layouts/protected';
import ForYou from '../../components/feed/for-you';
import Explore from '../../components/feed/explore';
import Following from '../../components/feed/following';

// For You tab - recommend posts that are based to user's interests/tags
// Explore tab - show posts from all users
// Following tab - show posts from users that the user follows

const Feed = () => {
  const [auth, setAuth] = useRecoilState(states.auth);
  const { profile } = auth;

  const { data: followsData, refetch: fetchFollows } = useQuery(
    GET_FOLLOWS_BY_EMAIL,
    {
      variables: { email: profile?.email }
    }
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (profile) {
      const needsOnboarding =
        !profile?.location ||
        !profile?.bio ||
        !profile?.pronouns ||
        !profile?.avatar ||
        !profile?.coverPhoto ||
        !profile?.tags.length;

      if (needsOnboarding) {
        navigate('/onboarding');
      } else {
        init();
      }
    }
  }, [profile]);

  useEffect(() => {
    if (followsData) {
      const key = Object.keys(followsData)[0];
      const follows = followsData[key];

      setAuth((prev: TAuthState) => ({
        ...prev,
        stats: {
          ...prev.stats,
          followers: {
            count: follows?.followersCount,
            list: follows?.followers || []
          },
          following: {
            count: follows?.followingCount,
            list: follows?.following || []
          }
        }
      }));
    }
  }, [followsData]);

  const init = async () => {
    try {
      await fetchFollows();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ProtectedLayout>
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
        <Tabs.List>
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
    </ProtectedLayout>
  );
};

export default Feed;
