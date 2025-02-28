import { useState } from 'react';
import {
  Anchor,
  Button,
  Group,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router';
import { useSetRecoilState } from 'recoil';

import states from '../../states';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../../graphql/mutations';

import AuthLayout from '../../layouts/auth';

const Login = () => {
  const [submitting, setSubmitting] = useState(false);

  const setAuth = useSetRecoilState(states.auth);

  const form = useForm({
    initialValues: {
      email: '',
      password: ''
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 6 ? 'Password is too short' : null)
    },
    validateInputOnBlur: true
  });

  const [login] = useMutation(LOGIN);

  const navigate = useNavigate();

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setSubmitting(true);

      const response = await login({
        variables: {
          email: values.email,
          password: values.password
        }
      });
      const key = Object.keys(response.data)[0];
      const data = response.data[key];

      if (data) {
        setAuth((prev: any) => ({
          ...prev,
          isAuth: true
        }));

        navigate('/');
      }
    } catch (error) {
      console.error('error', error);
      notifications.show({
        title: 'Login failed',
        message: 'Invalid email or password. Please try again.',
        color: 'red',
        position: 'top-center'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <Title order={1}>Hello there!</Title>
      <Text c="dimmed" mb="xl">
        Login and continue sharing your ideas to the world
      </Text>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Email"
            placeholder="Enter your email"
            key={form.key('email')}
            {...form.getInputProps('email')}
          />
          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            key={form.key('password')}
            {...form.getInputProps('password')}
          />
        </Stack>
        <Group justify="space-between" mt="xl">
          <Text size="sm">
            Don't have an account yet?{' '}
            <Anchor
              component="button"
              type="button"
              variant="light"
              size="sm"
              onClick={() => navigate('/sign-up')}
            >
              Sign Up
            </Anchor>
          </Text>

          <Button type="submit" loading={submitting}>
            Login
          </Button>
        </Group>
      </form>
    </AuthLayout>
  );
};

export default Login;
