import { Fragment, useEffect, useMemo, useState } from 'react';
// @ts-ignore
import { Helmet } from 'react-helmet';
import { useNavigate, useParams } from 'react-router';
import { useRecoilValue } from 'recoil';
import states from '../../states';
import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Card,
  Grid,
  Group,
  Image,
  Stack,
  Tabs,
  Text,
  Title
} from '@mantine/core';
import {
  IconAt,
  IconBallpen,
  IconEdit,
  IconMapPin,
  IconMessage2,
  IconUserMinus,
  IconUserPlus
} from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import { useMutation, useQuery } from '@apollo/client';
import { notifications } from '@mantine/notifications';

import {
  GET_PROFILE_BY_EMAIL,
  GET_STATS_BY_EMAIL
} from '../../graphql/queries';
import { FOLLOW_USER } from '../../graphql/mutations';
import { TPostItem, TProfile, TProfileBadge, TStats } from '../../../types';

import MainLayout from '../../layouts/main';
import PostCard from '../../components/feed/post-card';
import LoadingProfile from '../../components/profile/loading-profile';
import ProfileButton from '../../components/profile-button';
import TagsPanel from '../../components/profile/tags-panel';
import SocialsPanel from '../../components/profile/socials-panel';
import ExpandableImage from '../../components/expandable-image';

