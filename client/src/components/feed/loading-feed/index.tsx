import { Card, Grid, Group, SimpleGrid, Skeleton, Stack } from '@mantine/core';

const LoadingFeed = () => {
  return (
    <SimpleGrid mt="lg" cols={{ base: 1, md: 2 }} spacing={24}>
      {[...new Array(4)].map((_, index) => (
        <Card p={0} key={index}>
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
};

export default LoadingFeed;
