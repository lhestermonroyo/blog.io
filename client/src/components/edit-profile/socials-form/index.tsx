import { useEffect, useState } from 'react';
import { Button, Group, Stack, Text, TextInput, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useForm } from '@mantine/form';
import { useMutation } from '@apollo/client';
import { useRecoilState } from 'recoil';

import states from '../../../states';
import { UPDATE_PROFILE } from '../../../graphql/mutations';
import { useMediaQuery } from '@mantine/hooks';

const SocialsForm = () => {
  const [auth, setAuth] = useRecoilState(states.auth);
  const { profile } = auth;

  const isMd = useMediaQuery('(max-width: 768px)');

  const [updateProfile] = useMutation(UPDATE_PROFILE);

  const handleSubmit = async (name: string, value: string) => {
    try {
      const currProfile = Object.assign({}, profile) as any;
      const currSocials = Object.assign({}, profile?.socials) as any;

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
              ...currSocials,
              [name]: value
            }
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
    }
  };

  return (
    <Stack gap="lg" px={!isMd ? 'xl' : 'sm'} mt={!isMd ? 0 : 'md'}>
      <Title order={!isMd ? 3 : 4}>Socials</Title>
      <EditItem
        label="Facebook"
        name="facebook"
        value={profile?.socials?.facebook || ''}
        onSave={handleSubmit}
      />
      <EditItem
        label="Twitter"
        name="twitter"
        value={profile?.socials?.twitter || ''}
        onSave={handleSubmit}
      />
      <EditItem
        label="Instagram"
        name="instagram"
        value={profile?.socials?.instagram || ''}
        onSave={handleSubmit}
      />
      <EditItem
        label="LinkedIn"
        name="linkedin"
        value={profile?.socials?.linkedin || ''}
        onSave={handleSubmit}
      />
      <EditItem
        label="GitHub"
        name="github"
        value={profile?.socials?.github || ''}
        onSave={handleSubmit}
      />
      <EditItem
        label="Website"
        name="website"
        value={profile?.socials?.website || ''}
        onSave={handleSubmit}
      />
    </Stack>
  );
};

const EditItem = ({
  label,
  name,
  value,
  onSave
}: {
  label: string;
  name: string;
  value: string;
  onSave: (name: string, value: string) => Promise<void>;
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [edit, setEdit] = useState(false);

  const form = useForm({
    initialValues: {
      [name]: name === 'birthdate' ? (null as Date | null) : ''
    },
    validate: {
      [name]: (value) => {
        if (!value) {
          return `${label} is required`;
        }
      }
    }
  });

  const isMd = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    if (edit) {
      form.setValues({
        [name]: value
      });
    }
  }, [edit]);

  const handleSubmit = async (values: any) => {
    try {
      setSubmitting(true);

      const updatedValue = values[name];
      await onSave(name, updatedValue);
    } finally {
      setSubmitting(false);
      setEdit(false);
    }
  };

  if (edit) {
    return (
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label={label}
            placeholder={`Enter your ${label.toLowerCase()}`}
            key={form.key(`${name}`)}
            {...form.getInputProps(`${name}`)}
          />

          <Group gap={6}>
            <Button variant="filled" type="submit" loading={submitting}>
              Save Changes
            </Button>
            <Button
              variant="default"
              disabled={submitting}
              onClick={() => setEdit(false)}
            >
              Cancel
            </Button>
          </Group>
        </Stack>
      </form>
    );
  }

  return (
    <Group justify="space-between">
      <Stack gap={0} flex={1}>
        <Text size={!isMd ? 'sm' : 'xs'} c="dimmed">
          {label}
        </Text>
        <Text size={!isMd ? 'md' : 'sm'}>{value || 'Not set yet'}</Text>
      </Stack>
      <Button variant="white" onClick={() => setEdit(true)}>
        Edit
      </Button>
    </Group>
  );
};

export default SocialsForm;
