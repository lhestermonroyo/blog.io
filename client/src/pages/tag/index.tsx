import { Fragment, useEffect } from 'react';
// @ts-ignore
import { Helmet } from 'react-helmet';
import { useNavigate, useParams } from 'react-router';
import { Badge, Divider, Group, SimpleGrid, Stack, Title } from '@mantine/core';
import { useQuery } from '@apollo/client';
import { useRecoilValue } from 'recoil';

import states from '../../states';
import { GET_POSTS_BY_TAGS } from '../../graphql/queries';
import { TPostItem } from '../../../types';

import MainLayout from '../../layouts/main';
import LoadingFeed from '../../components/feed/loading-feed';
import PostCard from '../../components/feed/post-card';

const Tag = () => {
  const tag = useRecoilValue(states.tag);
  const { list } = tag;

  const param = useParams();
  const navigate = useNavigate();

  const {
    data: response,
    loading,
    error,
    refetch: fetchPostsByTags
  } = useQuery(GET_POSTS_BY_TAGS, {
    variables: { tags: [param.tag] },
    skip: !param.tag
  });

  useEffect(() => {
    fetchPostsByTags();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [param.tag]);

  const key = Object.keys(response || {})[0];
  const data = response ? response[key] : {};
  const posts = data.posts || [];

  return (
    <Fragment>
      <Helmet>
        <title>blog.io | {`${param.tag}`}</title>
        <meta name="description" content={`Tag: ${param.tag}`} />
        <link rel="canonical" href={`/tag/${param.tag}`} />
      </Helmet>
      <MainLayout>
        <Stack gap="lg">
          <Title order={1} tt="capitalize">
            {param.tag}
          </Title>
          <LoadingFeed
            loading={loading}
            error={error}
            refetch={fetchPostsByTags}
          >
            <Stack>
              <Title order={3}>
                <Title order={3} component="span" c="green">
                  {posts?.length}
                </Title>{' '}
                {posts?.length === 1 ? 'post' : 'posts'} found
              </Title>
              <SimpleGrid
                cols={{
                  base: 1,
                  md: posts?.length === 1 ? 1 : 2
                }}
                spacing={24}
              >
                {posts.map((post: TPostItem) => (
                  <PostCard key={post.id} item={post} />
                ))}
              </SimpleGrid>
            </Stack>
          </LoadingFeed>
          <Divider
            labelPosition="left"
            label={
              <Title c="dark" order={3}>
                Explore other topics/tags
              </Title>
            }
          />
          <Group gap={6}>
            {list.map((item: string) => {
              if (item === param.tag) return null;

              return (
                <Badge
                  style={{
                    cursor: 'pointer'
                  }}
                  key={item}
                  onClick={() => navigate(`/tag/${item}`)}
                  variant="light"
                  component="button"
                >
                  {item}
                </Badge>
              );
            })}
          </Group>
        </Stack>
      </MainLayout>
    </Fragment>
  );
};

export default Tag;
