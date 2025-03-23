import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import states from '../../states';
import { Button, Group, MultiSelect, Stack, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useForm } from '@mantine/form';
import { IconArrowLeft } from '@tabler/icons-react';
import { useMutation, useQuery } from '@apollo/client';
import { useRecoilState } from 'recoil';

import { UPDATE_PROFILE } from '../../graphql/mutations';
import { GET_TAGS } from '../../graphql/queries';

import ProtectedLayout from '../../layouts/protected';

const EditTags = () => {
  const [submitting, setSubmitting] = useState(false);

  const [post, setPost] = useRecoilState(states.post);
  const [auth, setAuth] = useRecoilState(states.auth);
  const { profile } = auth;

  const form = useForm({
    initialValues: {
      tags: [] as string[]
    },
    validate: {
      tags: (value) =>
        value.length < 3 ? 'Select atleast 3 topics/tags' : null
    },
    mode: 'uncontrolled',
    validateInputOnBlur: true
  });

  const { data: tagsResponse } = useQuery(GET_TAGS, {
    skip: !post?.tags
  });
  const [updateProfile] = useMutation(UPDATE_PROFILE);

  const navigate = useNavigate();

  useEffect(() => {
    form.setValues({
      tags: profile?.tags || []
    });
  }, []);

  useEffect(() => {
    if (tagsResponse) {
      const key = Object.keys(tagsResponse)[0];
      const data = tagsResponse[key];

      setPost((prev) => ({
        ...prev,
        tags: data
      }));
    }
  }, [tagsResponse]);

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setSubmitting(true);

      const currProfile = Object.assign({}, profile) as any;
      const currSocials = Object.assign({}, currProfile?.socials) as any;

      delete currProfile?.__typename;
      delete currProfile?.id;
      delete currProfile?.email;
      delete currProfile?.age;
      delete currProfile?.createdAt;
      delete currSocials?.__typename;

      const response = await updateProfile({
        variables: {
          profileInput: {
            ...currProfile,
            socials: {
              ...currSocials
            },
            tags: values.tags
          }
        }
      });
      const key = Object.keys(response.data)[0];
      const data = response.data[key];

      setAuth((prev) => ({
        ...prev,
        profile: data
      }));

      notifications.show({
        title: 'Success',
        message: 'Socials updated successfully.',
        color: 'green',
        position: 'top-center'
      });
    } catch (error) {
      console.log('error', error);
      notifications.show({
        title: 'Error',
        message: 'An error occurred while updating your socials.',
        color: 'red',
        position: 'top-center'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedLayout size="sm">
      <Stack gap="lg">
        <Group>
          <Button
            variant="default"
            leftSection={<IconArrowLeft size={16} />}
            onClick={() => navigate('/profile')}
          >
            Back
          </Button>
        </Group>
        <Title order={1}>Edit Topics/Tags</Title>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <MultiSelect
              label="Select Topics/tags"
              placeholder="Select minumum of 3 topics/tags"
              data={post?.tags}
              searchable
              clearable
              checkIconPosition="right"
              key={form.key('tags')}
              {...form.getInputProps('tags')}
            />

            <Group gap={6}>
              <Button variant="filled" type="submit" loading={submitting}>
                Save Changes
              </Button>
            </Group>
          </Stack>
        </form>
      </Stack>
    </ProtectedLayout>
  );
};

export default EditTags;
