import React from 'react';
import {
  Avatar,
  Box,
  Button,
  Center,
  FileButton,
  Group,
  Image,
  Stack,
  Text,
  UnstyledButton
} from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconPhoto, IconUser } from '@tabler/icons-react';
import { useRecoilState } from 'recoil';
import states from '../../../states';

const readFile = (file: any) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
};

const UploadProfilePhoto = () => {
  const [auth, setAuth] = useRecoilState(states.auth);
  const { onboarding } = auth;

  const handleAvatarChange = async (file: any) => {
    const avatarUrl = await readFile(file);

    setAuth((prev: any) => ({
      ...prev,
      onboarding: {
        ...prev.onboarding,
        uploadForm: {
          ...prev.onboarding.uploadForm,
          avatar: avatarUrl
        }
      }
    }));
  };

  const handleCoverChange = async (file: any) => {
    setAuth((prev: any) => ({
      ...prev,
      onboarding: {
        ...prev.onboarding,
        cover: file
      }
    }));
  };

  return (
    <Stack gap="xl" mt="xl">
      <Stack gap={6}>
        <Text>Upload Avatar</Text>
        <FileButton onChange={handleAvatarChange} accept="image/png,image/jpeg">
          {(props) => (
            <UnstyledButton {...props} className="upload-avatar">
              <Avatar
                src={onboarding.uploadForm.avatar}
                alt="upload-avatar"
                radius="md"
                color="initials"
                size={120}
              >
                <IconUser size={64} />
              </Avatar>
            </UnstyledButton>
          )}
        </FileButton>
      </Stack>

      <Stack gap={6}>
        <Text>Upload Cover Photo</Text>
        <FileButton onChange={handleAvatarChange} accept="image/png,image/jpeg">
          {(props) => (
            <UnstyledButton {...props} className="upload-avatar">
              <Box w="100%" h={200}></Box>
            </UnstyledButton>
          )}
        </FileButton>
      </Stack>
    </Stack>
  );
};

export default UploadProfilePhoto;
