import React, { FC, Fragment, useState } from 'react';
import {
  Box,
  Button,
  HStack,
  Heading,
  IconButton,
  Text,
  VStack,
} from 'native-base';
import { useRecoilValue } from 'recoil';
import { Ionicons } from '@expo/vector-icons';
import { formatDate } from 'date-fns';

import states from '../../states';

import PrivateLayout from '../../layout/private-layout';
import ProfilePhoto from '../../components/profile-photo';
import CoverPhoto from '../../components/cover-photo';
import EditProfile from '../../components/edit-profile';

const Profile: FC = () => {
  const [openEdit, setOpenEdit] = useState(false);

  const { user } = useRecoilValue(states.auth);

  return (
    <Fragment>
      <EditProfile isOpen={openEdit} close={() => setOpenEdit(false)} />

      <PrivateLayout>
        <Box>
          <CoverPhoto uri={user?.coverPhoto} />
          <HStack marginTop={-16} margin={4}>
            <VStack flex={1} space={4}>
              <ProfilePhoto
                uri={user?.profilePhoto}
                initials={user?.username[0]}
                size="xl"
              />
              <VStack>
                <Heading size="lg">{user?.username}</Heading>
                <Text color="gray.500" fontSize="md">
                  {user?.email}
                </Text>
              </VStack>
            </VStack>
            <VStack marginTop={24}>
              <HStack>
                <Button variant="outline" onPress={() => setOpenEdit(true)}>
                  Edit
                </Button>
                <IconButton
                  size="lg"
                  variant="unstyled"
                  icon={
                    <Ionicons
                      name="settings-outline"
                      size={20}
                      color="#0891b2"
                    />
                  }
                />
              </HStack>
            </VStack>
          </HStack>
          <HStack>
            <VStack flex={1}>
              <Heading color="primary.600" textAlign="center" size="lg">
                {user?.karma}
              </Heading>
              <Text textAlign="center" color="gray.500" fontSize="md">
                Karma Points
              </Text>
            </VStack>
            <VStack flex={1}>
              <Heading color="primary.600" textAlign="center" size="lg">
                {user?.karma}
              </Heading>
              <Text textAlign="center" color="gray.500" fontSize="md">
                Posts
              </Text>
            </VStack>
            <VStack flex={1}>
              <Heading color="primary.600" textAlign="center" size="lg">
                {user?.karma}
              </Heading>
              <Text textAlign="center" color="gray.500" fontSize="md">
                Bookmarks
              </Text>
            </VStack>
          </HStack>
          <VStack space={4} padding={4}>
            <Heading size="lg">About</Heading>
            <VStack>
              <Text fontSize="lg">{user?.name}</Text>
              <Text color="gray.500">Name</Text>
            </VStack>
            <VStack>
              <Text fontSize="lg">{user?.location}</Text>
              <Text color="gray.500">Location</Text>
            </VStack>
            <VStack>
              <Text fontSize="lg">
                {formatDate(user?.birthdate, 'MMMM dd, yyyy')}
              </Text>
              <Text color="gray.500">Birthdate</Text>
            </VStack>
            <VStack>
              <Text fontSize="lg">{user?.age} years old</Text>
              <Text color="gray.500">Age</Text>
            </VStack>
          </VStack>
        </Box>
      </PrivateLayout>
    </Fragment>
  );
};

export default Profile;
