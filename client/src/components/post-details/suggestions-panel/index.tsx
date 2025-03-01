import { FC } from 'react';
import { Card, Stack, Title } from '@mantine/core';
import { useQuery } from '@apollo/client';
import { GET_POSTS_BY_TAGS } from '../../../graphql/queries';

import ExtrasPostCard from '../extras-post-card';

interface SuggestionsPanelProps {
  postId: string;
  tags: string[];
}

const SuggestionsPanel: FC<SuggestionsPanelProps> = ({ postId, tags }) => {
  const { data } = useQuery(GET_POSTS_BY_TAGS, {
    variables: { tags }
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
          {posts.length > 0 ? renderList() : renderEmpty()}
        </Stack>
      </Card>
    );
  }
};

export default SuggestionsPanel;
