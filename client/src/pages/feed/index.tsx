import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Stack, Tabs, Text, Title } from '@mantine/core';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useQuery } from '@apollo/client';

import states from '../../states';
import { GET_STATS_BY_EMAIL, GET_TAGS } from '../../graphql/queries';
import { greetUser } from '../../utils/time.util';
import { TAuthState, TPostState } from '../../../types';

import ProtectedLayout from '../../layouts/protected';
import ForYou from '../../components/feed/for-you';
import Explore from '../../components/feed/explore';
import Following from '../../components/feed/following';

// For You tab - recommend posts that are based to user's interests/tags
// Explore tab - show posts from all users
// Following tab - show posts from users that the user follows

const Feed = () => {
  const setPost = useSetRecoilState(states.post);
  const [auth, setAuth] = useRecoilState(states.auth);
  const { profile } = auth;

  const { data: statsResponse, refetch: fetchStats } = useQuery(
    GET_STATS_BY_EMAIL,
    {
      variables: { email: profile?.email },
      skip: !profile?.email
    }
  );
  const { data: tagsResponse } = useQuery(GET_TAGS);

  const navigate = useNavigate();

  useEffect(() => {
    if (profile) {
      const needsOnboarding = !profile?.tags.length;

      if (needsOnboarding) {
        navigate('/onboarding');
      } else {
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

  useEffect(() => {
    if (tagsResponse) {
      const key = Object.keys(tagsResponse)[0];
      const data = tagsResponse[key];

      setPost((prev: TPostState) => ({
        ...prev,
        tags: data
      }));
    }
  }, [tagsResponse]);

  const init = async () => {
    try {
      await fetchStats();
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
    </ProtectedLayout>
  );
};

export default Feed;
