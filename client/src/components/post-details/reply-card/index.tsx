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
import { useRecoilValue, useSetRecoilState } from 'recoil';

import states from '../../../states';
import {
  TCommentItem,
  TPostDetails,
  TPostState,
  TReplyItem
} from '../../../../types';

import ProfileBadge from '../../profile-badge';

type ReplyCardProps = {
  reply: TReplyItem;
  isLastReply: boolean;
  isOwnReply: boolean;
};

const ReplyCard: FC<ReplyCardProps> = ({ reply, isLastReply, isOwnReply }) => {
  const auth = useRecoilValue(states.auth);
  const setPost = useSetRecoilState(states.post);

  const [showEdit, setShowEdit] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isMd = useMediaQuery('(max-width: 768px)');

  const form = useForm({
    initialValues: {
      comment: reply.body
    },
    validate: {
      comment: (value) => (!value.length ? 'Comment must not be empty' : null)
    },
    mode: 'uncontrolled',
    validateInputOnBlur: true
  });

  // const handleSubmitUpdate = async (values: typeof form.values) => {
  //   try {
  //     setSubmitting(true);

  //     const data = await updateComment(comment.id, values);

  //     if (data) {
  //       setPost((prev: TPostState) => ({
  //         ...prev,
  //         postDetails: {
  //           ...(prev.postDetails as TPostDetails),
  //           comments: data.comments,
  //           commentCount: data.comments
  //         }
  //       }));

  //       notifications.show({
  //         title: 'Success',
  //         message: 'Your comment has been updated successfully.',
  //         color: 'teal',
  //         position: 'top-center'
  //       });
  //       setShowEdit(false);
  //     }
  //   } catch (error) {
  //     notifications.show({
  //       title: 'Error',
  //       message: 'An error occurred while updating the comment.',
  //       color: 'red',
  //       position: 'top-center'
  //     });
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  // const handleDelete = async () => {
  //   try {
  //     const data = await deleteComment(comment.id);

  //     if (data) {
  //       setPost((prev: TPostState) => ({
  //         ...prev,
  //         postDetails: {
  //           ...(prev.postDetails as TPostDetails),
  //           comments: data.comments.filter(
  //             (c: TCommentItem) => c.id !== comment.id
  //           ),
  //           commentCount: (prev.postDetails?.commentCount || 0) - 1
  //         }
  //       }));

  //       notifications.show({
  //         title: 'Success',
  //         message: 'Your comment has been deleted successfully.',
  //         color: 'teal',
  //         position: 'top-center'
  //       });
  //       modals.close('delete-comment');
  //     }
  //   } catch (error) {
  //     notifications.show({
  //       title: 'Error',
  //       message: 'An error occurred while deleting the comment.',
  //       color: 'red',
  //       position: 'top-center'
  //     });
  //   }
  // };

  // const showDeleteModal = () =>
  //   modals.openConfirmModal({
  //     id: 'delete-comment',
  //     withCloseButton: false,
  //     title: 'Delete Comment',
  //     children: (
  //       <Text size="sm">
  //         Are you sure you want to delete this comment? This action cannot be
  //         undone.
  //       </Text>
  //     ),
  //     labels: { confirm: 'Confirm', cancel: 'Cancel' },
  //     onConfirm: () => handleDelete()
  //   });

  // if (showEdit) {
  //   return (
  //     <Fragment>
  //       <Stack key={comment.id} gap="lg">
  //         <Stack gap={6}>
  //           <Group justify="space-between" align="center">
  //             <ProfileBadge profile={comment.commentor} />
  //           </Group>
  //           <form onSubmit={form.onSubmit(handleSubmitUpdate)}>
  //             <Stack>
  //               <Textarea
  //                 label="Comment"
  //                 placeholder="Enter your comment"
  //                 name="comment"
  //                 key={form.key('comment')}
  //                 {...form.getInputProps('comment')}
  //               />
  //               <Group gap={6}>
  //                 <Button type="submit" loading={submitting}>
  //                   Submit
  //                 </Button>
  //                 <Button
  //                   variant="default"
  //                   disabled={submitting}
  //                   onClick={() => setShowEdit(false)}
  //                 >
  //                   Cancel
  //                 </Button>
  //               </Group>
  //             </Stack>
  //           </form>
  //         </Stack>
  //       </Stack>
  //       {!isLastComment && <Divider />}
  //     </Fragment>
  //   );
  // }

  const profileEmail = auth?.profile?.email as string;

  const isLiked = useMemo(
    () =>
      Array.isArray(reply?.likes) &&
      reply?.likes.some((like) => like.liker?.email === profileEmail),
    [reply]
  );
  const likeCount = useMemo(() => reply?.likes?.length || 0, [reply]);

  return (
    <Fragment>
      <Stack key={reply.id} gap="lg">
        <Stack gap={6}>
          <Group justify="space-between" align="center">
            <ProfileBadge profile={reply.replier} />
            {isOwnReply && (
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
                    // onClick={showDeleteModal}
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
              {format(new Date(reply.createdAt), 'MMMM dd - hh:mm a')}
            </Text>
            {reply?.isEdited && (
              <Text fz="xs" c="dimmed">
                &bull; Edited
              </Text>
            )}
          </Group>
        </Stack>

        <Text size={!isMd ? 'md' : 'sm'}>{reply.body}</Text>
      </Stack>

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
      </Group>
      {!isLastReply && <Divider />}
    </Fragment>
  );
};

export default ReplyCard;
