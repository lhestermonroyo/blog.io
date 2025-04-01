import { FC, Fragment, useMemo, useState } from 'react';
import {
  ActionIcon,
  Button,
  Divider,
  Group,
  Menu,
  Stack,
  Text,
  Textarea
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { useMediaQuery } from '@mantine/hooks';
import {
  IconClock,
  IconDotsVertical,
  IconEdit,
  IconHeart,
  IconHeartFilled,
  IconMessage,
  IconTrash
} from '@tabler/icons-react';
import { format } from 'date-fns';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import states from '../../../states';
import {
  TCommentItem,
  TPostDetails,
  TPostState,
  TReplyItem
} from '../../../../types';

import ProfileBadge from '../../profile-badge';
import ReplyForm from '../reply-form';
import ReplyCard from '../reply-card';

type CommentCardProps = {
  comment: TCommentItem;
  isOwnComment: boolean;
  isLastComment: boolean;
  updateComment: (commentId: string, values: any) => Promise<any>;
  deleteComment: (commentId: string) => Promise<any>;
};

const CommentCard: FC<CommentCardProps> = ({
  comment,
  isOwnComment,
  isLastComment,
  updateComment,
  deleteComment
}) => {
  const auth = useRecoilValue(states.auth);
  const setPost = useSetRecoilState(states.post);

  const [showEdit, setShowEdit] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const isMd = useMediaQuery('(max-width: 768px)');

  const form = useForm({
    initialValues: {
      comment: comment.body
    },
    validate: {
      comment: (value) => (!value.length ? 'Comment must not be empty' : null)
    },
    mode: 'uncontrolled',
    validateInputOnBlur: true
  });

  const handleSubmitUpdate = async (values: typeof form.values) => {
    try {
      setSubmitting(true);

      const data = await updateComment(comment.id, values);

      if (data) {
        setPost((prev: TPostState) => ({
          ...prev,
          postDetails: {
            ...(prev.postDetails as TPostDetails),
            comments: data.comments,
            commentCount: data.comments
          }
        }));

        notifications.show({
          title: 'Success',
          message: 'Your comment has been updated successfully.',
          color: 'teal',
          position: 'top-center'
        });
        setShowEdit(false);
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'An error occurred while updating the comment.',
        color: 'red',
        position: 'top-center'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      const data = await deleteComment(comment.id);

      if (data) {
        setPost((prev: TPostState) => ({
          ...prev,
          postDetails: {
            ...(prev.postDetails as TPostDetails),
            comments: data.comments.filter(
              (c: TCommentItem) => c.id !== comment.id
            ),
            commentCount: (prev.postDetails?.commentCount || 0) - 1
          }
        }));

        notifications.show({
          title: 'Success',
          message: 'Your comment has been deleted successfully.',
          color: 'teal',
          position: 'top-center'
        });
        modals.close('delete-comment');
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'An error occurred while deleting the comment.',
        color: 'red',
        position: 'top-center'
      });
    }
  };

  const showDeleteModal = () =>
    modals.openConfirmModal({
      id: 'delete-comment',
      withCloseButton: false,
      title: 'Delete Comment',
      children: (
        <Text size="sm">
          Are you sure you want to delete this comment? This action cannot be
          undone.
        </Text>
      ),
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onConfirm: () => handleDelete()
    });

  if (showEdit) {
    return (
      <Fragment>
        <Stack key={comment.id} gap="lg">
          <Stack gap={6}>
            <Group justify="space-between" align="center">
              <ProfileBadge profile={comment.commentor} />
            </Group>
            <form onSubmit={form.onSubmit(handleSubmitUpdate)}>
              <Stack>
                <Textarea
                  label="Comment"
                  placeholder="Enter your comment"
                  name="comment"
                  key={form.key('comment')}
                  {...form.getInputProps('comment')}
                />
                <Group gap={6}>
                  <Button type="submit" loading={submitting}>
                    Submit
                  </Button>
                  <Button
                    variant="default"
                    disabled={submitting}
                    onClick={() => setShowEdit(false)}
                  >
                    Cancel
                  </Button>
                </Group>
              </Stack>
            </form>
          </Stack>
        </Stack>
        {!isLastComment && <Divider />}
      </Fragment>
    );
  }

  const profileEmail = auth?.profile?.email as string;

  const isLiked = useMemo(
    () =>
      Array.isArray(comment?.likes) &&
      comment?.likes.some((like) => like.liker?.email === profileEmail),
    [comment]
  );
  const likeCount = useMemo(() => comment?.likes?.length || 0, [comment]);
  const replyCount = useMemo(() => comment?.replies?.length || 0, [comment]);
  const replies = useMemo(
    () => (Array.isArray(comment?.replies) && comment?.replies) || [],
    [comment]
  );

  return (
    <Fragment>
      <Stack key={comment.id} gap="lg">
        <Stack gap={6}>
          <Group justify="space-between" align="center">
            <ProfileBadge profile={comment.commentor} />
            {isOwnComment && (
              <Menu
                width={120}
                position="bottom-end"
                transitionProps={{ transition: 'pop-top-right' }}
                withinPortal
              >
                <Menu.Target>
                  <ActionIcon variant="transparent" color="dimmed">
                    <IconDotsVertical />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    leftSection={<IconEdit size={16} stroke={1.5} />}
                    onClick={() => setShowEdit(true)}
                  >
                    Edit
                  </Menu.Item>
                  <Menu.Divider />

                  <Menu.Item
                    leftSection={<IconTrash size={16} stroke={1.5} />}
                    onClick={showDeleteModal}
                  >
                    Delete
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            )}
          </Group>
          <Group gap={4} align="center">
            <IconClock size={14} />
            <Text fz="xs" c="dimmed">
              {format(new Date(comment.createdAt), 'MMMM dd - hh:mm a')}
            </Text>
            {comment?.isEdited && (
              <Text fz="xs" c="dimmed">
                &bull; Edited
              </Text>
            )}
          </Group>
        </Stack>

        <Text size={!isMd ? 'md' : 'sm'}>{comment.body}</Text>
      </Stack>

      <Stack gap={0}>
        <Group mb="md">
          <Group gap={6}>
            <ActionIcon
              variant="transparent"
              // disabled={!auth.isAuth && !auth.profile}
              // onClick={onLike}
            >
              {isLiked ? (
                <IconHeartFilled size={!isMd ? 24 : 20} />
              ) : (
                <IconHeart size={!isMd ? 24 : 20} />
              )}
            </ActionIcon>
            <Text c="dimmed" size={!isMd ? 'md' : 'sm'}>
              {likeCount}
            </Text>
          </Group>

          {replyCount && (
            <Button
              px={0}
              variant="transparent"
              leftSection={<IconMessage size={!isMd ? 24 : 20} />}
              // disabled={!auth.isAuth && !auth.profile}
              onClick={() => setShowReplies(!showReplies)}
            >
              <Text c="dimmed" size={!isMd ? 'md' : 'sm'}>
                {replyCount} replies
              </Text>
            </Button>
          )}

          <Divider
            style={{
              alignSelf: 'center'
            }}
            orientation="vertical"
            h={16}
          />

          <Button
            variant="transparent"
            px={0}
            onClick={() => setShowReplyForm(!showReplyForm)}
          >
            Reply
          </Button>
        </Group>

        <Group>
          <Divider mx="sm" orientation="vertical" size="lg" />
          <Stack flex={1}>
            {showReplyForm && (
              <ReplyForm
                comment={comment}
                onHide={() => setShowReplyForm(false)}
              />
            )}
            {showReplies && (
              <Stack>
                {replies.map((reply: TReplyItem, index: number) => (
                  <ReplyCard
                    key={index}
                    reply={reply}
                    isLastReply={replies.length === index + 1}
                    isOwnReply={reply.replier.email === profileEmail}
                  />
                ))}
              </Stack>
            )}
          </Stack>
        </Group>
      </Stack>
      {!isLastComment && <Divider />}
    </Fragment>
  );
};

export default CommentCard;