const Profile = () => {
  const [profile, setProfile] = useState<TProfile | null>(null);
  const [stats, setStats] = useState<TStats>({
    posts: {
      count: 0,
      list: []
    },
    savedPosts: {
      count: 0,
      list: []
    },
    followers: {
      count: 0,
      list: []
    },
    following: {
      count: 0,
      list: []
    }
  });

  const auth = useRecoilValue(states.auth);

  const isLg = useMediaQuery('(max-width: 1200px)');
  const params = useParams();
  const navigate = useNavigate();

  const { data: profileData, loading: profileLoading } = useQuery(
    GET_PROFILE_BY_EMAIL,
    {
      variables: {
        email: params.email
      },
      skip: !params.email,
      fetchPolicy: 'network-only'
    }
  );
  const {
    data: statsResponse,
    loading: statsLoading,
    refetch: fetchStatsByEmail
  } = useQuery(GET_STATS_BY_EMAIL, {
    variables: { email: profile?.email },
    skip: !profile?.email,
    fetchPolicy: 'network-only'
  });
  const [followUser] = useMutation(FOLLOW_USER);

  useEffect(() => {
    window.addEventListener('scroll', stickyListener);

    return () => {
      window.removeEventListener('scroll', stickyListener);
    };
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchStatsByEmail();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!params.email) {
      setProfile(auth.profile);
    }
  }, [params]);

  useEffect(() => {
    if (profileData) {
      const key = Object.keys(profileData)[0];
      const data = profileData[key];
      setProfile(data);

      fetchStatsByEmail();
    }
  }, [profileData]);

  useEffect(() => {
    if (statsResponse) {
      const key = Object.keys(statsResponse)[0];
      const data = statsResponse[key];

      setStats((prev: TStats) => ({
        ...prev,
        posts: data.posts,
        savedPosts: data.savedPosts,
        followers: data.followers,
        following: data.following
      }));
    }
  }, [statsResponse]);

  const stickyListener = () => {
    const extras = document.querySelector('.sidebar-container');
    const scrollTop = window.scrollY;

    if (extras) {
      if (scrollTop >= 25) {
        extras.classList.add('is-sticky');
      } else {
        extras.classList.remove('is-sticky');
      }
    }
  };

  const handleFollow = async () => {
    try {
      const response = await followUser({
        variables: { email: profile?.email }
      });
      const key = Object.keys(response.data)[0];
      const data = response.data[key];

      if (data) {
        setStats((prev: TStats) => ({
          ...prev,
          followers: {
            count: data.followers.count,
            list: data.followers.list
          },
          following: {
            count: data.following.count,
            list: data.following.list
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

  const ownProfile = useMemo(
    () => profile?.email === auth.profile?.email,
    [profile?.email]
  );
  const isFollowed = useMemo(
    () =>
      stats.followers.list.some(
        (follower: TProfileBadge) => follower?.email === auth.profile?.email
      ),
    [stats.followers.list, auth.profile?.email]
  );

  if (profile && stats) {
    return (
      <Fragment>
        <Helmet>
          <title>
            blog.io | {`${profile.firstName} ${profile.lastName}'s Profile`}
          </title>
          <meta
            name="description"
            content={`Profile of ${profile.firstName} ${profile.lastName}`}
          />
          <link rel="canonical" href="/profile" />
        </Helmet>
        <MainLayout>
          <Stack gap="lg">
            <Title order={1}>Profile</Title>
            <Grid gutter="xl">
              <Grid.Col span={!isLg ? 8 : 12}>
                <LoadingProfile
                  loading={profileLoading || statsLoading}
                  error={null}
                >
                  <Stack gap="lg">
                    <Card withBorder>
                      <Card.Section h={300} pos="relative">
                        <ExpandableImage src={profile.coverPhoto}>
                          <Image
                            src={profile.coverPhoto}
                            alt="Cover photo"
                            w="100%"
                            h="100%"
                            style={{
                              alignSelf: 'center',
                              aspectRatio: '16/9'
                            }}
                          />
                        </ExpandableImage>
                        {ownProfile && (
                          <ActionIcon
                            radius="xl"
                            pos="absolute"
                            top={12}
                            right={12}
                            onClick={() => navigate('edit?tab=4')}
                          >
                            <IconEdit size={16} />
                          </ActionIcon>
                        )}
                      </Card.Section>
                      <Stack>
                        <Group
                          mt={-40}
                          justify="space-between"
                          align="flex-end"
                        >
                          <Box pos="relative">
                            <ExpandableImage src={profile?.avatar}>
                              <Avatar
                                src={profile?.avatar}
                                alt={profile?.firstName}
                                name={`${profile?.firstName} ${profile?.lastName}`}
                                radius="md"
                                color="initials"
                                size={100}
                                className="profile-avatar"
                              />
                            </ExpandableImage>
                            {ownProfile && (
                              <ActionIcon
                                radius="xl"
                                pos="absolute"
                                right={-10}
                                bottom={-10}
                                onClick={() => navigate('edit?tab=4')}
                              >
                                <IconEdit size={16} />
                              </ActionIcon>
                            )}
                          </Box>
                        </Group>

                        <Group justify="space-between" align="flex-start">
                          <Stack gap="md" flex={1}>
                            <Stack gap={0}>
                              <Text size="xs" tt="uppercase" c="dimmed">
                                {profile?.title}
                              </Text>
                              <Group gap={4} align="center">
                                <Title order={3}>
                                  {`${profile?.firstName} ${profile?.lastName}`}
                                </Title>
                                {profile?.pronouns && (
                                  <Title order={5} c="dimmed">
                                    ({profile?.pronouns})
                                  </Title>
                                )}
                              </Group>
                            </Stack>
                            <Stack gap={2}>
                              <Group gap={4} align="center">
                                <IconAt size={16} />
                                <Text size="sm" c="dimmed">
                                  {profile?.email}
                                </Text>
                              </Group>

                              <Group gap={4} align="center">
                                <IconMapPin size={16} />
                                <Text size="sm" c="dimmed">
                                  {profile?.location ||
                                    'Not set a location yet'}
                                </Text>
                              </Group>
                            </Stack>
                          </Stack>
                          <Group flex={1} visibleFrom="sm">
                            <Stack gap={4} flex={1}>
                              <Text size="sm" color="dimmed">
                                Post Written
                              </Text>
                              <Text size="lg">{stats.posts.count}</Text>
                            </Stack>
                            <Stack gap={4} flex={1}>
                              <Text size="sm" color="dimmed">
                                Followers
                              </Text>
                              <Text size="lg">{stats.followers.count}</Text>
                            </Stack>
                            <Stack gap={4} flex={1}>
                              <Text size="sm" color="dimmed">
                                Following
                              </Text>
                              <Text size="lg">{stats.following.count}</Text>
                            </Stack>
                          </Group>
                        </Group>

                        <Group flex={1} hiddenFrom="sm">
                          <Stack gap={4} flex={1}>
                            <Text size="sm" color="dimmed">
                              Post Written
                            </Text>
                            <Text size="lg">{stats.posts.count}</Text>
                          </Stack>
                          <Stack gap={4} flex={1}>
                            <Text size="sm" color="dimmed">
                              Followers
                            </Text>
                            <Text size="lg">{stats.followers.count}</Text>
                          </Stack>
                          <Stack gap={4} flex={1}>
                            <Text size="sm" color="dimmed">
                              Following
                            </Text>
                            <Text size="lg">{stats.following.count}</Text>
                          </Stack>
                        </Group>

                        <Text mt="lg">{profile?.bio}</Text>

                        <Group gap={6} mt="lg" flex={1}>
                          {!ownProfile && (
                            <Fragment>
                              {auth.isAuth && auth.profile && (
                                <Button
                                  flex={1}
                                  variant={isFollowed ? 'light' : 'outline'}
                                  leftSection={
                                    isFollowed ? (
                                      <IconUserMinus size={20} />
                                    ) : (
                                      <IconUserPlus size={20} />
                                    )
                                  }
                                  onClick={handleFollow}
                                >
                                  {isFollowed ? 'Unfollow' : 'Follow'}
                                </Button>
                              )}

                              <Button
                                flex={1}
                                component="a"
                                leftSection={<IconMessage2 size={20} />}
                                href={`mailto:${profile?.email}`}
                              >
                                Get in Touch
                              </Button>
                            </Fragment>
                          )}
                          {ownProfile && (
                            <Fragment>
                              <Button
                                flex={1}
                                variant="outline"
                                leftSection={<IconBallpen size={20} />}
                                onClick={() => navigate('/compose')}
                              >
                                Compose New Post
                              </Button>
                              <Button
                                flex={1}
                                leftSection={<IconEdit size={20} />}
                                onClick={() => navigate('edit')}
                              >
                                Edit Profile
                              </Button>
                            </Fragment>
                          )}
                        </Group>
                      </Stack>
                    </Card>

                    {auth.isAuth && auth.profile ? (
                      <Card withBorder p={0}>
                        <Tabs defaultValue="1">
                          <Tabs.List justify="center">
                            <Tabs.Tab value="1">Posts</Tabs.Tab>
                            <Tabs.Tab value="2">Saved Posts</Tabs.Tab>
                            <Tabs.Tab value="3">Followers</Tabs.Tab>
                            <Tabs.Tab value="4">Following</Tabs.Tab>
                          </Tabs.List>
                          <Tabs.Panel
                            value="1"
                            p={stats.posts.list.length ? 'lg' : 0}
                          >
                            <Stack gap="xl">
                              {stats.posts.list.length ? (
                                <Stack gap="xl">
                                  {stats.posts.list.map((post: TPostItem) => (
                                    <PostCard key={post.id} item={post} />
                                  ))}
                                </Stack>
                              ) : (
                                <Empty text="No created post yet." />
                              )}
                            </Stack>
                          </Tabs.Panel>
                          <Tabs.Panel
                            value="2"
                            p={stats.savedPosts.list.length ? 'lg' : 0}
                          >
                            {stats.savedPosts.list.length ? (
                              <Stack gap="xl">
                                {stats.savedPosts.list.map(
                                  (post: TPostItem) => (
                                    <PostCard key={post.id} item={post} />
                                  )
                                )}
                              </Stack>
                            ) : (
                              <Empty text="No saved posts yet." />
                            )}
                          </Tabs.Panel>
                          <Tabs.Panel value="3">
                            {stats.followers.list.length ? (
                              stats.followers.list.map(
                                (follower: TProfileBadge) => (
                                  <ProfileButton
                                    key={follower.id}
                                    profile={follower}
                                  />
                                )
                              )
                            ) : (
                              <Empty text="No followers yet." />
                            )}
                          </Tabs.Panel>
                          <Tabs.Panel value="4">
                            {stats.following.list.length ? (
                              stats.following.list.map(
                                (following: TProfileBadge) => (
                                  <ProfileButton
                                    key={following.id}
                                    profile={following}
                                  />
                                )
                              )
                            ) : (
                              <Empty text="Not following anyone yet." />
                            )}
                          </Tabs.Panel>
                        </Tabs>
                      </Card>
                    ) : (
                      <Card withBorder>
                        <Title order={3} mb="md">
                          Posts
                        </Title>
                        <Stack gap="xl">
                          {stats.posts.list.length ? (
                            <Stack gap="xl">
                              {stats.posts.list.map((post: TPostItem) => (
                                <PostCard key={post.id} item={post} />
                              ))}
                            </Stack>
                          ) : (
                            <Empty text="No created post yet." />
                          )}
                        </Stack>
                      </Card>
                    )}
                  </Stack>
                </LoadingProfile>
              </Grid.Col>
              <Grid.Col span={!isLg ? 4 : 12}>
                <Stack gap="lg" className="sidebar-container">
                  <SocialsPanel
                    loading={profileLoading || statsLoading}
                    ownProfile={ownProfile}
                    socials={profile?.socials}
                  />
                  <TagsPanel
                    loading={profileLoading || statsLoading}
                    ownProfile={ownProfile}
                    tags={profile?.tags}
                  />
                </Stack>
              </Grid.Col>
            </Grid>
          </Stack>
        </MainLayout>
      </Fragment>
    );
  }
};

const Empty = ({ text }: { text: string }) => {
  return (
    <Box px="md" py="xl">
      <Text>{text}</Text>
    </Box>
  );
};

export default Profile;
