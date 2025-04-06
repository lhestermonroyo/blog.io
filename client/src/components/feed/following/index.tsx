import { useCallback, useEffect, useRef, useState } from 'react';
import { Box, SimpleGrid, Text } from '@mantine/core';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useQuery } from '@apollo/client';

import states from '../../../states';
import { GET_POSTS_BY_FOLLOWING } from '../../../graphql/queries';
import { TPostItem, TPostState } from '../../../../types';

import PostCard from '../../../components/feed/post-card';
import LoadingFeed from '../loading-feed';

const Following = () => {
  const [loading, setLoading] = useState(true);

  const auth = useRecoilValue(states.auth);
  const [post, setPost] = useRecoilState(states.post);
  const { profile } = auth;
  const {
    feed: {
      following: { list, count }
    }
  } = post;

  const {
    data: response,
    refetch: fetchPostsByFollowing,
    fetchMore: fetchPostsByFollowingMore
  } = useQuery(GET_POSTS_BY_FOLLOWING, {
    variables: { limit: 8 },
    skip: !profile,
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      setLoading(false);
    }
  });

  useEffect(() => {
    if (!list.length) {
      fetchPostsByFollowing();
    }
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

  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      if (node) {
        observer.current = new IntersectionObserver(
          async (entries: IntersectionObserverEntry[]) => {
            if (
              entries[0].isIntersecting &&
              list.length > 0 &&
              list.length < count
            ) {
              try {
                setLoading(true);

                const { data } = await fetchPostsByFollowingMore({
                  variables: {
                    limit: 8,
                    offset: list.length
                  }
                });

                const key = Object.keys(data)[0];
                const newPosts = data[key].posts;

                setPost((prev: TPostState) => ({
                  ...prev,
                  feed: {
                    ...prev.feed,
                    following: {
                      ...prev.feed.following,
                      list: [...prev.feed.following.list, ...newPosts]
                    }
                  }
                }));
              } catch (error) {
                console.log('Error fetching more posts:', error);
              } finally {
                setLoading(false);
              }
            }
          }
        );
        observer.current.observe(node);
      }
    },
    [loading, list, profile, fetchPostsByFollowingMore, setPost]
  );

  return (
    <Box mt="lg">
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing={24}>
        {list.map((post: TPostItem, index: number) => (
          <div
            key={post.id}
            ref={index === list.length - 1 ? lastPostRef : null}
          >
            <PostCard key={post.id} item={post} />
          </div>
        ))}
      </SimpleGrid>
      {loading && <LoadingFeed />}
      {list.length === count && (
        <Text mt="lg" color="dimmed" ta="center">
          That's all folks!
        </Text>
      )}
    </Box>
  );
};

export default Following;
