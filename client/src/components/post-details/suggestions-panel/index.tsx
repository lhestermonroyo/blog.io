import { FC } from 'react';
import { Card, Divider, Skeleton, Stack, Title } from '@mantine/core';
import { useQuery } from '@apollo/client';

import { GET_POSTS_BY_TAGS } from '../../../graphql/queries';

import ExtrasPostCard from '../extras-post-card';

interface SuggestionsPanelProps {
  postId: string;
  tags: string[];
}

const SuggestionsPanel: FC<SuggestionsPanelProps> = ({ postId, tags }) => {
  const { data, loading } = useQuery(GET_POSTS_BY_TAGS, {
    variables: { tags, limit: 5 }
  });

  if (loading) {
    return (
      <Card withBorder>
        <Stack gap="lg">
          <Title order={3}>Posts Like This</Title>
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
        />
      ));
    };

    const renderEmpty = () => {
      return (
        <Stack gap="lg">
          <Title order={5}>
            Looks like there are no other posts like this.
          </Title>
        </Stack>
      );
    };

    return (
      <Card withBorder>
        <Stack gap="lg">
          <Title order={3}>Posts Like This</Title>
          {filteredPosts.length > 0 ? renderList() : renderEmpty()}
        </Stack>
      </Card>
    );
  }
};

export default SuggestionsPanel;
