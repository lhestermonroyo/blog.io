import { FC, Fragment } from 'react';
import { Button, Group, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useRecoilState } from 'recoil';

import states from '../../../states';

import UploadAvatar from '../../upload-avatar';
import UploadCover from '../../upload-cover';
interface StepTwoProps {
  onNextStep: () => void;
  onPrevStep: () => void;
}

const StepTwo: FC<StepTwoProps> = ({ onNextStep, onPrevStep }) => {
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

  const handleSubmit = async () => {
    if (!onboarding.uploadForm.avatar || !onboarding.uploadForm.cover) {
      notifications.show({
        title: 'Validation Error',
        message: 'Please upload avatar and cover photo first.',
        color: 'red',
        position: 'top-center'
      });
      return;
    }

    onNextStep();
  };

  return (
    <Fragment>
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
      <Group gap={6} mt="lg">
        <Button variant="default" onClick={onPrevStep}>
          Back
        </Button>
        <Button onClick={handleSubmit}>Next</Button>
      </Group>
    </Fragment>
  );
};

export default StepTwo;
