import { FC } from 'react';
import { Avatar, Button, Card, Group, Stack, Text, Title } from '@mantine/core';
import { IconAt, IconMapPin } from '@tabler/icons-react';
import { useQuery } from '@apollo/client';

import { GET_PROFILE_BY_EMAIL } from '../../../graphql/queries';
import { useRecoilValue } from 'recoil';
import states from '../../../states';

interface AuthorPanelProps {
  creatorEmail: string;
}

const AuthorPanel: FC<AuthorPanelProps> = ({ creatorEmail }) => {
  const auth = useRecoilValue(states.auth);

  const { data } = useQuery(GET_PROFILE_BY_EMAIL, {
    variables: { email: creatorEmail }
  });

  if (data) {
    const key = Object.keys(data)[0];
    const profile = data[key];

    const isOwnProfile = auth?.email === creatorEmail;

    return (
      <Card withBorder>
        <Stack gap="lg">
          <Title order={3}>About the Author</Title>
          <Group gap="md">
            <Avatar
              src={profile.profilePhoto}
              alt={profile.firstName}
              name={`${profile.firstName} ${profile.lastName}`}
              radius="md"
              color="initials"
              size="xl"
            />
            <Stack flex={1} gap={6}>
              <Group gap={4} align="center">
                <Title order={5}>
                  {`${profile.firstName} ${profile.lastName}`}
                </Title>
                {profile.pronouns && (
                  <Text size="xs" color="dimmed" mt={2}>
                    ({profile.pronouns})
                  </Text>
                )}
              </Group>

              <Stack gap={2}>
                <Group gap={4} align="center">
                  <IconAt size={16} />
                  <Text size="sm" c="dimmed">
                    {profile.email}
                  </Text>
                </Group>

                {profile.location && (
                  <Group gap={4} align="center">
                    <IconMapPin size={16} />
                    <Text size="sm" c="dimmed">
                      {profile.location}
                    </Text>
                  </Group>
                )}
              </Stack>
            </Stack>
          </Group>

          <Text>{profile.bio}</Text>

          <Group>
            <Stack gap={4} flex={1}>
              <Text size="sm" color="dimmed">
                Post Written
              </Text>
              <Text size="lg">1.2k</Text>
            </Stack>
            <Stack gap={4} flex={1}>
              <Text size="sm" color="dimmed">
                Followers
              </Text>
              <Text size="lg">1.2k</Text>
            </Stack>
            <Stack gap={4} flex={1}>
              <Text size="sm" color="dimmed">
                Following
              </Text>
              <Text size="lg">1.2k</Text>
            </Stack>
          </Group>

          <Group gap={6}>
            {isOwnProfile && (
              <Button flex={1} variant="outline">
                Follow
              </Button>
            )}
            <Button flex={1}>View Profile</Button>
          </Group>
        </Stack>
      </Card>
    );
  }
};

export default AuthorPanel;
