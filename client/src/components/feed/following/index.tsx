import { useEffect } from 'react';
import { Box, SimpleGrid } from '@mantine/core';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useQuery } from '@apollo/client';

import states from '../../../states';
import { GET_POSTS_BY_FOLLOWING } from '../../../graphql/queries';
import { TPostItem, TPostState } from '../../../../types';

import PostCard from '../../../components/feed/post-card';
import LoadingFeed from '../../../components/feed/loading-feed';

const Following = () => {
  const auth = useRecoilValue(states.auth);
  const [post, setPost] = useRecoilState(states.post);
  const { profile } = auth;
  const {
    feed: {
      following: { list }
    }
  } = post;

  const {
    data: response,
    loading,
    error,
    refetch: fetchPostsByFollowing
  } = useQuery(GET_POSTS_BY_FOLLOWING, {
    skip: !profile,
    fetchPolicy: 'network-only'
  });

  useEffect(() => {
    fetchPostsByFollowing();
  }, []);

  useEffect(() => {
    if (response) {
      const key = Object.keys(response)[0];
      const data = response[key];

      setPost((prev: TPostState) => ({
        ...prev,
        feed: {
          ...prev.feed,
          following: {
            count: data.totalCount,
            list: data.posts
          }
        }
      }));
    }
  }, [response]);

  return (
    <Box mt="lg">
      <LoadingFeed
        loading={loading}
        error={error}
        refetch={fetchPostsByFollowing}
      >
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

export default Following;
