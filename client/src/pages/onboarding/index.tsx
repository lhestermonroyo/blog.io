import { useState } from 'react';
import {
  Box,
  Container,
  Group,
  Stack,
  Stepper,
  Text,
  Title
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router';

import { useMutation } from '@apollo/client';
import { UPDATE_PROFILE } from '../../graphql/mutations';
import { useRecoilState } from 'recoil';

import states from '../../states';
import { uploadProfile } from '../../utils/upload.util';

import Logo from '../../components/logo';
import StepOne from '../../components/onboarding/step-one';
import StepTwo from '../../components/onboarding/step-two';
import StepThree from '../../components/onboarding/step-three';
import Review from '../../components/onboarding/review';

const Onboarding = () => {
  const [active, setActive] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [auth, setAuth] = useRecoilState(states.auth);
  const { profile, onboarding } = auth;

  const navigate = useNavigate();

  const [updateProfile] = useMutation(UPDATE_PROFILE);

  const nextStep = () => {
    setActive((current) => (current < 3 ? current + 1 : current));
    window.scrollTo(0, 0);
  };
  const prevStep = () => {
    setActive((current) => (current > 0 ? current - 1 : current));
    window.scrollTo(0, 0);
  };

  const handleSave = async () => {
    try {
      setSubmitting(true);

      const { profileInfoForm, uploadForm, tagsForm } = onboarding;

      const [avatarUrl, coverUrl] = await Promise.all([
        uploadProfile('avatar', uploadForm.avatar, profile?.email),
        uploadProfile('cover', uploadForm.cover, profile?.email)
      ]);

      const response = await updateProfile({
        variables: {
          profileInput: {
            firstName: profileInfoForm.firstName,
            lastName: profileInfoForm.lastName,
            birthdate: profileInfoForm.birthdate,
            location: profileInfoForm.location,
            pronouns: profileInfoForm.pronouns,
            bio: profileInfoForm.bio,
            avatar: avatarUrl,
            coverPhoto: coverUrl,
            tags: [...tagsForm]
          }
        }
      });
      const key = Object.keys(response.data)[0];
      const data = response.data[key];

      if (data) {
        setAuth((prev: any) => ({
          ...prev,
          profile: data,
          onboarding: {
            profileInfoForm: null,
            uploadForm: {
              avatar: null,
              cover: null
            },
            tagsForm: []
          }
        }));
        notifications.show({
          title: 'Success',
          message: 'You have successfully completed your onboarding.',
          color: 'green',
          position: 'top-center'
        });

        navigate(`/`);
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'An error occurred while saving your onboarding data.',
        color: 'red',
        position: 'top-center'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container size="sm" pt={40} pb={120}>
      <Stack gap="xl">
        <Group>
          <Logo />
        </Group>
        <Box>
          <Title order={1}>Profile Setup</Title>
          <Text c="dimmed">We would like to know you first.</Text>
        </Box>
        <Stepper active={active}>
          <Stepper.Step label="First step" description="Profile Info">
            <StepOne onNextStep={nextStep} />
          </Stepper.Step>
          <Stepper.Step label="Second step" description="Avatar & Cover Photo">
            <StepTwo onPrevStep={prevStep} onNextStep={nextStep} />
          </Stepper.Step>
          <Stepper.Step label="Final step" description="Tags & Interests">
            <StepThree onPrevStep={prevStep} onNextStep={nextStep} />
          </Stepper.Step>
          <Stepper.Completed>
            <Review
              submitting={submitting}
              onNavigateStep={(step) => setActive(step)}
              onPrevStep={prevStep}
              onSave={handleSave}
            />
          </Stepper.Completed>
        </Stepper>
      </Stack>
    </Container>
  );
};

export default Onboarding;
