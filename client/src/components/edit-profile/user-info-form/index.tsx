import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
  Button,
  Group,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { useForm } from '@mantine/form';
import { useMutation } from '@apollo/client';
import { useRecoilState } from 'recoil';

import states from '../../../states';

import { UPDATE_PROFILE } from '../../../graphql/mutations';

const UserInfoForm = () => {
  const [auth, setAuth] = useRecoilState(states.auth);
  const { profile } = auth;

  const [updateProfile] = useMutation(UPDATE_PROFILE);

  const handleSubmit = async (name: string, value: string) => {
    try {
      const currProfile = Object.assign({}, profile) as any;

      delete currProfile?.__typename;
      delete currProfile?.id;
      delete currProfile?.email;
      delete currProfile?.age;
      delete currProfile?.createdAt;

      const response = await updateProfile({
        variables: {
          profileInput: {
            ...currProfile,
            [name]: value,
            socials: {
              facebook: currProfile?.socials?.facebook || '',
              twitter: currProfile?.socials?.twitter || '',
              instagram: currProfile?.socials?.instagram || '',
              linkedin: currProfile?.socials?.linkedin || '',
              github: currProfile?.socials?.github || '',
              website: currProfile?.socials?.website || ''
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
        message: 'Profile updated successfully.',
        color: 'green',
        position: 'top-center'
      });
    } catch (error) {
      console.log('error', error);
      notifications.show({
        title: 'Error',
        message: 'An error occurred while updating your profile.',
        color: 'red',
        position: 'top-center'
      });
    }
  };

  return (
    <Stack gap="lg" px="xl">
      <Title order={2}>User Information</Title>
      <EditItem
        label="Firstname"
        name="firstName"
        value={profile?.firstName || ''}
        onSave={handleSubmit}
      />
      <EditItem
        label="Lastname"
        name="lastName"
        value={profile?.lastName || ''}
        onSave={handleSubmit}
      />
      <EditItem
        label="Pronouns"
        name="pronouns"
        value={profile?.pronouns || ''}
        onSave={handleSubmit}
      />
      <EditItem
        label="Title"
        name="title"
        value={profile?.title || ''}
        onSave={handleSubmit}
      />
      <EditItem
        label="Location"
        name="location"
        value={profile?.location || ''}
        onSave={handleSubmit}
      />
      <EditItem
        label="Birthdate"
        name="birthdate"
        value={
          format(new Date(profile?.birthdate as string), 'MMMM dd, yyyy') || ''
        }
        onSave={handleSubmit}
      />
      <EditItem
        label="Bio"
        name="bio"
        value={profile?.bio || ''}
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

  useEffect(() => {
    if (edit) {
      if (name === 'birthdate') {
        form.setValues({
          [name]: value ? new Date(value) : null
        });
      } else {
        form.setValues({
          [name]: value
        });
      }
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
          {name === 'birthdate' ? (
            <DateInput
              label={label}
              placeholder={`Enter your ${label.toLowerCase()}`}
              key={form.key(`${name}`)}
              {...form.getInputProps(`${name}`)}
            />
          ) : name === 'pronouns' ? (
            <Select
              label={label}
              placeholder={`Enter your ${label.toLowerCase()}`}
              data={['He/Him', 'She/Her', 'They/Them']}
              key={form.key(`${name}`)}
              {...form.getInputProps(`${name}`)}
            />
          ) : name === 'bio' ? (
            <Textarea
              label={label}
              placeholder={`Enter your ${label.toLowerCase()}`}
              key={form.key(`${name}`)}
              {...form.getInputProps(`${name}`)}
            />
          ) : (
            <TextInput
              label={label}
              placeholder={`Enter your ${label.toLowerCase()}`}
              key={form.key(`${name}`)}
              {...form.getInputProps(`${name}`)}
            />
          )}

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
    <Group justify="space-between" gap={6}>
      <Stack gap={0} maw={520}>
        <Text size="sm" c="dimmed">
          {label}
        </Text>
        <Text>{value || 'Not set yet'}</Text>
      </Stack>
      <Button variant="white" onClick={() => setEdit(true)}>
        Edit
      </Button>
    </Group>
  );
};

export default UserInfoForm;
