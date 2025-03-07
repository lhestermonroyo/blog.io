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
import StepOne from '../../components/onboarding/step-one';
import StepTwo from '../../components/onboarding/step-two';

const Onboarding = () => {
  const [active, setActive] = useState(1);
  const nextStep = () => {
    setActive((current) => (current < 3 ? current + 1 : current));
    window.scrollTo(0, 0);
  };
  const prevStep = () => {
    setActive((current) => (current > 0 ? current - 1 : current));
    window.scrollTo(0, 0);
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
        <Stepper active={active} onStepClick={setActive}>
          <Stepper.Step label="First step" description="Profile Info">
            <StepOne onNextStep={nextStep} />
          </Stepper.Step>
          <Stepper.Step label="Second step" description="Avatar & Cover Photo">
            <StepTwo />
          </Stepper.Step>
          <Stepper.Step label="Final step" description="Tags & Interests">
            Step 3 content: Get full access
          </Stepper.Step>
          <Stepper.Completed>
            Completed, click back button to get to previous step
          </Stepper.Completed>
        </Stepper>

        {active !== 0 && (
          <Group gap={6} mt="lg">
            <Button variant="default" onClick={prevStep}>
              Back
            </Button>

            <Button onClick={nextStep}>Next</Button>
          </Group>
        )}
      </Stack>
    </Container>
  );
};

export default Onboarding;
