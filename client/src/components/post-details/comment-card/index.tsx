import { FC, Fragment, useState } from 'react';
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
import { useNavigate } from 'react-router';
import {
  IconClock,
  IconDotsVertical,
  IconEdit,
  IconTrash
} from '@tabler/icons-react';
import { format } from 'date-fns';

import ProfileBadge from '../../profile-badge';

interface ICommentCardProps {
  comment: any;
  isOwnComment: boolean;
  isLastComment: boolean;
  updateComment: (commentId: string, values: any) => Promise<any>;
  deleteComment: (commentId: string) => Promise<any>;
}

const CommentCard: FC<ICommentCardProps> = ({
  comment,
  isOwnComment,
  isLastComment,
  updateComment,
  deleteComment
}) => {
  const [showEdit, setShowEdit] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

  const navigate = useNavigate();

  const handleSubmitUpdate = async (values: typeof form.values) => {
    try {
      setSubmitting(true);

      const data = await updateComment(comment.id, values);

      if (data) {
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
              <ProfileBadge
                profile={comment.commentor}
                onClick={() => navigate(`/profile/${comment.commentor.email}`)}
              />
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

  return (
    <Fragment>
      <Stack key={comment.id} gap="lg">
        <Stack gap={6}>
          <Group justify="space-between" align="center">
            <ProfileBadge
              profile={comment.commentor}
              onClick={() => navigate(`/profile/${comment.commentor.email}`)}
            />
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
      {!isLastComment && <Divider />}
    </Fragment>
  );
};

export default CommentCard;
