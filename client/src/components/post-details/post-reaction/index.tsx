import { FC } from 'react';
import { ActionIcon, Group, Text } from '@mantine/core';
import {
  IconHeart,
  IconHeartFilled,
  IconMessage,
  IconMessageFilled
} from '@tabler/icons-react';
import { TPostDetails } from '../../../../types';

type PostReactionProps = {
  post: TPostDetails;
  isLiked: boolean;
  isCommented: boolean;
  onLike: () => void;
  onComment: () => void;
};

const PostReaction: FC<PostReactionProps> = ({
  post,
  isLiked,
  isCommented,
  onLike,
  onComment
}) => {
  return (
    <Group gap="lg">
      <Group justify="center" align="center" gap={4}>
        <ActionIcon variant="transparent" onClick={onLike}>
          {isLiked ? <IconHeartFilled size={24} /> : <IconHeart size={24} />}
        </ActionIcon>
        <Text c="dimmed">{post.likeCount}</Text>
      </Group>
      <Group justify="center" align="center" gap={4}>
        <ActionIcon variant="transparent" onClick={onComment}>
          {isCommented ? (
            <IconMessageFilled size={24} />
          ) : (
            <IconMessage size={24} />
          )}
        </ActionIcon>
        <Text c="dimmed">{post.commentCount}</Text>
      </Group>
    </Group>
  );
};

export default PostReaction;
