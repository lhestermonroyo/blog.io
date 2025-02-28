import { useEffect } from 'react';
import { Box, SimpleGrid, Tabs, Title } from '@mantine/core';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useQuery } from '@apollo/client';

import states from '../../states';
import { GET_POSTS } from '../../graphql/queries';

import ProtectedLayout from '../../layouts/protected';
import PostCard from '../../components/feed/post-card';
import LoadingFeed from '../../components/feed/loading-feed';

const Feed = () => {
  const auth = useRecoilValue(states.auth);
  const [post, setPost] = useRecoilState(states.post);
  const { profile } = auth;
  const { posts } = post;

  const { data, loading, refetch } = useQuery(GET_POSTS, {
    pollInterval: 30000
  });

  useEffect(() => {
    console.log('Refetching posts...');
    refetch();
  }, []);

  useEffect(() => {
    if (data) {
      const key = Object.keys(data)[0];
      const posts = data[key];

      console.log('Posts:', posts);

      setPost((prev: any) => ({
        ...prev,
        posts
      }));
    }
  }, [data]);

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
        <LoadingFeed loading={loading}>
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
