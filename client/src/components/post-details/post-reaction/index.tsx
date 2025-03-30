import { FC, useMemo } from 'react';
import { ActionIcon, Group, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  IconBookmark,
  IconBookmarkFilled,
  IconHeart,
  IconHeartFilled,
  IconMessage,
  IconMessageFilled
} from '@tabler/icons-react';
import { useRecoilValue } from 'recoil';

import states from '../../../states';
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
  const auth = useRecoilValue(states.auth);

  const isMd = useMediaQuery('(max-width: 768px)');

  const isLiked = useMemo(
    () =>
      post.likes.some((like) => like.liker?.id.toString() === auth.profile?.id),
    [post]
  );
  const isCommented = useMemo(
    () =>
      post.comments.some(
        (comment) => comment.commentor?.id.toString() === auth.profile?.id
      ),
    [post]
  );
  const isSaved = useMemo(
    () =>
      post.saves.some((save) => save.user?.id.toString() === auth.profile?.id),
    [post]
  );

  return (
    <Group gap="lg">
      <Group justify="center" align="center" gap={4}>
        <ActionIcon
          variant="transparent"
          disabled={!auth.isAuth && !auth.profile}
          onClick={onLike}
        >
          {isLiked ? (
            <IconHeartFilled size={!isMd ? 24 : 20} />
          ) : (
            <IconHeart size={!isMd ? 24 : 20} />
          )}
        </ActionIcon>
        <Text c="dimmed" size={!isMd ? 'md' : 'sm'}>
          {post.likeCount}
        </Text>
      </Group>
      <Group justify="center" align="center" gap={4}>
        <ActionIcon
          variant="transparent"
          disabled={!auth.isAuth && !auth.profile}
          onClick={onComment}
        >
          {isCommented ? (
            <IconMessageFilled size={!isMd ? 24 : 20} />
          ) : (
            <IconMessage size={!isMd ? 24 : 20} />
          )}
        </ActionIcon>
        <Text c="dimmed" size={!isMd ? 'md' : 'sm'}>
          {post.commentCount}
        </Text>
      </Group>
      <Group justify="center" align="center" gap={4}>
        <ActionIcon
          variant="transparent"
          disabled={!auth.isAuth && !auth.profile}
          onClick={onSave}
        >
          {isSaved ? (
            <IconBookmarkFilled size={!isMd ? 24 : 20} />
          ) : (
            <IconBookmark size={!isMd ? 24 : 20} />
          )}
        </ActionIcon>
        <Text c="dimmed" size={!isMd ? 'md' : 'sm'}>
          {post.saveCount}
        </Text>
      </Group>
    </Group>
  );
};

export default PostReaction;
