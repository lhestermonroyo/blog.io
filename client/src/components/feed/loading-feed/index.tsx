import {
  Button,
  Card,
  Center,
  Grid,
  Group,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title
} from '@mantine/core';
import { FC, ReactNode } from 'react';

type LoadingFeedProps = {
  loading: boolean;
  error: any;
  refetch: () => Promise<any>;
  children: ReactNode;
};

const LoadingFeed: FC<LoadingFeedProps> = ({
  loading,
  error,
  refetch,
  children
}) => {
  if (loading) {
    return (
      <SimpleGrid cols={2}>
        {[...new Array(4)].map((_, index) => (
          <Card key={index}>
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
        ))}
      </SimpleGrid>
    );
  }

  if (error) {
    return (
      <Stack gap="lg">
        <Title order={1} ta="center">
          Something went wrong.
        </Title>
        <Text size="sm" ta="center" color="dimmed">
          An error occured while fetching posts. Please try again.
        </Text>

        <Center mt="lg">
          <Button onClick={() => refetch()}>Retry</Button>
        </Center>
      </Stack>
    );
  }

  return children;
};

export default LoadingFeed;
