import { Fragment, useState } from 'react';
import { Button, Group, Stack, Text, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMediaQuery } from '@mantine/hooks';
import { useRecoilState } from 'recoil';
import { useMutation } from '@apollo/client';

import { uploadProfile } from '../../../utils/upload.util';
import { UPDATE_PROFILE } from '../../../graphql/mutations';
import states from '../../../states';
import { TAuthState } from '../../../../types';

import UploadAvatar from '../../upload-avatar';
import UploadCover from '../../upload-cover';

const AvatarCoverForm = () => {
  const [submittingAvatar, setSubmittingAvatar] = useState(false);
  const [submittingCoverPhoto, setSubmittingCoverPhoto] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);

  const [auth, setAuth] = useRecoilState(states.auth);
  const { profile } = auth;

  const isMd = useMediaQuery('(max-width: 768px)');

  const [updateProfile] = useMutation(UPDATE_PROFILE);

  const saveUpload = async (name: 'avatar' | 'coverPhoto', value: string) => {
    const currProfile = Object.assign({}, profile) as any;
    const currSocials = Object.assign({}, profile?.socials) as any;

    delete currProfile?.__typename;
    delete currProfile?.id;
    delete currProfile?.email;
    delete currProfile?.age;
    delete currProfile?.createdAt;
    delete currSocials?.__typename;

    const response = await updateProfile({
      variables: {
        profileInput: {
          ...currProfile,
          socials: {
            ...currSocials
          },
          [name]: value
        }
      }
    });
    const key = Object.keys(response.data)[0];
    return response.data[key];
  };

  const handleUploadAvatar = async () => {
    try {
      if (!avatar) return;

      setSubmittingAvatar(true);

      // await deleteProfile(profile?.avatar as string);
      const avatarUrl = (await uploadProfile(
        'avatar',
        avatar,
        profile?.email as string
      )) as string;
      const data = await saveUpload('avatar', avatarUrl);

      if (data) {
        setAuth((prev: TAuthState) => ({
          ...prev,
          profile: data
        }));
        setAvatar(null);

        notifications.show({
          title: 'Success',
          message: 'You have successfully changed your avatar.',
          color: 'green',
          position: 'top-center'
        });
      }
    } catch (error) {
      console.log('Error uploading avatar:', error);
      notifications.show({
        title: 'Error',
        message: 'An error occurred while updating your avatar.',
        color: 'red',
        position: 'top-center'
      });
    } finally {
      setSubmittingAvatar(false);
    }
  };

  const handleUploadCoverPhoto = async () => {
    try {
      if (!coverPhoto) return;

      setSubmittingCoverPhoto(true);

      // await deleteProfile(profile?.avatar as string);
      const coverUrl = (await uploadProfile(
        'cover',
        coverPhoto,
        profile?.email as string
      )) as string;
      const data = await saveUpload('coverPhoto', coverUrl);

      if (data) {
        setAuth((prev: TAuthState) => ({
          ...prev,
          profile: data
        }));
        setCoverPhoto(null);

        notifications.show({
          title: 'Success',
          message: 'You have successfully changed your cover photo.',
          color: 'green',
          position: 'top-center'
        });
      }
    } catch (error) {
      console.log('Error uploading avatar:', error);
      notifications.show({
        title: 'Error',
        message: 'An error occurred while updating your cover photo.',
        color: 'red',
        position: 'top-center'
      });
    } finally {
      setSubmittingCoverPhoto(false);
    }
  };

  return (
    <Fragment>
      <Stack gap="lg" px={!isMd ? 'xl' : 'sm'} mt={!isMd ? 0 : 'md'}>
        <Title order={3}>Avatar & Cover Photo</Title>
        <Stack gap={6}>
          <Text>Upload Avatar</Text>
          <Group>
            <UploadAvatar
              avatarUri={avatar || (profile?.avatar as string)}
              onSelect={(base64Str: string) => setAvatar(base64Str)}
            />
            {avatar && (
              <Stack gap={6}>
                <Button loading={submittingAvatar} onClick={handleUploadAvatar}>
                  Save Changes
                </Button>
                <Button
                  variant="default"
                  disabled={submittingAvatar}
                  onClick={() => setAvatar(null)}
                >
                  Cancel
                </Button>
              </Stack>
            )}
          </Group>
        </Stack>

        <Stack gap={6}>
          <Text>Upload Cover Photo</Text>
          <Stack>
            <UploadCover
              coverUri={coverPhoto || (profile?.coverPhoto as string)}
              onSelect={(base64Str: string) => setCoverPhoto(base64Str)}
            />
            {coverPhoto && (
              <Group gap={6} justify="center">
                <Button
                  loading={submittingCoverPhoto}
                  onClick={handleUploadCoverPhoto}
                >
                  Save Changes
                </Button>
                <Button
                  variant="default"
                  disabled={submittingCoverPhoto}
                  onClick={() => setCoverPhoto(null)}
                >
                  Cancel
                </Button>
              </Group>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Fragment>
  );
};

export default AvatarCoverForm;
