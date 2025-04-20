import { FC, Fragment, useState } from 'react';
// @ts-ignore
import { Helmet } from 'react-helmet';
import { signInWithPopup } from 'firebase/auth';
import {
  Anchor,
  Button,
  Divider,
  Group,
  Image,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router';
import { useMutation } from '@apollo/client';
import { useSetRecoilState } from 'recoil';

import states from '../../states';
import { SIGN_UP } from '../../graphql/mutations';
import { auth, provider } from '../../../firebase.config';

import AuthLayout from '../../layouts/auth';
import google from '../../assets/Google.png';

const SignUp: FC = () => {
  const [submitting, setSubmitting] = useState(false);

  const setAuth = useSetRecoilState(states.auth);

  const form = useForm({
    initialValues: {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: ''
    },
    validate: {
      firstName: (value) =>
        value.length < 2 ? 'Firstname must have at least 2 letters' : null,
      lastName: (value) =>
        value.length < 2 ? 'Lastname must have at least 2 letters' : null,
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 6 ? 'Password is too short' : null),
      confirmPassword: (value, values) =>
        value !== values.password ? 'Passwords do not match' : null
    },
    mode: 'uncontrolled',
    validateInputOnBlur: true
  });

  const [signUp] = useMutation(SIGN_UP);

  const navigate = useNavigate();

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setSubmitting(true);

      const response = await signUp({
        variables: {
          signUpInput: {
            email: values.email,
            firstName: values.firstName,
            lastName: values.lastName,
            password: values.password,
            confirmPassword: values.confirmPassword
          }
        }
      });
      const key = Object.keys(response.data)[0];
      const data = response.data[key];

      if (data) {
        setAuth((prev: any) => ({
          ...prev,
          isAuth: true
        }));

        navigate('/onboarding');
      }
    } catch (error) {
      console.error('error', error);
      notifications.show({
        title: 'Error',
        message: 'An error occurred while creating the account.',
        color: 'red',
        position: 'top-center'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const displayName = user.displayName?.split(' ') as string[];
      let firstName = '';
      let lastName = '';

      if (displayName.length > 2) {
        firstName = displayName.slice(0, 2).join(' ');
        lastName = displayName[2];
      } else {
        firstName = displayName[0];
        lastName = displayName.slice(1).join(' ');
      }

      const response = await signUp({
      variables: {
          signUpInput: {
            email: user.email,
            firstName,
            lastName,
            password: '',
            confirmPassword: ''
          }
        }
      });

      const key = Object.keys(response.data)[0];
      const data = response.data[key];

      if (data) {
        setAuth((prev: any) => ({
          ...prev,
          isAuth: true
        }));

        navigate('/onboarding');
      }
    } catch (error) {
      console.error('error', error);
      notifications.show({
        title: 'Error',
        message: 'An error occurred while creating the account.',
        color: 'red',
        position: 'top-center'
      });
    }
  };

  return (
    <Fragment>
      <Helmet>
        <title>blog.io | Sign Up</title>
        <meta name="description" content="Sign up to your account" />
        <link rel="canonical" href="/sign-up" />
      </Helmet>
      <AuthLayout>
        <Title order={1}>Create your Account</Title>
        <Text c="dimmed" mb="xl">
          Fill-in your information and let's get started.
        </Text>
        <Stack>
          <Button
            variant="default"
            leftSection={<Image src={google} alt="google-icon" />}
            onClick={handleGoogleSignUp}
          >
            Sign with Google
          </Button>
          <Divider label="or" labelPosition="center" my="sm" />
        </Stack>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Firstname"
              placeholder="Enter your firstname"
              name="firstName"
              key={form.key('firstName')}
              {...form.getInputProps('firstName')}
            />
            <TextInput
              label="Lastname"
              placeholder="Enter your lastname"
              name="lastname"
              key={form.key('lastName')}
              {...form.getInputProps('lastName')}
            />
            <TextInput
              label="Email"
              placeholder="Enter your email"
              name="email"
              key={form.key('email')}
              {...form.getInputProps('email')}
            />
            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              name="password"
              key={form.key('password')}
              {...form.getInputProps('password')}
            />
            <PasswordInput
              label="Confirm Password"
              placeholder="Enter confirm password"
              name="confirmPassword"
              key={form.key('confirmPassword')}
              {...form.getInputProps('confirmPassword')}
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
                onClick={() => navigate('/login')}
              >
                Login
              </Anchor>
            </Text>

            <Button type="submit" loading={submitting}>
              Sign Up
            </Button>
          </Group>
        </form>
      </AuthLayout>
    </Fragment>
  );
};

export default SignUp;
