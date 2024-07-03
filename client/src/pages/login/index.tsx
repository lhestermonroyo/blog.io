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
  Toast,
  Center,
} from 'native-base';
import { useMutation } from '@apollo/client';
import { useSetRecoilState } from 'recoil';

import states from '../../states';
import { saveItem } from '../../utils/SecureStore.util';
import { LOGIN } from '../../mutations/user';

import AuthLayout from '../../layout/auth-layout';

const Login: FC = () => {
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const setAuth = useSetRecoilState(states.auth);

  const navigation = useNavigation<any>();

  const [Login] = useMutation(LOGIN);

  const handleSubmit = async () => {
    if (!values.username || !values.password) {
      return;
    }

    try {
      setLoading(true);

      const data = await Login({
        variables: {
          username: values.username,
          password: values.password,
        },
      });

      if (data) {
        const token = data?.data?.login?.token;

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
        description: 'Username or password is incorrect. Please try again.',
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
            <Heading size="2xl">Welcome</Heading>
            <Text fontSize="lg" color="gray.500">
              Sign in to continue.
            </Text>
          </Box>
          <FormControl>
            <VStack space={4}>
              <VStack>
                <FormControl.Label>Username</FormControl.Label>
                <Input
                  padding={4}
                  size="lg"
                  type="text"
                  placeholder="Enter your username"
                  autoCorrect={false}
                  autoCapitalize="none"
                  value={values.username}
                  onChangeText={text =>
                    setValues({ ...values, username: text })
                  }
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
                          size={20}
                        />
                      }
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  }
                />
              </VStack>
              <Button
                size="lg"
                isLoading={loading}
                isLoadingText="Logging in..."
                onPress={handleSubmit}
              >
                Login
              </Button>
              <VStack space={2} marginTop={8}>
                <Text textAlign="center" fontSize="sm" color="gray.500">
                  Don't have an account?
                </Text>
                <Center>
                  <Button
                    size="lg"
                    variant="link"
                    onPress={() => navigation.navigate('Sign Up')}
                  >
                    Create your Account
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

export default Login;
