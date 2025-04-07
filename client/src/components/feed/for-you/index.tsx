import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Divider,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title
} from '@mantine/core';
import { IconFilter } from '@tabler/icons-react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useQuery } from '@apollo/client';

import states from '../../../states';
import { GET_POSTS_BY_TAGS } from '../../../graphql/queries';
import { TPostItem, TPostState } from '../../../../types';

import PostCard from '../../../components/feed/post-card';
import FiltersModal from '../filters-modal';
import LoadingFeed from '../loading-feed';

const ForYou = () => {
  const [loading, setLoading] = useState(true);
  const [openFilters, setOpenFilters] = useState(false);

  const auth = useRecoilValue(states.auth);
  const [post, setPost] = useRecoilState(states.post);
  const { profile } = auth;
  const {
    feed: {
      forYou: { filters, list, count }
    }
  } = post;

  const {
    data: response,
    refetch: fetchPostsByTags,
    fetchMore: fetchPostsByTagsMore
  } = useQuery(GET_POSTS_BY_TAGS, {
    variables: { tags: filters.length ? filters : profile?.tags, limit: 7 },
    skip: !profile,
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      setLoading(false);
    }
  });

  useEffect(() => {
    if (!list.length) {
      fetchPostsByTags();
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
          forYou: {
            ...prev.feed.forYou,
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

                const { data } = await fetchPostsByTagsMore({
                  variables: {
                    tags: filters.length ? filters : profile?.tags,
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
                    forYou: {
                      ...prev.feed.forYou,
                      list: [...prev.feed.forYou.list, ...newPosts]
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
    [loading, list, filters, profile, fetchPostsByTagsMore, setPost]
  );

  return (
    <Fragment>
      <FiltersModal
        opened={openFilters}
        onClose={() => setOpenFilters(false)}
      />
      <Box mt="lg">
        <Fragment>
          <Stack gap="lg">
            <Group justify="flex-end">
              <Button
                variant="default"
                leftSection={<IconFilter size={16} />}
                onClick={() => setOpenFilters(true)}
              >
                Filters {filters.length ? `(${filters.length})` : ''}
              </Button>
            </Group>
            {!filters.length && (
              <Fragment>
                {list.length > 0 && (
                  <Stack gap="xs">
                    <Badge color="green">Newest</Badge>
                    <PostCard item={list[0]} />
                  </Stack>
                )}
                <Divider
                  label={
                    <Title c="dark" order={3}>
                      More posts for you
                    </Title>
                  }
                  labelPosition="left"
                />
              </Fragment>
            )}

            <SimpleGrid cols={{ base: 1, md: 2 }} spacing={24}>
              {list
                .slice(filters.length ? 0 : 1)
                .map((post: TPostItem, index: number) => (
                  <div
                    key={post.id}
                    ref={
                      index === list.length - (filters.length ? 1 : 2)
                        ? lastPostRef
                        : null
                    }
                  >
                    <PostCard item={post} />
                  </div>
                ))}
            </SimpleGrid>
            {loading && <LoadingFeed />}
            {list.length >= count && (
              <Text mt="lg" color="dimmed" ta="center">
                That's all folks!
              </Text>
            )}
          </Stack>
        </Fragment>
      </Box>
    </Fragment>
  );
};

export default ForYou;
