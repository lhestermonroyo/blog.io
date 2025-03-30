import { useEffect, useState } from 'react';
import { Button, Group, MultiSelect, Stack, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useForm } from '@mantine/form';
import { useMediaQuery } from '@mantine/hooks';
import { useMutation } from '@apollo/client';
import { useRecoilState, useRecoilValue } from 'recoil';

import states from '../../../states';
import { UPDATE_PROFILE } from '../../../graphql/mutations';

const TagsForm = () => {
  const [submitting, setSubmitting] = useState(false);

  const [auth, setAuth] = useRecoilState(states.auth);
  const tag = useRecoilValue(states.tag);
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

  const isMd = useMediaQuery('(max-width: 768px)');

  const [updateProfile] = useMutation(UPDATE_PROFILE);

  useEffect(() => {
    form.setValues({
      tags: profile?.tags || []
    });
  }, []);

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
    <Stack gap="lg" px={!isMd ? 'xl' : 'sm'} mt={!isMd ? 0 : 'md'}>
      <Title order={!isMd ? 3 : 4}>Topics/Tags</Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <MultiSelect
            label="Select Topics/tags"
            placeholder="Select minumum of 3 topics/tags"
            data={tag?.list}
            searchable
            clearable
            checkIconPosition="right"
            key={form.key('tags')}
            {...form.getInputProps('tags')}
          />

          <Group gap={6} mt="xl">
            <Button variant="filled" type="submit" loading={submitting}>
              Save Changes
            </Button>
          </Group>
        </Stack>
      </form>
    </Stack>
  );
};

export default TagsForm;
