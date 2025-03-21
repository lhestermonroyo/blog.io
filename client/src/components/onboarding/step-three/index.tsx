import { FC, Fragment, useEffect } from 'react';
import { Button, Group, MultiSelect, Stack, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRecoilState } from 'recoil';
import { useQuery } from '@apollo/client';

import states from '../../../states';
import { GET_TAGS } from '../../../graphql/queries';
import { TAuthState } from '../../../../types';

type StepThreeProps = {
  onNextStep: () => void;
  onPrevStep: () => void;
};

const StepThree: FC<StepThreeProps> = ({ onNextStep, onPrevStep }) => {
  const [auth, setAuth] = useRecoilState(states.auth);
  const { onboarding, profile } = auth;

  const form = useForm({
    initialValues: {
      tags: [] as string[]
    },
    validate: {
      tags: (value) =>
        value.length < 3 ? 'Select atleast 3 topics/tags' : null
    },
    mode: 'uncontrolled',
    validateInputOnBlur: true
  });

  useEffect(() => {
    form.setFieldValue('tags', onboarding.tagsForm);
  }, [onboarding.tagsForm, profile?.tags]);

  const { data } = useQuery(GET_TAGS);

  const handleSubmit = (values: typeof form.values) => {
    setAuth((prev: TAuthState) => ({
      ...prev,
      onboarding: {
        ...prev.onboarding,
        tagsForm: [...values.tags]
      }
    }));
    onNextStep();
  };

  if (data) {
    const key = Object.keys(data)[0];
    const tags = data[key];

    return (
      <Fragment>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="lg" mt="xl">
            <Title order={4}>
              Where do your interests lie? Select your preferred topics first to
              personalize your feed.
            </Title>
            <MultiSelect
              label="Select Topics/tags"
              placeholder="Select minumum of 3 topics/tags"
              data={tags}
              searchable
              clearable
              checkIconPosition="right"
              key={form.key('tags')}
              {...form.getInputProps('tags')}
            />
            <Group gap={6} mt="lg">
              <Button variant="default" onClick={onPrevStep}>
                Back
              </Button>

              <Button type="submit">Review</Button>
            </Group>
          </Stack>
        </form>
      </Fragment>
    );
  }
};

export default StepThree;
