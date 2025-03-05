import {
  Box,
  Button,
  Container,
  Group,
  Stack,
  Stepper,
  Text,
  Title
} from '@mantine/core';
import { useState } from 'react';
import Logo from '../../components/logo';
import AdditionalInfoForm from '../../components/onboarding/additional-info-form';

const Onboarding = () => {
  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  return (
    <Container size="sm" pt={80}>
      <Stack gap="xl">
        <Group>
          <Logo />
        </Group>
        <Box>
          <Title order={1}>Profile Setup</Title>
          <Text c="dimmed">We would like to know you first.</Text>
        </Box>
        <Stepper active={active} onStepClick={setActive}>
          <Stepper.Step
            label="First step"
            description="Additional Profile Info"
          >
            <AdditionalInfoForm />
          </Stepper.Step>
          <Stepper.Step label="Second step" description="Profile & Cover Photo">
            Step 2 content: Verify email
          </Stepper.Step>
          <Stepper.Step label="Final step" description="Tags & Interests">
            Step 3 content: Get full access
          </Stepper.Step>
          <Stepper.Completed>
            Completed, click back button to get to previous step
          </Stepper.Completed>
        </Stepper>

        <Group justify="center" mt="lg">
          <Button variant="default" onClick={prevStep}>
            Back
          </Button>
          <Button onClick={nextStep}>Next step</Button>
        </Group>
      </Stack>
    </Container>
  );
};

export default Onboarding;
