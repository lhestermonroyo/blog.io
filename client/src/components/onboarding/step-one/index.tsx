import { FC, useEffect } from 'react';
import {
  Button,
  Divider,
  Group,
  Select,
  Stack,
  Textarea,
  TextInput,
  Title
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useRecoilState } from 'recoil';

import states from '../../../states';
import { TAuthState } from '../../../../types';

type StepOneProps = {
  onNextStep: () => void;
};

const StepOne: FC<StepOneProps> = ({ onNextStep }) => {
  const [auth, setAuth] = useRecoilState(states.auth);
  const { profile, onboarding } = auth;

  const form = useForm({
    initialValues: {
      email: '',
      firstName: '',
      lastName: '',
      pronouns: '',
      title: '',
      location: '',
      birthdate: null as Date | null,
      bio: '',
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
      github: '',
      website: ''
    },
    validate: {
      firstName: (value) => (value ? null : 'First name is required'),
      lastName: (value) => (value ? null : 'Last name is required')
    }
  });

  useEffect(() => {
    if (profile) {
      const formData = onboarding.profileInfoForm;

      form.setValues({
        email: formData?.email || profile?.email,
        firstName: formData?.firstName || profile?.firstName,
        lastName: formData?.lastName || profile?.lastName,
        birthdate: formData?.birthdate
          ? new Date(formData.birthdate)
          : profile?.birthdate
          ? new Date(profile.birthdate)
          : null,
        location: formData?.location || profile?.location,
        pronouns: formData?.pronouns || profile?.pronouns,
        bio: formData?.bio || profile?.bio,
        facebook: formData?.facebook || profile?.socials.facebook,
        twitter: formData?.twitter || profile?.socials.twitter,
        instagram: formData?.instagram || profile?.socials.instagram,
        linkedin: formData?.linkedin || profile?.socials.linkedin,
        github: formData?.github || profile?.socials.github,
        website: formData?.website || profile?.socials.website
      });
    }
  }, [profile]);

  const handleSubmit = (values: typeof form.values) => {
    setAuth((prev: TAuthState) => ({
      ...prev,
      onboarding: {
        ...prev.onboarding,
        profileInfoForm: values
      }
    }));
    onNextStep();
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput
          label="Email"
          description="Your email cannot be changed"
          type="email"
          placeholder="Enter your email"
          disabled
          key={form.key('email')}
          {...form.getInputProps('email')}
        />
        <TextInput
          label="Firstname"
          placeholder="Enter your firstname"
          key={form.key('firstName')}
          {...form.getInputProps('firstName')}
        />
        <TextInput
          label="Lastname"
          placeholder="Enter your lastname"
          key={form.key('lastName')}
          {...form.getInputProps('lastName')}
        />
        <Select
          label="Pronouns"
          placeholder="Select your pronouns"
          data={['He/Him', 'She/Her', 'They/Them']}
          key={form.key('pronouns')}
          {...form.getInputProps('pronouns')}
        />
        <TextInput
          label="Title"
          placeholder="Enter your title (e.g. Software Engineer)"
          key={form.key('title')}
          {...form.getInputProps('title')}
        />
        <TextInput
          label="Location"
          placeholder="Enter your location"
          key={form.key('location')}
          {...form.getInputProps('location')}
        />
        <DateInput
          label="Birthdate"
          placeholder="Enter your birthdate"
          key={form.key('birthdate')}
          {...form.getInputProps('birthdate')}
        />

        <Textarea
          label="Bio"
          placeholder="Enter your bio"
          key={form.key('bio')}
          {...form.getInputProps('bio')}
        />

        <Divider
          label={
            <Title c="dark" order={3}>
              Socials
            </Title>
          }
          labelPosition="left"
        />
        <TextInput
          label="Facebook"
          placeholder="Enter your facebook link"
          key={form.key('facebook')}
          {...form.getInputProps('facebook')}
        />
        <TextInput
          label="Twitter"
          placeholder="Enter your twitter link"
          key={form.key('twitter')}
          {...form.getInputProps('twitter')}
        />
        <TextInput
          label="Instagram"
          placeholder="Enter your instagram link"
          key={form.key('instagram')}
          {...form.getInputProps('instagram')}
        />
        <TextInput
          label="LinkedIn"
          placeholder="Enter your linkedin link"
          key={form.key('linkedin')}
          {...form.getInputProps('linkedin')}
        />
        <TextInput
          label="GitHub"
          placeholder="Enter your github link"
          key={form.key('github')}
          {...form.getInputProps('github')}
        />
        <TextInput
          label="Website"
          placeholder="Enter your website link"
          key={form.key('website')}
          {...form.getInputProps('website')}
        />
      </Stack>
      <Group mt="lg">
        <Button type="submit">Next</Button>
      </Group>
    </form>
  );
};

export default StepOne;
