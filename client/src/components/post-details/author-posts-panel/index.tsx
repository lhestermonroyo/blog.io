import { Card, Divider, Skeleton, Stack, Text, Title } from '@mantine/core';
import { useRecoilValue } from 'recoil';

import states from '../../../states';
import { TPostItem } from '../../../../types';

import ExtrasPostCard from '../extras-post-card';

const AuthorPostsPanel = ({ loading }: { loading: boolean }) => {
  const post = useRecoilValue(states.post);
  const {
    postDetails,
    creatorStats: {
      posts: { list }
    }
  } = post;

  if (loading) {
    return (
      <Card withBorder>
        <Stack gap="lg">
          <Title order={3}>More from the Author</Title>
          <Stack gap="lg">
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
          displayProfile={false}
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
          <Title order={3}>More from the Author</Title>
          {filteredPosts.length > 0 ? renderList() : renderEmpty()}
        </Stack>
      </Card>
    );
  }
};

export default AuthorPostsPanel;
