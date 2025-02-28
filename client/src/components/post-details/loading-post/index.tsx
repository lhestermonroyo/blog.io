import { Divider, Group, Skeleton, Stack } from '@mantine/core';
import { FC, ReactNode } from 'react';

interface LoadingPostProps {
  loading: boolean;
  children: ReactNode;
}

const LoadingPost: FC<LoadingPostProps> = ({ loading, children }) => {
  if (loading) {
    return (
      <Stack gap="lg">
        <Stack gap={4}>
          <Skeleton height={40} radius="sm" />
          <Skeleton height={14} width="20%" radius="sm" />
        </Stack>
        <Stack gap="xs">
          <Group gap={6}>
            <Skeleton radius="xl" width={40} height={40} />
            <Skeleton height={20} width="25%" radius="sm" />
          </Group>
          <Divider />
        </Stack>
        <Stack>
          <Skeleton height={24} radius="sm" />
          <Skeleton height={24} radius="sm" />
          <Skeleton height={24} radius="sm" />
          <Skeleton height={24} width="80%" radius="sm" />
        </Stack>
        <Skeleton height={400} radius="sm" />
      </Stack>
    );
  }

  return children;
};

export default LoadingPost;
