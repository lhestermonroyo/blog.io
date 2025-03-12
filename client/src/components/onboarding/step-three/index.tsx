import { FC, Fragment, useEffect } from 'react';
import { Button, Group, MultiSelect, Stack, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRecoilState } from 'recoil';
import { useQuery } from '@apollo/client';

import { GET_TAGS } from '../../../graphql/queries';
import states from '../../../states';

interface StepThreeProps {
  onNextStep: () => void;
  onPrevStep: () => void;
}

const StepThree: FC<StepThreeProps> = ({ onNextStep, onPrevStep }) => {
  const [auth, setAuth] = useRecoilState(states.auth);
  const { onboarding } = auth;

  const form = useForm({
    initialValues: {
      tags: []
    },
    validate: {
      tags: (value) => (value.length < 3 ? 'Select atleast 3 topics' : null)
    },
    mode: 'uncontrolled',
    validateInputOnBlur: true
  });

  useEffect(() => {
    form.setFieldValue('tags', onboarding.tagsForm);
  }, [onboarding.tagsForm]);

  const { data } = useQuery(GET_TAGS);

  const handleSubmit = (values: typeof form.values) => {
    setAuth((prev: any) => ({
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
              label="Select Topics"
              placeholder="Select minumum of 3 topics"
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
