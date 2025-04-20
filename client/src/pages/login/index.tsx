import { Fragment, useState } from 'react';
// @ts-ignore
import { Helmet } from 'react-helmet';
import { signInWithPopup } from 'firebase/auth';
import {
  Anchor,
  Button,
  Group,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
  Image,
  Divider
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useForm } from '@mantine/form';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router';
import { useSetRecoilState } from 'recoil';

import { auth, provider } from '../../../firebase.config';
import states from '../../states';
import { LOGIN_WITH_GOOGLE, LOGIN } from '../../graphql/mutations';

import AuthLayout from '../../layouts/auth';

import google from '../../assets/Google.png';

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
  const [loginWithGoogle] = useMutation(LOGIN_WITH_GOOGLE);

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
        title: 'Error',
        message: 'Invalid email or password. Please try again.',
        color: 'red',
        position: 'top-center'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      if (result) {
        setSubmitting(true);

        const idToken = await result.user.getIdToken();
        const response = await loginWithGoogle({
          variables: {
            idToken
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
      }
    } catch (error) {
      console.error('error', error);
      notifications.show({
        title: 'Error',
        message: 'Invalid email or password. Please try again.',
        color: 'red',
        position: 'top-center'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Fragment>
      <Helmet>
        <title>blog.io | Login</title>
        <meta name="description" content="Login to your account" />
        <link rel="canonical" href="/login" />
      </Helmet>
      <AuthLayout>
        <Title order={1}>Hello there!</Title>
        <Text c="dimmed" mb="xl">
          Login and continue sharing your ideas to the world
        </Text>
        <Stack>
          <Button
            variant="default"
            leftSection={<Image src={google} alt="google-icon" />}
            loading={submitting}
            onClick={handleGoogleLogin}
          >
            Login with Google
          </Button>
          <Divider label="or" labelPosition="center" my="sm" />
        </Stack>
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
    </Fragment>
  );
};

export default Login;
