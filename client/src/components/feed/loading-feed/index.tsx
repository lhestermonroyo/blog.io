import { Card, Grid, Group, SimpleGrid, Skeleton, Stack } from '@mantine/core';
import { FC, ReactNode } from 'react';

interface LoadingFeedProps {
  loading: boolean;
  children: ReactNode;
}

const LoadingFeed: FC<LoadingFeedProps> = ({ loading, children }) => {
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

  return children;
};

export default LoadingFeed;
