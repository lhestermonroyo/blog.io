import React from 'react';
import { Select, Stack, Textarea, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';

const AdditionalInfoForm = () => {
  const form = useForm({});

  return (
    <form>
      <Stack>
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
    </form>
  );
};

export default AdditionalInfoForm;
