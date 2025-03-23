import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Button,
  Group,
  PasswordInput,
  Stack,
  TextInput,
  Title
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@apollo/client';
import { useRecoilState } from 'recoil';

import states from '../../../states';
import { CHANGE_PASSWORD } from '../../../graphql/mutations';

import { TAuthState } from '../../../../types';

const AccountSettingsForm = () => {
  const [submitting, setSubmitting] = useState(false);

  const [auth, setAuth] = useRecoilState(states.auth);

  const form = useForm({
    initialValues: {
      email: '',
      currPassword: '',
      newPassword: ''
    },
    validate: {
      currPassword: (value) => value.length < 6 && 'Password is too short',
      newPassword: (value) => {
        if (value.length < 6) {
          return 'Password is too short';
        } else if (value === form.getValues().currPassword) {
          return 'New password must be different from the current password';
        }
      }
    },
    mode: 'uncontrolled',
    validateInputOnBlur: true
  });

  const [changePassword] = useMutation(CHANGE_PASSWORD);
  const navigate = useNavigate();

  useEffect(() => {
    form.setValues({
      email: auth.profile?.email || ''
    });
  }, []);

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setSubmitting(true);

      const response = await changePassword({
        variables: {
          oldPassword: values.currPassword,
          newPassword: values.newPassword
        }
      });
      const key = Object.keys(response.data)[0];
      const data = response.data[key];

      if (data && data.success) {
        setAuth((prev: TAuthState) => ({
          ...prev,
          isAuth: false,
          profile: null,
          stats: {
            posts: {
              count: 0,
              list: []
            },
            savedPosts: {
              count: 0,
              list: []
            },
            followers: {
              count: 0,
              list: []
            },
            following: {
              count: 0,
              list: []
            }
          },
          onboarding: {
            profileInfoForm: {
              email: '',
              firstName: '',
              lastName: '',
              pronouns: '',
              title: '',
              location: '',
              birthdate: null as Date | null,
              bio: '',
              facebook: '',
              twitter: '',
              instagram: '',
              linkedin: '',
              github: '',
              website: ''
            },
            uploadForm: {
              avatar: null,
              coverPhoto: null
            },
            tagsForm: []
          }
        }));
        notifications.show({
          title: 'Success',
          message:
            'Password changed successfully. Please login using your new password.',
          color: 'green',
          position: 'top-center'
        });
        navigate('/login');
      }
    } catch (error: any) {
      const errorMessage =
        error.graphQLErrors?.[0]?.message ||
        'An error occurred while changing your password.';

      console.log('error', errorMessage);

      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
        position: 'top-center'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Stack gap="lg" px="xl">
      <Title order={2}>Account Settings</Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            disabled
            label="Email"
            description="Email cannot be changed."
            placeholder="Enter your email"
            key={form.key('email')}
            {...form.getInputProps('email')}
          />
          <PasswordInput
            label="Current Password"
            placeholder="Enter your current password"
            name="currPassword"
            key={form.key('currPassword')}
            {...form.getInputProps('currPassword')}
          />
          <PasswordInput
            label="New Password"
            placeholder="Enter new password"
            name="newPassword"
            key={form.key('newPassword')}
            {...form.getInputProps('newPassword')}
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

export default AccountSettingsForm;
