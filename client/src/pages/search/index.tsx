import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useMutation } from '@apollo/client';
import {
  Badge,
  Card,
  Divider,
  Grid,
  Group,
  Skeleton,
  Stack,
  TextInput,
  Title,
  UnstyledButton
} from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import _ from 'lodash';

import { GET_SEARCH_RESULTS } from '../../graphql/mutations';

import ProtectedLayout from '../../layouts/protected';
import ProfileBadge from '../../components/profile-badge';
import PostCard from '../../components/feed/post-card';
import { TPostItem, TProfileBadge } from '../../../types';

const Search = () => {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<any>({
    totalCount: 0,
    users: [],
    tags: [],
    posts: []
  });

  const searchFieldRef = useRef<HTMLInputElement>(null);

  const [getSearchResult] = useMutation(GET_SEARCH_RESULTS);

  const dbFetchSearchResult = useCallback(
    _.debounce((query: string) => fetchSearchResults(query), 500),
    []
  );

  useEffect(() => {
    if (query.length < 3) {
      setResults({
        users: [],
        tags: [],
        posts: []
      });
      return;
    }

    dbFetchSearchResult(query);
    return () => dbFetchSearchResult.cancel(); // Cleanup
  }, [query, dbFetchSearchResult]);

  useEffect(() => {
    if (searchFieldRef.current) {
      searchFieldRef.current?.focus();
    }
  }, []);

  const fetchSearchResults = async (qryStr: string) => {
    try {
      setLoading(true);

      const response = await getSearchResult({
        variables: { query: qryStr }
      });
      const key = Object.keys(response.data)[0];
      const data = response.data[key];

      setResults({
        totalCount: data.totalCount,
        users: [...data.users],
        tags: [...data.tags],
        posts: [...data.posts]
      });
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedLayout size="sm">
      <Stack gap="lg">
        <Title order={1} ta="center">
          Find something in mind
        </Title>
        <TextInput
          ref={searchFieldRef}
          size="xl"
          radius="xl"
          placeholder="Search posts, authors, topics/tags..."
          leftSection={<IconSearch size={24} />}
          onChange={(e) => setQuery(e.target.value)}
        />

        {query.length > 2 && (
          <Stack gap="xl">
            <Title order={2}>
              Results for{' '}
              <Title component="span" order={2} c="green">
                {query}
              </Title>
            </Title>
            {loading ? (
              <Loading />
            ) : (
              <Fragment>
                {results.totalCount === 0 ? (
                  <Title order={5} ta="center">
                    No results found.
                  </Title>
                ) : (
                  <Fragment>
                    {results.users.length > 0 && (
                      <Stack gap="md">
                        <Divider
                          labelPosition="left"
                          label={
                            <Title c="dark" order={5}>
                              Authors ({results.users.length})
                            </Title>
                          }
                        />

                        <Group gap="lg">
                          {results.users.map((user: TProfileBadge) => (
                            <ProfileBadge profile={user} key={user.id} />
                          ))}
                        </Group>
                      </Stack>
                    )}
                    {results.tags.length > 0 && (
                      <Stack gap={6}>
                        <Divider
                          labelPosition="left"
                          label={
                            <Title c="dark" order={5}>
                              Tags ({results.tags.length})
                            </Title>
                          }
                        />

                        <Group gap="lg">
                          {results.tags.map((tag: string) => (
                            <UnstyledButton key={tag}>
                              <Badge variant="light">{tag}</Badge>
                            </UnstyledButton>
                          ))}
                        </Group>
                      </Stack>
                    )}
                    {results.posts.length > 0 && (
                      <Stack gap="md">
                        <Divider
                          labelPosition="left"
                          label={
                            <Title c="dark" order={5}>
                              Posts ({results.posts.length})
                            </Title>
                          }
                        />

                        <Group gap="lg">
                          {results.posts.map((item: TPostItem) => (
                            <PostCard item={item} key={item.id} />
                          ))}
                        </Group>
                      </Stack>
                    )}
                  </Fragment>
                )}
              </Fragment>
            )}
          </Stack>
        )}
      </Stack>
    </ProtectedLayout>
  );
};

const Loading = () => {
  return (
    <Stack gap="xl">
      <Stack gap="md">
        <Skeleton height={30} width="45%" />
        <Group gap={6}>
          <Skeleton height={34} radius="sm" width={160} />
          <Skeleton height={34} radius="sm" width={160} />
          <Skeleton height={34} radius="sm" width={160} />
          <Skeleton height={34} radius="sm" width={160} />
        </Group>
      </Stack>
      <Stack gap="md">
        <Skeleton height={30} width="45%" />
        <Group gap={6}>
          <Skeleton height={24} radius="sm" width={120} />
          <Skeleton height={24} radius="sm" width={80} />
          <Skeleton height={24} radius="sm" width={100} />
          <Skeleton height={24} radius="sm" width={70} />
          <Skeleton height={24} radius="sm" width={150} />
          <Skeleton height={24} radius="sm" width={70} />
          <Skeleton height={24} radius="sm" width={60} />
          <Skeleton height={24} radius="sm" width={70} />
          <Skeleton height={24} radius="sm" width={150} />
          <Skeleton height={24} radius="sm" width={70} />
          <Skeleton height={24} radius="sm" width={100} />
          <Skeleton height={24} radius="sm" width={70} />
        </Group>
      </Stack>
      <Stack gap="md">
        <Skeleton height={30} width="45%" />
        {[...new Array(4)].map((_, index) => (
          <Card p={0} key={index}>
            <Grid>
              <Grid.Col span={8}>
                <Stack>
                  <Group gap={6}>
                    <Skeleton radius="xl" width={30} height={30} />
                    <Skeleton height={20} width="50%" radius="sm" />
                  </Group>
                  <Stack gap="xs">
                    <Skeleton height={24} radius="sm" />
                    <Skeleton height={24} radius="sm" />
                    <Skeleton height={24} width="80%" radius="sm" />
                  </Stack>
                </Stack>
              </Grid.Col>
              <Grid.Col span={4} flex={1} display="flex">
                <Skeleton
                  height={100}
                  radius="sm"
                  style={{
                    alignSelf: 'center'
                  }}
                />
              </Grid.Col>
            </Grid>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
};

export default Search;
