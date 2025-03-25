import { useMemo } from 'react';
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
import { useNavigate } from 'react-router';
import { IconAt, IconMapPin } from '@tabler/icons-react';
import { useMutation } from '@apollo/client';
import { useRecoilState, useRecoilValue } from 'recoil';

import states from '../../../states';
import { FOLLOW_USER } from '../../../graphql/mutations';
import { notifications } from '@mantine/notifications';
import { TPostState, TProfileBadge } from '../../../../types';

const AuthorPanel = ({ loading }: { loading: boolean }) => {
  const auth = useRecoilValue(states.auth);
  const [post, setPost] = useRecoilState(states.post);
  const {
    creatorProfile,
    creatorStats: {
      followers: { count: followersCount, list: followersList },
      following: { count: followingCount },
      posts: { count: creatorPostCount }
    }
  } = post;

  const [followUser] = useMutation(FOLLOW_USER);

  const navigate = useNavigate();

  const profileEmail = auth?.profile?.email as string;
  const isOwnProfile = useMemo(
    () => profileEmail === creatorProfile?.email,
    [creatorProfile?.email]
  );
  const isFollowed = useMemo(
    () =>
      followersList.some(
        (follower: TProfileBadge) => follower?.email === profileEmail
      ),
    [followersList, profileEmail]
  );

  const handleFollow = async () => {
    try {
      const response = await followUser({
        variables: { email: creatorProfile?.email }
      });
      const key = Object.keys(response.data)[0];
      const data = response.data[key];

      if (data) {
        setPost((prev: TPostState) => ({
          ...prev,
          creatorStats: {
            ...prev.creatorStats,
            followers: {
              count: data.followers.count,
              list: data.followers.list
            },
            following: {
              count: data.following.count,
              list: data.following.list
            }
          }
        }));

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

  if (loading) {
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

  if (creatorProfile) {
    return (
      <Card withBorder>
        <Stack gap="lg">
          <Title order={3}>About the Author</Title>
          <Group gap="md">
            <Avatar
              src={creatorProfile?.avatar}
              alt={creatorProfile?.firstName}
              name={`${creatorProfile?.firstName} ${creatorProfile?.lastName}`}
              radius="md"
              color="initials"
              size="xl"
            />
            <Stack flex={1} gap={6}>
              <Stack gap={0}>
                <Text size="xs" tt="uppercase" c="dimmed">
                  {creatorProfile?.title}
                </Text>
                <Group gap={4} align="center">
                  <Title order={5}>
                    {`${creatorProfile?.firstName} ${creatorProfile?.lastName}`}
                  </Title>
                  {creatorProfile?.pronouns && (
                    <Text size="xs" color="dimmed" mt={2}>
                      ({creatorProfile?.pronouns})
                    </Text>
                  )}
                </Group>
              </Stack>

              <Stack gap={2}>
                <Group gap={4} align="center">
                  <IconAt size={16} />
                  <Text size="xs" c="dimmed">
                    {creatorProfile?.email}
                  </Text>
                </Group>

                <Group gap={4} align="center">
                  <IconMapPin size={16} />
                  <Text size="xs" c="dimmed">
                    {creatorProfile?.location || 'Not set a location yet'}
                  </Text>
                </Group>
              </Stack>
            </Stack>
          </Group>

          <Text>{creatorProfile?.bio || 'No bio yet.'}</Text>

          <Group>
            <Stack gap={4} flex={1}>
              <Text size="sm" color="dimmed">
                Post Written
              </Text>
              <Text size="lg">{creatorPostCount}</Text>
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
            <Button
              flex={1}
              onClick={() => navigate(`/profile/${creatorProfile?.email}`)}
            >
              View Profile
            </Button>
          </Group>
        </Stack>
      </Card>
    );
  }
};

export default AuthorPanel;
