import React, { FC, Fragment, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  Box,
  Heading,
  VStack,
  Text,
  FormControl,
  Input,
  Button,
  IconButton,
  WarningOutlineIcon,
  Toast,
  Center,
} from 'native-base';
import { useMutation } from '@apollo/client';
import { useSetRecoilState } from 'recoil';

import { saveItem } from '../../utils/SecureStore.util';
import { SIGN_UP } from '../../mutations/user';
import states from '../../states';

import AuthLayout from '../../layout/auth-layout';

const SignUp: FC = () => {
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigation = useNavigation<any>();

  const setAuth = useSetRecoilState(states.auth);

  const [SignUp] = useMutation(SIGN_UP);

  const handleSubmit = async () => {
    if (Object.values(values).some(value => !value)) {
      return;
    }

    try {
      setLoading(true);

      const data = await SignUp({
        variables: {
          signUpInput: {
            email: values.email,
            username: values.username,
            password: values.password,
            confirmPassword: values.confirmPassword,
          },
        },
      });

      if (data) {
        const token = data?.data?.signUp?.token;

        if (token) {
          await saveItem('token', token);
          setAuth(prev => ({
            ...prev,
            isAuthenticated: true,
          }));
        }
      }
    } catch (error) {
      Toast.show({
        placement: 'top',
        backgroundColor: 'red.500',
        description:
          error.message ||
          'An error occured while creating your account. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Fragment>
        <VStack space={6}>
          <Box>
            <Heading size="2xl">Create your Account</Heading>
            <Text fontSize="lg" color="gray.500">
              Setup your account in few seconds.
            </Text>
          </Box>
          <FormControl>
            <VStack space={4}>
              <VStack>
                <FormControl.Label>Username</FormControl.Label>
                <Input
                  padding={4}
                  size="lg"
                  placeholder="Enter your username"
                  autoCapitalize="none"
                  value={values.username}
                  onChangeText={text =>
                    setValues({ ...values, username: text })
                  }
                />
              </VStack>
              <VStack>
                <FormControl.Label>Email</FormControl.Label>
                <Input
                  padding={4}
                  size="lg"
                  placeholder="Enter your email"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={values.email}
                  onChangeText={text => setValues({ ...values, email: text })}
                />
              </VStack>
              <VStack>
                <FormControl.Label>Password</FormControl.Label>
                <Input
                  padding={4}
                  size="lg"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={values.password}
                  onChangeText={text =>
                    setValues({ ...values, password: text })
                  }
                  rightElement={
                    <IconButton
                      size="lg"
                      variant="link"
                      icon={
                        <Ionicons
                          name={
                            showPassword ? 'eye-off-outline' : 'eye-outline'
                          }
                          size={18}
                        />
                      }
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  }
                />
              </VStack>
              <VStack>
                <FormControl.Label>Confirm Password</FormControl.Label>
                <Input
                  padding={4}
                  size="lg"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter confirm password"
                  value={values.confirmPassword}
                  onChangeText={text =>
                    setValues({ ...values, confirmPassword: text })
                  }
                  rightElement={
                    <IconButton
                      size="lg"
                      variant="link"
                      icon={
                        <Ionicons
                          name={
                            showConfirmPassword
                              ? 'eye-off-outline'
                              : 'eye-outline'
                          }
                          size={18}
                        />
                      }
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    />
                  }
                />
                {values.password !== values.confirmPassword && (
                  <FormControl.ErrorMessage
                    leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                    Passwords did not match.
                  </FormControl.ErrorMessage>
                )}
              </VStack>
              <Button
                size="lg"
                isLoading={loading}
                isLoadingText="Creating account..."
                onPress={handleSubmit}
              >
                Create Account
              </Button>
              <VStack space={2} marginTop={8}>
                <Text textAlign="center" fontSize="sm" color="gray.500">
                  Already have an account?
                </Text>
                <Center>
                  <Button
                    size="lg"
                    variant="link"
                    onPress={() => navigation.navigate('Login')}
                  >
                    Login
                  </Button>
                </Center>
              </VStack>
            </VStack>
          </FormControl>
        </VStack>
      </Fragment>
    </AuthLayout>
  );
};

export default SignUp;
