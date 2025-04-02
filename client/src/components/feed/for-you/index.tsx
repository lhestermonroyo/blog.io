import { Fragment, useEffect, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Divider,
  Group,
  SimpleGrid,
  Stack,
  Title
} from '@mantine/core';
import { IconFilter } from '@tabler/icons-react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useQuery } from '@apollo/client';

import states from '../../../states';
import { GET_POSTS_BY_TAGS } from '../../../graphql/queries';
import { TPostItem, TPostState } from '../../../../types';

import PostCard from '../../../components/feed/post-card';
import LoadingFeed from '../../../components/feed/loading-feed';
import FiltersModal from '../filters-modal';

const ForYou = () => {
  const [openFilters, setOpenFilters] = useState(false);

  const auth = useRecoilValue(states.auth);
  const [post, setPost] = useRecoilState(states.post);
  const { profile } = auth;
  const {
    feed: {
      forYou: { filters, list }
    }
  } = post;

  const {
    data: response,
    loading,
    error,
    refetch: fetchPostsByTags
  } = useQuery(GET_POSTS_BY_TAGS, {
    variables: { tags: filters.length ? filters : profile?.tags },
    skip: !profile,
    fetchPolicy: 'network-only'
  });

  useEffect(() => {
    fetchPostsByTags();
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

  return (
    <Fragment>
      <FiltersModal
        opened={openFilters}
        onClose={() => setOpenFilters(false)}
      />
      <Box mt="lg">
        <LoadingFeed loading={loading} error={error} refetch={fetchPostsByTags}>
          {list && (
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
                  {list.slice(filters.length ? 0 : 1).map((post: TPostItem) => (
                    <PostCard key={post.id} item={post} />
                  ))}
                </SimpleGrid>
              </Stack>
            </Fragment>
          )}
        </LoadingFeed>
      </Box>
    </Fragment>
  );
};

export default ForYou;
