import { FC, Fragment, useMemo, useState } from 'react';
import {
  ActionIcon,
  Button,
  Divider,
  Group,
  Menu,
  Stack,
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
  IconTrash
} from '@tabler/icons-react';
import { format } from 'date-fns';

import { TCommentItem, TPostDetails, TPostState } from '../../../../types';

import ProfileBadge from '../../profile-badge';
import { useRecoilState, useSetRecoilState } from 'recoil';
import states from '../../../states';
import { useMutation } from '@apollo/client';
import { CREATE_REPLY } from '../../../graphql/mutations';

type ReplyFormProps = {
  comment: TCommentItem;
  onHide: () => void;
};

const ReplyForm: FC<ReplyFormProps> = ({ comment, onHide }) => {
  const [post, setPost] = useRecoilState(states.post);
  const { postDetails } = post;

  const [submitting, setSubmitting] = useState(false);

  const form = useForm({
    initialValues: {
      comment: ''
    },
    validate: {
      comment: (value) =>
        !value.length ? 'Reply comment must not be empty' : null
    },
    mode: 'uncontrolled',
    validateInputOnBlur: true
  });

  const [createReply] = useMutation(CREATE_REPLY);

  const handleSubmitReply = async (values: typeof form.values) => {
    // Implement reply submission logic here
    try {
      setSubmitting(true);

      const response = await createReply({
        variables: {
          postId: postDetails?.id,
          commentId: comment.id,
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
            commentCount: data.commentCount
          }
        }));
        form.reset();
        onHide();

        notifications.show({
          title: 'Success',
          message: 'Reply comment submitted successfully.',
          color: 'green',
          position: 'top-center'
        });
      }
    } catch (error) {
      console.log('Error:', error);
      notifications.show({
        title: 'Error',
        message: 'An error occurred while submitting the reply comment.',
        color: 'red',
        position: 'top-center'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Stack key={comment.id} gap="lg">
      <form onSubmit={form.onSubmit(handleSubmitReply)}>
        <Stack>
          <Textarea
            label="Reply"
            placeholder="Enter your reply to this comment"
            name="comment"
            key={form.key('comment')}
            {...form.getInputProps('comment')}
          />
          <Group gap={6}>
            <Button type="submit" loading={submitting}>
              Submit
            </Button>
            <Button variant="default" disabled={submitting} onClick={onHide}>
              Cancel
            </Button>
          </Group>
        </Stack>
      </form>
    </Stack>
  );
};

export default ReplyForm;
