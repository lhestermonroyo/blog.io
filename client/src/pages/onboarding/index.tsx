import { Fragment, useEffect, useState } from 'react';
// @ts-ignore
import { Helmet } from 'react-helmet';
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
import { TAuthState } from '../../../types';

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

  useEffect(() => {
    if (profile?.tags.length) {
      navigate('/');
    }
  }, [profile?.tags]);

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
      const email = profile?.email as string;

      const [avatarUrl, coverUrl] = await Promise.all([
        uploadProfile('avatar', uploadForm.avatar, email),
        uploadProfile('cover', uploadForm.coverPhoto, email)
      ]);

      const response = await updateProfile({
        variables: {
          profileInput: {
            firstName: profileInfoForm.firstName,
            lastName: profileInfoForm.lastName,
            pronouns: profileInfoForm.pronouns,
            title: profileInfoForm.title,
            location: profileInfoForm.location,
            birthdate: profileInfoForm.birthdate,
            bio: profileInfoForm.bio,
            socials: {
              facebook: profileInfoForm.facebook,
              twitter: profileInfoForm.twitter,
              instagram: profileInfoForm.instagram,
              linkedin: profileInfoForm.linkedin,
              github: profileInfoForm.github,
              website: profileInfoForm.website
            },
            tags: [...tagsForm],
            avatar: avatarUrl,
            coverPhoto: coverUrl
          }
        }
      });
      const key = Object.keys(response.data)[0];
      const data = response.data[key];

      if (data) {
        setAuth((prev: TAuthState) => ({
          ...prev,
          profile: data,
          onboarding: {
            profileInfoForm: {
              email: '',
              firstName: '',
              lastName: '',
              pronouns: '',
              title: '',
              location: '',
              birthdate: null,
              bio: '',
              facebook: '',
              twitter: '',
              instagram: '',
              linkedin: '',
              github: '',
              website: ''
            },
            uploadForm: {
              avatar: null,
              coverPhoto: null
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
    <Fragment>
      <Helmet>
        <title>blog.io | Profile Setup</title>
        <meta
          name="description"
          content="Complete your profile setup to get the most out of our platform."
        />
        <link rel="canonical" href="/onboarding" />
      </Helmet>
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
            <Stepper.Step
              label="Second step"
              description="Avatar & Cover Photo"
            >
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
    </Fragment>
  );
};

export default Onboarding;
