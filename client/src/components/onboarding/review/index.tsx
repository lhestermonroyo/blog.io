import { FC } from 'react';
import { useRecoilValue } from 'recoil';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Divider,
  Group,
  Image,
  Stack,
  Text,
  Title
} from '@mantine/core';
import { format } from 'date-fns';

import states from '../../../states';

type ReviewProps = {
  submitting: boolean;
  onNavigateStep: (step: number) => void;
  onPrevStep: () => void;
  onSave: () => void;
};

const Review: FC<ReviewProps> = ({
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
            label="Pronouns"
            value={onboarding.profileInfoForm?.pronouns}
          />
          <ReviewItem label="Title" value={onboarding.profileInfoForm?.title} />
          <ReviewItem
            label="Location"
            value={onboarding.profileInfoForm?.location}
          />

          <ReviewItem
            label="Birthdate"
            value={format(
              onboarding.profileInfoForm?.birthdate as Date,
              'MMMM dd, yyyy'
            )}
          />
          <ReviewItem label="Bio" value={onboarding.profileInfoForm?.bio} />

          <Divider
            label={
              <Title c="dark" order={4}>
                Socials
              </Title>
            }
            labelPosition="left"
          />

          {onboarding.profileInfoForm?.facebook && (
            <ReviewItem
              label="Facebook"
              value={onboarding.profileInfoForm?.facebook}
            />
          )}

          {onboarding.profileInfoForm?.twitter && (
            <ReviewItem
              label="Twitter"
              value={onboarding.profileInfoForm?.twitter}
            />
          )}

          {onboarding.profileInfoForm?.instagram && (
            <ReviewItem
              label="Instagram"
              value={onboarding.profileInfoForm?.instagram}
            />
          )}

          {onboarding.profileInfoForm?.linkedin && (
            <ReviewItem
              label="LinkedIn"
              value={onboarding.profileInfoForm?.linkedin}
            />
          )}

          {onboarding.profileInfoForm?.github && (
            <ReviewItem
              label="Github"
              value={onboarding.profileInfoForm?.github}
            />
          )}

          {onboarding.profileInfoForm?.website && (
            <ReviewItem
              label="Website"
              value={onboarding.profileInfoForm?.website}
            />
          )}
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
              src={onboarding.uploadForm?.coverPhoto}
              fallbackSrc="https://t4.ftcdn.net/jpg/03/13/99/15/360_F_313991528_xkWq6AjZIkRu21XCF1jDqRFDx9v93M7r.jpg"
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
              <Badge key={tag} variant="light">
                {tag}
              </Badge>
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
