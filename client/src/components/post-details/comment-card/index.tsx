import { FC, Fragment, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router';
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
import {
  IconClock,
  IconDotsVertical,
  IconEdit,
  IconHeart,
  IconHeartFilled,
  IconMessage,
  IconTrash
} from '@tabler/icons-react';
import { useMutation } from '@apollo/client';
import { format } from 'date-fns';
import { useRecoilState, useRecoilValue } from 'recoil';

import states from '../../../states';
import {
  DELETE_COMMENT,
  LIKE_COMMENT,
  UPDATE_COMMENT
} from '../../../graphql/mutations';
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
};

const CommentCard: FC<CommentCardProps> = ({
  comment,
  isOwnComment,
  isLastComment
}) => {
  const auth = useRecoilValue(states.auth);
  const [post, setPost] = useRecoilState(states.post);
  const { postDetails } = post;

  const [showEdit, setShowEdit] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

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

  const [likeComment] = useMutation(LIKE_COMMENT);
  const [updateComment] = useMutation(UPDATE_COMMENT);
  const [deleteComment] = useMutation(DELETE_COMMENT);

  const location = useLocation();

  useEffect(() => {
    if (location.search.includes('comment') && comment) {
      const commentId = new URLSearchParams(location.search).get('comment');
      const showReplies = new URLSearchParams(location.search).get(
        'showReplies'
      );

      if (commentId === comment.id) {
        const el = document.getElementById(comment.id);

        if (el) {
          el.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });

          if (comment.replies.length > 0 && Boolean(showReplies)) {
            setShowReplies(true);
          }
        }
      }
    }
  }, [location, comment]);

  const handleLike = async () => {
    try {
      setSubmitting(true);

      const response = await likeComment({
        variables: {
          postId: postDetails?.id,
          commentId: comment?.id
        }
      });
      const key = Object.keys(response.data)[0];
      const data = response.data[key];

      if (data) {
        setPost((prev: TPostState) => ({
          ...prev,
          postDetails: {
            ...(prev.postDetails as TPostDetails),
            comments: data.comments,
            commentCount: data.commentCount
          }
        }));
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'An error occurred while liking the comment.',
        color: 'red',
        position: 'top-center'
      });
    }
  };

  const handleUpdate = async (values: typeof form.values) => {
    try {
      setSubmitting(true);

      const response = await updateComment({
        variables: {
          postId: postDetails?.id,
          commentId: comment?.id,
          body: values.comment
        }
      });
      const key = Object.keys(response.data)[0];
      const data = response.data[key];

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
      const response = await deleteComment({
        variables: {
          postId: postDetails?.id,
          commentId: comment?.id
        }
      });
      const key = Object.keys(response.data)[0];
      const data = response.data[key];

      if (data) {
        setPost((prev: TPostState) => ({
          ...prev,
          postDetails: {
            ...(prev.postDetails as TPostDetails),
            comments: data.comments,
            commentCount: data.commentCount
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
    () => (Array.isArray(comment?.replies) ? comment?.replies : []),
    [comment]
  );

  if (showEdit) {
    return (
      <Fragment>
        <Stack key={comment.id} gap="lg">
          <Stack gap={6}>
            <Group justify="space-between" align="center">
              <ProfileBadge profile={comment.commentor} />
            </Group>
            <form onSubmit={form.onSubmit(handleUpdate)}>
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

  return (
    <Fragment>
      <Stack id={comment.id} key={comment.id} gap="lg">
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

        <Text>{comment.body}</Text>
      </Stack>

      <Stack>
        <Group align="center" mb={showReplyForm || showReplies ? 0 : -16}>
          <Group align="center" gap={6}>
            <ActionIcon variant="transparent" onClick={handleLike}>
              {isLiked ? (
                <IconHeartFilled size={24} />
              ) : (
                <IconHeart size={24} />
              )}
            </ActionIcon>
            <Text c="dimmed">{likeCount}</Text>
          </Group>

          {replyCount && (
            <Button
              px={0}
              variant="transparent"
              leftSection={<IconMessage size={24} />}
              onClick={() => setShowReplies(!showReplies)}
            >
              <Text c="dimmed">
                {replyCount} {replyCount > 1 ? 'Replies' : 'Reply'}
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

        <Group pb={0} align="center">
          <Divider mx="sm" mb={0} orientation="vertical" size="lg" />
          <Stack gap="lg" flex={1}>
            {showReplyForm && (
              <ReplyForm
                comment={comment}
                onHide={() => setShowReplyForm(false)}
                onShowReplies={() => setShowReplies(true)}
              />
            )}
            {showReplies && (
              <Stack gap="md">
                {replies.map((reply: TReplyItem, index: number) => (
                  <ReplyCard
                    key={index}
                    commentId={comment?.id}
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
