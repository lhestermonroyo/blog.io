import { FC, useEffect } from 'react';
import {
  Button,
  Group,
  Select,
  Stack,
  Textarea,
  TextInput
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useRecoilState } from 'recoil';

import states from '../../../states';
import { TAuthState } from '../../../../types';

type StepOneProps = {
  onNextStep: () => void;
}

const StepOne: FC<StepOneProps> = ({ onNextStep }) => {
  const [auth, setAuth] = useRecoilState(states.auth);
  const { profile, onboarding } = auth;

  const form = useForm({
    initialValues: {
      email: '',
      firstName: '',
      lastName: '',
      birthdate: null as Date | null,
      location: '',
      pronouns: '',
      bio: ''
    },
    validate: {
      firstName: (value) => (value ? null : 'First name is required'),
      lastName: (value) => (value ? null : 'Last name is required'),
      birthdate: (value) => (value ? null : 'Birthdate is required'),
      location: (value) => (value ? null : 'Location is required'),
      pronouns: (value) => (value ? null : 'Pronouns are required'),
      bio: (value) => (value ? null : 'Bio is required')
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
        bio: formData?.bio || profile?.bio
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
        <DateInput
          label="Birthdate"
          placeholder="Enter your birthdate"
          key={form.key('birthdate')}
          {...form.getInputProps('birthdate')}
        />
        <TextInput
          label="Location"
          placeholder="Enter your location"
          key={form.key('location')}
          {...form.getInputProps('location')}
        />
        <Select
          label="Pronouns"
          placeholder="Select your pronouns"
          data={['He/Him', 'She/Her', 'They/Them']}
          key={form.key('pronouns')}
          {...form.getInputProps('pronouns')}
        />
        <Textarea
          label="Bio"
          placeholder="Enter your bio"
          key={form.key('bio')}
          {...form.getInputProps('bio')}
        />
      </Stack>
      <Group mt="lg">
        <Button type="submit">Next</Button>
      </Group>
    </form>
  );
};

export default StepOne;
