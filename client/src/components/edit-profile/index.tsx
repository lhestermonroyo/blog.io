import React, { FC, useEffect, useState } from 'react';
import {
  Actionsheet,
  Box,
  Button,
  FormControl,
  HStack,
  Heading,
  Input,
  ScrollView,
  Toast,
  VStack,
} from 'native-base';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { useMutation } from '@apollo/client';
import { useRecoilState } from 'recoil';

import states from '../../states';
import { UPDATE_PROFILE } from '../../mutations/user';

interface IEditProfileProps {
  isOpen: boolean;
  close: () => void;
}

const EditProfile: FC<IEditProfileProps> = ({ isOpen = false, close }) => {
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    name: '',
    location: '',
    birthdate: new Date(),
  });

  const [auth, setAuth] = useRecoilState(states.auth);

  const [UpdateProfile] = useMutation(UPDATE_PROFILE);

  useEffect(() => {
    if (auth.user) {
      setValues({
        name: auth.user.name,
        location: auth.user.location,
        birthdate: new Date(auth.user.birthdate),
      });
    }
  }, [auth.user]);

  const handleSubmit = async () => {
    if (
      auth.user.name === values.name &&
      auth.user.location === values.location &&
      auth.user.birthdate === values.birthdate
    ) {
      return Toast.show({
        placement: 'top',
        color: 'blue.500',
        description: 'Please make changes to update profile.',
      });
    }

    try {
      setLoading(true);

      const profileInput = {
        name: values.name,
        location: values.location,
        birthdate: values.birthdate.toISOString(),
      };

      const data = await UpdateProfile({
        variables: {
          profileInput,
        },
      });

      if (data) {
        const updatedUser = data?.data?.updateProfile;

        if (updatedUser) {
          setAuth(prev => ({
            ...prev,
            user: updatedUser,
          }));

          close();
          Toast.show({
            placement: 'top',
            backgroundColor: 'green.500',
            description: 'Profile has been updated.',
          });
        }
      }
    } catch (error) {
      Toast.show({
        placement: 'top',
        backgroundColor: 'red.500',
        description:
          error.message || 'An error occurred while updating profile.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Actionsheet isOpen={isOpen} onClose={close} disableOverlay size="full">
      <Actionsheet.Content>
        <Box width="100%" height="full">
          <Box paddingX={2} paddingBottom={4} width="100%">
            <Heading size="xl" textAlign="left">
              Edit Profile
            </Heading>
          </Box>
          <ScrollView paddingX={2} width="100%">
            <FormControl isRequired>
              <VStack space={4}>
                <VStack>
                  <FormControl.Label>Name</FormControl.Label>
                  <Input
                    padding={4}
                    size="lg"
                    type="text"
                    placeholder="Enter your name"
                    autoCorrect={false}
                    autoCapitalize="none"
                    value={values.name}
                    onChangeText={text => setValues({ ...values, name: text })}
                  />
                </VStack>
                <VStack>
                  <FormControl.Label>Location</FormControl.Label>
                  <Input
                    padding={4}
                    size="lg"
                    type="text"
                    placeholder="Enter your location"
                    autoCorrect={false}
                    autoCapitalize="none"
                    value={values.location}
                    onChangeText={text =>
                      setValues({ ...values, location: text })
                    }
                  />
                </VStack>
                <HStack alignItems="center">
                  <FormControl.Label>Birthdate</FormControl.Label>
                  <RNDateTimePicker
                    value={values.birthdate}
                    onChange={(_, selectedDate) =>
                      setValues({ ...values, birthdate: selectedDate })
                    }
                    maximumDate={new Date()}
                    accentColor="#0891b2"
                    style={{ flex: 1, height: 70 }}
                  />
                </HStack>
                <Button
                  size="lg"
                  isLoading={loading}
                  isLoadingText="Saving changes..."
                  onPress={handleSubmit}
                >
                  Save Changes
                </Button>
              </VStack>
            </FormControl>
          </ScrollView>
        </Box>
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export default EditProfile;
