import { FC } from 'react';
import { ActionIcon, Group, Text } from '@mantine/core';
import {
  IconBookmark,
  IconBookmarkFilled,
  IconHeart,
  IconHeartFilled,
  IconMessage,
  IconMessageFilled
} from '@tabler/icons-react';
import { TPostDetails } from '../../../../types';

type PostReactionProps = {
  post: TPostDetails;
  onLike: () => void;
  onComment: () => void;
  onSave: () => void;
};

const PostReaction: FC<PostReactionProps> = ({
  post,
  onLike,
  onComment,
  onSave
}) => {
  return (
    <Group gap="lg">
      <Group justify="center" align="center" gap={4}>
        <ActionIcon variant="transparent" onClick={onLike}>
          {post?.isLiked ? (
            <IconHeartFilled size={24} />
          ) : (
            <IconHeart size={24} />
          )}
        </ActionIcon>
        <Text c="dimmed">{post.likeCount}</Text>
      </Group>
      <Group justify="center" align="center" gap={4}>
        <ActionIcon variant="transparent" onClick={onComment}>
          {post?.isCommented ? (
            <IconMessageFilled size={24} />
          ) : (
            <IconMessage size={24} />
          )}
        </ActionIcon>
        <Text c="dimmed">{post.commentCount}</Text>
      </Group>
      <Group justify="center" align="center" gap={4}>
        <ActionIcon variant="transparent" onClick={onSave}>
          {post?.isSaved ? (
            <IconBookmarkFilled size={24} />
          ) : (
            <IconBookmark size={24} />
          )}
        </ActionIcon>
        <Text c="dimmed">{post.saveCount}</Text>
      </Group>
    </Group>
  );
};

export default PostReaction;
