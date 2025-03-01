import { FC } from 'react';
import { Card, Stack, Title } from '@mantine/core';
import { useQuery } from '@apollo/client';
import { GET_POSTS_BY_CREATOR } from '../../../graphql/queries';

import ExtrasPostCard from '../extras-post-card';

interface AuthorPostsPanelProps {
  postId: string;
  creator: string;
}

const AuthorPostsPanel: FC<AuthorPostsPanelProps> = ({ postId, creator }) => {
  const { data } = useQuery(GET_POSTS_BY_CREATOR, {
    variables: { creator }
  });

  if (data) {
    const key = Object.keys(data)[0];
    const posts = data[key].filter((post: any) => post.id !== postId);

    const renderList = () => {
      return posts.map((item: any, index: number) => (
        <ExtrasPostCard
          key={item.id}
          item={item}
          isLastPost={posts.length === index + 1}
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
          {posts.length > 0 ? renderList() : renderEmpty()}
        </Stack>
      </Card>
    );
  }
};

export default AuthorPostsPanel;
