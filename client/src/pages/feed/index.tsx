import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Box, SimpleGrid, Stack, Tabs, Text, Title } from '@mantine/core';
import { useRecoilState } from 'recoil';
import { useQuery } from '@apollo/client';

import states from '../../states';
import { GET_FOLLOWS_BY_EMAIL, GET_POSTS } from '../../graphql/queries';

import ProtectedLayout from '../../layouts/protected';
import PostCard from '../../components/feed/post-card';
import LoadingFeed from '../../components/feed/loading-feed';
import { greetUser } from '../../utils/time.util';

const Feed = () => {
  const [auth, setAuth] = useRecoilState(states.auth);
  const [post, setPost] = useRecoilState(states.post);
  const { profile } = auth;
  const { posts } = post;

  const {
    data: postsData,
    loading,
    error,
    refetch: fetchPosts
  } = useQuery(GET_POSTS, {
    pollInterval: 30000
  });
  const {
    data: followsData,
    loading: loadingFollows,
    refetch: fetchFollows
  } = useQuery(GET_FOLLOWS_BY_EMAIL, {
    variables: { email: profile?.email }
  });

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
        fetchPosts();
        fetchFollows();
      }
    }
  }, [profile]);

  useEffect(() => {
    if (postsData) {
      const key = Object.keys(postsData)[0];
      const { posts } = postsData[key];

      setPost((prev: any) => ({
        ...prev,
        posts
      }));
    }
  }, [postsData]);

  useEffect(() => {
    if (followsData) {
      const key = Object.keys(followsData)[0];
      const follows = followsData[key];

      setAuth((prev: any) => ({
        ...prev,
        follows
      }));
    }
  }, [followsData]);

  return (
    <ProtectedLayout>
      {profile && (
        <Stack gap={0}>
          <Text size="md" fw={700} c="dimmed">
            Hello{' '}
            <Text span c="green" fw={700}>
              {profile?.firstName}
            </Text>
            ,
          </Text>
          <Title order={1}>{greetUser()}</Title>
        </Stack>
      )}
      <Tabs defaultValue="first">
        <Tabs.List justify="center">
          <Tabs.Tab value="first">For You</Tabs.Tab>
          <Tabs.Tab value="third">Following</Tabs.Tab>
        </Tabs.List>
      </Tabs>
      <Box mt="lg">
        <LoadingFeed
          loading={loading || loadingFollows}
          error={error}
          refetch={fetchPosts}
        >
          <SimpleGrid cols={2}>
            {posts &&
              posts.map((post: any) => <PostCard key={post.id} item={post} />)}
          </SimpleGrid>
        </LoadingFeed>
      </Box>
    </ProtectedLayout>
  );
};

export default Feed;
