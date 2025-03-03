import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Box, SimpleGrid, Tabs, Title } from '@mantine/core';
import { useRecoilState } from 'recoil';
import { useQuery } from '@apollo/client';

import states from '../../states';
import { GET_FOLLOWS_BY_EMAIL, GET_POSTS } from '../../graphql/queries';

import ProtectedLayout from '../../layouts/protected';
import PostCard from '../../components/feed/post-card';
import LoadingFeed from '../../components/feed/loading-feed';

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
    if (profile?.tags.length) {
      fetchPosts();
      fetchFollows();
    } else {
      navigate('/onboarding');
    }
  }, []);

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
      {profile && <Title order={1}>Good day, {profile?.firstName}!</Title>}
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
