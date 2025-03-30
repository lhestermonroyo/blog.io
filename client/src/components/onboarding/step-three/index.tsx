import { FC, Fragment, useEffect } from 'react';
import { Button, Group, MultiSelect, Stack, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMediaQuery } from '@mantine/hooks';
import { useRecoilState, useRecoilValue } from 'recoil';

import states from '../../../states';
import { TAuthState } from '../../../../types';

type StepThreeProps = {
  onNextStep: () => void;
  onPrevStep: () => void;
};

const StepThree: FC<StepThreeProps> = ({ onNextStep, onPrevStep }) => {
  const [auth, setAuth] = useRecoilState(states.auth);
  const tag = useRecoilValue(states.tag);
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

  const isMd = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    form.setFieldValue('tags', onboarding.tagsForm);
  }, [onboarding.tagsForm, profile?.tags]);

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

  if (tag) {
    return (
      <Fragment>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="lg" mt="xl">
            <Title order={!isMd ? 4 : 5}>
              Where do your interests lie? Select your preferred topics first to
              personalize your feed.
            </Title>
            <MultiSelect
              label="Select Topics/tags"
              placeholder="Select minumum of 3 topics/tags"
              data={tag.list}
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
