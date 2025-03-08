import React from 'react';
import { Box, FileButton, Stack, Text, UnstyledButton } from '@mantine/core';
import { useRecoilState } from 'recoil';
import states from '../../../states';
import UploadAvatar from '../../upload-avatar';
import UploadCover from '../../upload-cover';

const StepTwo = () => {
  const [auth, setAuth] = useRecoilState(states.auth);
  const { onboarding } = auth;

  const handleSelectAvatar = async (base64Str: string) => {
    setAuth((prev: any) => ({
      ...prev,
      onboarding: {
        ...prev.onboarding,
        uploadForm: {
          ...prev.onboarding.uploadForm,
          avatar: base64Str
        }
      }
    }));
  };

  const handleSelectCover = async (base64Str: any) => {
    setAuth((prev: any) => ({
      ...prev,
      onboarding: {
        ...prev.onboarding,
        uploadForm: {
          ...prev.onboarding.uploadForm,
          cover: base64Str
        }
      }
    }));
  };

  return (
    <Stack gap="xl" mt="xl">
      <Stack gap={6}>
        <Text>Upload Avatar</Text>
        <UploadAvatar
          avatarUri={onboarding.uploadForm.avatar}
          onSelect={handleSelectAvatar}
        />
      </Stack>

      <Stack gap={6}>
        <Text>Upload Cover Photo</Text>
        <UploadCover
          coverUri={onboarding.uploadForm.cover}
          onSelect={handleSelectCover}
        />
      </Stack>
    </Stack>
  );
};

export default StepTwo;
