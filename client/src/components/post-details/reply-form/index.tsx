import { FC, useState } from 'react';
import { Button, Group, Stack, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@apollo/client';
import { useRecoilState } from 'recoil';

import { TCommentItem, TPostDetails, TPostState } from '../../../../types';
import { CREATE_REPLY } from '../../../graphql/mutations';
import states from '../../../states';

type ReplyFormProps = {
  comment: TCommentItem;
  onHide: () => void;
  onShowReplies: () => void;
};

const ReplyForm: FC<ReplyFormProps> = ({ comment, onHide, onShowReplies }) => {
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
        onShowReplies();

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
