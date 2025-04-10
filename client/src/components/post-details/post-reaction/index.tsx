import { FC, useMemo } from 'react';
import { ActionIcon, Group, Text } from '@mantine/core';
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
  onLike: (isLiked: boolean) => void;
  onComment: () => void;
  onSave: (isSaved: boolean) => void;
};

const PostReaction: FC<PostReactionProps> = ({
  post,
  onLike,
  onComment,
  onSave
}) => {
  const auth = useRecoilValue(states.auth);

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
    <Group gap="lg" align="center">
      <Group justify="center" align="center" gap={4}>
        <ActionIcon
          variant="transparent"
          disabled={!auth.isAuth && !auth.profile}
          onClick={() => onLike(isLiked)}
        >
          {isLiked ? <IconHeartFilled size={24} /> : <IconHeart size={24} />}
        </ActionIcon>
        <Text c="dimmed">{post.likeCount}</Text>
      </Group>
      <Group justify="center" align="center" gap={4}>
        <ActionIcon
          variant="transparent"
          disabled={!auth.isAuth && !auth.profile}
          onClick={onComment}
        >
          {isCommented ? (
            <IconMessageFilled size={24} />
          ) : (
            <IconMessage size={24} />
          )}
        </ActionIcon>
        <Text c="dimmed">{post.commentCount}</Text>
      </Group>
      <Group justify="center" align="center" gap={4}>
        <ActionIcon
          variant="transparent"
          disabled={!auth.isAuth && !auth.profile}
          onClick={() => onSave(isSaved)}
        >
          {isSaved ? (
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
