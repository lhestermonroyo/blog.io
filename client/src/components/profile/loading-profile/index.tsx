import { Card, Grid, Group, Skeleton, Stack, Text, Title } from '@mantine/core';
import { FC, ReactNode } from 'react';

type LoadingProfileProps = {
  loading: boolean;
  error: any;
  children: ReactNode;
};

const LoadingProfile: FC<LoadingProfileProps> = ({
  loading,
  error,
  children
}) => {
  if (loading) {
    return (
      <Grid>
        <Grid.Col span={8}>
          <Stack gap="lg">
            <Card withBorder>
              <Card.Section>
                <Skeleton radius="sm" height={300} width="100%" />
              </Card.Section>
              <Stack>
                <Group mt={-40} justify="space-between" align="flex-end">
                  <Skeleton
                    className="profile-avatar"
                    radius="lg"
                    width={100}
                    height={100}
                  />
                </Group>

                <Group justify="space-between" align="flex-start">
                  <Stack gap="md" flex={1}>
                    <Skeleton height={30} radius="sm" width="60%" />

                    <Stack gap={2}>
                      <Skeleton height={20} radius="sm" width="50%" />
                      <Skeleton height={20} radius="sm" width="50%" />
                    </Stack>
                  </Stack>

                  <Group flex={1}>
                    <Stack gap={4} flex={1}>
                      <Skeleton height={20} width={70} radius="sm" />
                      <Skeleton height={30} radius="sm" />
                    </Stack>
                    <Stack gap={4} flex={1}>
                      <Skeleton height={20} width={70} radius="sm" />
                      <Skeleton height={30} radius="sm" />
                    </Stack>
                    <Stack gap={4} flex={1}>
                      <Skeleton height={20} width={70} radius="sm" />
                      <Skeleton height={30} radius="sm" />
                    </Stack>
                  </Group>
                </Group>

                <Stack gap="xs" mt="lg">
                  <Skeleton height={24} radius="sm" />
                  <Skeleton height={24} radius="sm" />
                  <Skeleton height={24} width="80%" radius="sm" />
                </Stack>

                <Group gap={6} mt="lg" flex={1}>
                  <Skeleton height={40} radius="sm" flex={1} />
                  <Skeleton height={40} radius="sm" flex={1} />
                </Group>
              </Stack>
            </Card>

            <Card withBorder p={0}>
              <Card>
                <Grid>
                  <Grid.Col span={8}>
                    <Stack>
                      <Group gap={6}>
                        <Skeleton radius="xl" width={30} height={30} />
                        <Skeleton height={20} width="50%" radius="sm" />
                      </Group>
                      <Stack gap="xs">
                        <Skeleton height={24} radius="sm" />
                        <Skeleton height={24} radius="sm" />
                        <Skeleton height={24} width="80%" radius="sm" />
                      </Stack>
                    </Stack>
                  </Grid.Col>
                  <Grid.Col span={4} flex={1} display="flex">
                    <Skeleton
                      height={100}
                      radius="sm"
                      style={{
                        alignSelf: 'center'
                      }}
                    />
                  </Grid.Col>
                </Grid>
              </Card>
            </Card>
          </Stack>
        </Grid.Col>
        <Grid.Col span={4}>
          <Stack gap="lg">
            <Card withBorder>
              <Stack gap="lg">
                <Title order={3}>About</Title>
                <Stack gap={4} flex={1}>
                  <Skeleton height={20} width={70} radius="sm" />
                  <Skeleton height={24} radius="sm" />
                </Stack>
                <Stack gap={4} flex={1}>
                  <Skeleton height={20} width={70} radius="sm" />
                  <Skeleton height={24} radius="sm" />
                </Stack>
                <Stack gap={4} flex={1}>
                  <Skeleton height={20} width={70} radius="sm" />
                  <Skeleton height={24} radius="sm" />
                </Stack>
                <Stack gap={4} flex={1}>
                  <Skeleton height={20} width={70} radius="sm" />
                  <Skeleton height={24} radius="sm" />
                  <Skeleton height={24} radius="sm" />
                  <Skeleton height={24} width="70%" radius="sm" />
                </Stack>
              </Stack>
            </Card>
            <Card withBorder>
              <Stack gap="lg">
                <Title order={3}>Socials</Title>
                <Group gap={6}>
                  <Skeleton height={30} radius="sm" width={120} />
                  <Skeleton height={30} radius="sm" width={80} />
                  <Skeleton height={30} radius="sm" width={100} />
                  <Skeleton height={30} radius="sm" width={70} />
                  <Skeleton height={30} radius="sm" width={150} />
                  <Skeleton height={30} radius="sm" width={70} />
                </Group>
              </Stack>
            </Card>
            <Card withBorder>
              <Stack gap="lg">
                <Title order={3}>Topics/Tags</Title>
                <Group gap={6}>
                  <Skeleton height={30} radius="sm" width={120} />
                  <Skeleton height={30} radius="sm" width={80} />
                  <Skeleton height={30} radius="sm" width={100} />
                  <Skeleton height={30} radius="sm" width={70} />
                  <Skeleton height={30} radius="sm" width={150} />
                  <Skeleton height={30} radius="sm" width={70} />
                </Group>
              </Stack>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>
    );
  }

  if (error) {
    return (
      <Stack gap="lg">
        <Title order={1} ta="center">
          Something went wrong.
        </Title>
        <Text size="sm" ta="center" color="dimmed">
          An error occured while fetching profile. Please try again.
        </Text>
      </Stack>
    );
  }

  return children;
};

export default LoadingProfile;
