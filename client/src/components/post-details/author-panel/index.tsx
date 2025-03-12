import { FC, useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Button,
  Card,
  Group,
  Skeleton,
  Stack,
  Text,
  Title
} from '@mantine/core';
import { IconAt, IconMapPin } from '@tabler/icons-react';
import { useMutation, useQuery } from '@apollo/client';

import {
  GET_FOLLOWS_BY_EMAIL,
  GET_PROFILE_BY_EMAIL
} from '../../../graphql/queries';
import { useRecoilValue } from 'recoil';

import states from '../../../states';
import { FOLLOW_USER } from '../../../graphql/mutations';
import { notifications } from '@mantine/notifications';

interface AuthorPanelProps {
  authorEmail: string;
}

const AuthorPanel: FC<AuthorPanelProps> = ({ authorEmail }) => {
  const [followDetails, setFollowDetails] = useState<any>(null);

  const auth = useRecoilValue(states.auth);
  const { creatorTotalPosts } = useRecoilValue(states.post);

  const {
    data,
    loading,
    refetch: fetchAuthor
  } = useQuery(GET_PROFILE_BY_EMAIL, {
    variables: { email: authorEmail }
  });
  const {
    data: followsData,
    loading: followsLoading,
    refetch: fetchFollowsByEmail
  } = useQuery(GET_FOLLOWS_BY_EMAIL, {
    variables: { email: authorEmail }
  });
  const [followUser] = useMutation(FOLLOW_USER);

  useEffect(() => {
    if (authorEmail) {
      fetchAuthor();
      fetchFollowsByEmail();
    }
  }, [authorEmail]);

  useEffect(() => {
    if (followsData) {
      const key = Object.keys(followsData)[0];
      setFollowDetails(followsData[key]);
    }
  }, [followsData]);

  const handleFollow = async () => {
    try {
      const response = await followUser({
        variables: { email: authorEmail }
      });
      const key = Object.keys(response.data)[0];
      const data = response.data[key];

      if (data) {
        setFollowDetails(data);
        notifications.show({
          title: 'Success',
          message: `You have ${
            isFollowed ? 'unfollowed' : 'followed'
          } the author.`,
          color: 'green',
          position: 'top-center'
        });
      }
    } catch (error) {
      console.error(error);
      notifications.show({
        title: 'Error',
        message: 'An error occurred while following/unfollowing the author.',
        color: 'red',
        position: 'top-center'
      });
    }
  };

  const isOwnProfile = useMemo(
    () => auth?.profile.email === authorEmail,
    [authorEmail]
  );
  const followersCount = useMemo(
    () => followDetails?.followersCount || 0,
    [followDetails?.followersCount]
  );
  const followingCount = useMemo(
    () => followDetails?.followingCount || 0,
    [followDetails?.followingCount]
  );
  const isFollowed = useMemo(
    () =>
      followDetails?.followers.some(
        (follower: any) => follower.email === auth?.profile.email
      ),
    [followDetails?.followers, auth?.profile.email]
  );

  console.log('followDetails', followDetails);

  if (followsLoading || loading) {
    return (
      <Card withBorder>
        <Stack gap="lg">
          <Title order={3}>About the Author</Title>
          <Group gap="md">
            <Skeleton radius="lg" width={84} height={84} />
            <Stack flex={1} gap={6}>
              <Group gap={4} align="center">
                <Skeleton height={30} radius="sm" width="80%" />
              </Group>

              <Stack gap={2}>
                <Skeleton height={14} radius="sm" width="60%" />
                <Skeleton height={14} radius="sm" width="60%" />
              </Stack>
            </Stack>
          </Group>

          <Stack gap={2}>
            <Skeleton height={20} radius="sm" />
            <Skeleton height={20} radius="sm" />
            <Skeleton height={20} radius="sm" width="30%" />
          </Stack>

          <Group>
            <Stack gap={4} flex={1}>
              <Skeleton height={14} radius="sm" />
              <Skeleton height={30} radius="sm" />
            </Stack>
            <Stack gap={4} flex={1}>
              <Skeleton height={14} radius="sm" />
              <Skeleton height={30} radius="sm" />
            </Stack>
            <Stack gap={4} flex={1}>
              <Skeleton height={14} radius="sm" />
              <Skeleton height={30} radius="sm" />
            </Stack>
          </Group>

          <Group gap={6}>
            <Skeleton height={40} radius="sm" flex={1} />
            <Skeleton height={40} radius="sm" flex={1} />
          </Group>
        </Stack>
      </Card>
    );
  }

  if (followsData && data) {
    const key = Object.keys(data)[0];
    const creator = data[key];

    return (
      <Card withBorder>
        <Stack gap="lg">
          <Title order={3}>About the Author</Title>
          <Group gap="md">
            <Avatar
              src={creator.avatar}
              alt={creator.firstName}
              name={`${creator.firstName} ${creator.lastName}`}
              radius="md"
              color="initials"
              size="xl"
            />
            <Stack flex={1} gap={6}>
              <Group gap={4} align="center">
                <Title order={5}>
                  {`${creator.firstName} ${creator.lastName}`}
                </Title>
                {creator.pronouns && (
                  <Text size="xs" color="dimmed" mt={2}>
                    ({creator.pronouns})
                  </Text>
                )}
              </Group>

              <Stack gap={2}>
                <Group gap={4} align="center">
                  <IconAt size={16} />
                  <Text size="sm" c="dimmed">
                    {creator.email}
                  </Text>
                </Group>

                <Group gap={4} align="center">
                  <IconMapPin size={16} />
                  <Text size="sm" c="dimmed">
                    {creator.location || 'Not set a location yet'}
                  </Text>
                </Group>
              </Stack>
            </Stack>
          </Group>

          <Text>{creator.bio || 'No bio yet.'}</Text>

          <Group>
            <Stack gap={4} flex={1}>
              <Text size="sm" color="dimmed">
                Post Written
              </Text>
              <Text size="lg">{creatorTotalPosts}</Text>
            </Stack>
            <Stack gap={4} flex={1}>
              <Text size="sm" color="dimmed">
                Followers
              </Text>
              <Text size="lg">{followersCount}</Text>
            </Stack>
            <Stack gap={4} flex={1}>
              <Text size="sm" color="dimmed">
                Following
              </Text>
              <Text size="lg">{followingCount}</Text>
            </Stack>
          </Group>

          <Group gap={6}>
            {!isOwnProfile && (
              <Button
                flex={1}
                variant={isFollowed ? 'light' : 'outline'}
                onClick={handleFollow}
              >
                {isFollowed ? 'Unfollow' : 'Follow'}
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
