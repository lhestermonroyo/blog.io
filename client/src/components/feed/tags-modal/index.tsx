import { FC, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

import states from '../../../states';
import { useDisclosure } from '@mantine/hooks';
import {
  Button,
  Group,
  Modal,
  MultiSelect,
  Stack,
  Text,
  Title
} from '@mantine/core';
import { GET_TAGS } from '../../../graphql/queries';
import { useMutation, useQuery } from '@apollo/client';
import { ASSIGN_TAGS } from '../../../graphql/mutations';
import { notifications } from '@mantine/notifications';
import { useForm } from '@mantine/form';

const TagsModal: FC = () => {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const form = useForm({
    initialValues: {
      tags: []
    },
    validate: {
      tags: (value) => (value.length < 3 ? 'Select atleast 3 topics' : null)
    },
    mode: 'uncontrolled',
    validateInputOnBlur: true
  });

  const [auth, setAuth] = useRecoilState(states.auth);
  const { profile } = auth;

  const { data } = useQuery(GET_TAGS);
  const [assignTags] = useMutation(ASSIGN_TAGS);

  useEffect(() => {
    if (!profile.tags.length) {
      setOpen(true);
    }
  }, [profile]);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const response = await assignTags({
        variables: {}
      });
      setOpen(false);
    } catch (error) {
      notifications.show({
        title: 'Assign Topics failed',
        message: 'An error occurred. Please try again.',
        color: 'red',
        position: 'top-center'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (data) {
    const key = Object.keys(data)[0];
    const tags = data[key];

    return (
      <Modal
        opened={open}
        withCloseButton={false}
        centered
        size="40%"
        title="Select Topics"
        onClose={close}
      >
        <Stack gap="lg">
          <Title order={4}>
            Where do your interests lie? Select your preferred topics first to
            personalize your feed.
          </Title>
          <form>
            <MultiSelect
              label="Select Topics"
              placeholder="Select minumum of 3 topics"
              data={tags}
              searchable
              clearable
              checkIconPosition="right"
            />
            <Group justify="flex-end">
              <Button onClick={handleSubmit}>Submit</Button>
            </Group>
          </form>
        </Stack>
      </Modal>
    );
  }
};

export default TagsModal;
