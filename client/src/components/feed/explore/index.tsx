import { useEffect } from 'react';
import { Box, SimpleGrid } from '@mantine/core';
import { useRecoilState } from 'recoil';
import { useQuery } from '@apollo/client';

import states from '../../../states';
import { GET_POSTS } from '../../../graphql/queries';
import { TPostItem, TPostState } from '../../../../types';

import PostCard from '../post-card';
import LoadingFeed from '../loading-feed';

const Explore = () => {
  const [post, setPost] = useRecoilState(states.post);
  const {
    feed: {
      explore: { list }
    }
  } = post;

  const {
    data: response,
    loading,
    error,
    refetch: fetchPosts
  } = useQuery(GET_POSTS, {
    fetchPolicy: 'network-only'
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (response) {
      const key = Object.keys(response)[0];
      const data = response[key];

      setPost((prev: TPostState) => ({
        ...prev,
        feed: {
          ...prev.feed,
          explore: {
            count: data.totalCount,
            list: data.posts
          }
        }
      }));
    }
  }, [response]);

  return (
    <Box mt="lg">
      <LoadingFeed loading={loading} error={error} refetch={fetchPosts}>
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={24}>
          {list &&
            list.map((post: TPostItem) => (
              <PostCard key={post.id} item={post} />
            ))}
        </SimpleGrid>
      </LoadingFeed>
    </Box>
  );
};

export default Explore;
