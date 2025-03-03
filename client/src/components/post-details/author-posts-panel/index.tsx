import { FC, useEffect } from 'react';
import { Card, Divider, Skeleton, Stack, Title } from '@mantine/core';
import { useQuery } from '@apollo/client';
import { GET_POSTS_BY_CREATOR } from '../../../graphql/queries';

import ExtrasPostCard from '../extras-post-card';
import { useSetRecoilState } from 'recoil';
import states from '../../../states';

interface AuthorPostsPanelProps {
  postId: string;
  creator: string;
}

const AuthorPostsPanel: FC<AuthorPostsPanelProps> = ({ postId, creator }) => {
  const { data, loading } = useQuery(GET_POSTS_BY_CREATOR, {
    variables: { creator, limit: 5 }
  });

  const setPost = useSetRecoilState(states.post);

  useEffect(() => {
    if (data) {
      const key = Object.keys(data)[0];
      const { totalCount } = data[key];

      setPost((prev: any) => ({
        ...prev,
        creatorTotalPosts: totalCount
      }));
    }
  }, [data]);

  if (loading) {
    return (
      <Card withBorder>
        <Stack gap="lg">
          <Title order={3}>More Posts from the Author</Title>
          <Stack gap="xs">
            <Skeleton height={100} />
            <Divider />
            <Skeleton height={100} />
          </Stack>
        </Stack>
      </Card>
    );
  }

  if (data) {
    const key = Object.keys(data)[0];
    const { posts } = data[key];

    const filteredPosts = posts.filter((post: any) => post.id !== postId);

    const renderList = () => {
      return filteredPosts.map((item: any, index: number) => (
        <ExtrasPostCard
          key={item.id}
          item={item}
          isLastPost={filteredPosts.length === index + 1}
          displayProfile={false}
        />
      ));
    };

    const renderEmpty = () => {
      return (
        <Stack gap="lg">
          <Title order={5}>
            Looks like the author hasn't written any other posts.
          </Title>
        </Stack>
      );
    };

    return (
      <Card withBorder>
        <Stack gap="lg">
          <Title order={3}>More Posts from the Author</Title>
          {filteredPosts.length > 0 ? renderList() : renderEmpty()}
        </Stack>
      </Card>
    );
  }
};

export default AuthorPostsPanel;
