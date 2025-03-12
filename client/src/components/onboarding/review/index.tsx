import { FC } from 'react';
import { useRecoilValue } from 'recoil';
import states from '../../../states';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Group,
  Image,
  Stack,
  Text,
  Title
} from '@mantine/core';
import { format } from 'date-fns';

interface IReviewProps {
  submitting: boolean;
  onNavigateStep: (step: number) => void;
  onPrevStep: () => void;
  onSave: () => void;
}

const Review: FC<IReviewProps> = ({
  submitting,
  onNavigateStep,
  onPrevStep,
  onSave
}) => {
  const auth = useRecoilValue(states.auth);
  const { onboarding } = auth;

  return (
    <Stack mt="xl">
      <Title order={4}>Review your profile details before proceeding.</Title>

      <Card withBorder>
        <Stack gap="lg">
          <Group justify="space-between">
            <Title order={4}>Profile Info</Title>
            <Button
              variant="subtle"
              disabled={submitting}
              onClick={() => onNavigateStep(0)}
            >
              Edit
            </Button>
          </Group>
          <ReviewItem label="Email" value={onboarding.profileInfoForm?.email} />
          <ReviewItem
            label="Firstname"
            value={onboarding.profileInfoForm?.firstName}
          />
          <ReviewItem
            label="Lastname"
            value={onboarding.profileInfoForm?.lastName}
          />
          <ReviewItem
            label="Birthdate"
            value={
              onboarding.profileInfoForm?.birthdate &&
              format(
                new Date(onboarding.profileInfoForm?.birthdate),
                'MMMM dd, yyyy'
              )
            }
          />
          <ReviewItem
            label="Location"
            value={onboarding.profileInfoForm?.location}
          />
          <ReviewItem
            label="Pronouns"
            value={onboarding.profileInfoForm?.pronouns}
          />
          <ReviewItem label="Bio" value={onboarding.profileInfoForm?.bio} />
        </Stack>
      </Card>

      <Card withBorder>
        <Stack gap="lg">
          <Group justify="space-between">
            <Title order={4}>Avatar & Cover Photo</Title>
            <Button
              variant="subtle"
              disabled={submitting}
              onClick={() => onNavigateStep(1)}
            >
              Edit
            </Button>
          </Group>

          <Stack gap={6}>
            <Text size="sm" c="dimmed">
              Avatar
            </Text>
            <Avatar
              src={onboarding.uploadForm?.avatar}
              alt="avatar"
              radius="md"
              color="initials"
              size={120}
            />
          </Stack>

          <Stack gap={6}>
            <Text size="sm" c="dimmed">
              Cover Photo
            </Text>
            <Image
              src={onboarding.uploadForm?.cover}
              alt="avatar"
              radius="md"
              color="initials"
              w="100%"
              h="100%"
              style={{
                alignSelf: 'center',
                aspectRatio: '16/9'
              }}
            />
          </Stack>
        </Stack>
      </Card>

      <Card withBorder>
        <Stack gap="lg">
          <Group justify="space-between">
            <Title order={4}>Tags & Interests</Title>
            <Button
              variant="subtle"
              disabled={submitting}
              onClick={() => onNavigateStep(2)}
            >
              Edit
            </Button>
          </Group>
          <Group gap={6}>
            {onboarding.tagsForm.map((tag: string) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </Group>
        </Stack>
      </Card>

      <Group gap={6} mt="lg">
        <Button variant="default" disabled={submitting} onClick={onPrevStep}>
          Back
        </Button>
        <Button loading={submitting} onClick={onSave}>
          Save & Get Started
        </Button>
      </Group>
    </Stack>
  );
};

const ReviewItem = ({ label, value }: { label: string; value: string }) => {
  return (
    <Stack gap={0}>
      <Text size="sm" c="dimmed">
        {label}
      </Text>
      <Text>{value}</Text>
    </Stack>
  );
};

export default Review;
