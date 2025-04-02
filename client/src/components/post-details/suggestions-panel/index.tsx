import { FC } from 'react';
import { Card, Divider, Skeleton, Stack, Text, Title } from '@mantine/core';
import { useRecoilValue } from 'recoil';

import states from '../../../states';
import { TPostItem } from '../../../../types';

import ExtrasPostCard from '../extras-post-card';

type SuggestionsPanelProps = {
  loading: boolean;
  list: TPostItem[];
};

const SuggestionsPanel: FC<SuggestionsPanelProps> = ({ loading, list }) => {
  const post = useRecoilValue(states.post);
  const { postDetails } = post;

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

  if (list) {
    const filteredPosts = list.filter(
      (post: TPostItem) => post.id !== postDetails?.id
    );

    const renderList = () => {
      return filteredPosts.map((item: TPostItem, index: number) => (
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
          <Text c="dimmed">
            Looks like the author hasn't written any other posts.
          </Text>
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
