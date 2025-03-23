import {
  Badge,
  Button,
  Card,
  Group,
  Skeleton,
  Stack,
  Title
} from '@mantine/core';
import { IconEdit } from '@tabler/icons-react';
import { useNavigate } from 'react-router';

const TagsPanel = ({
  loading,
  ownProfile,
  tags
}: {
  loading: boolean;
  ownProfile: boolean;
  tags: string[];
}) => {
  const navigate = useNavigate();

  if (loading) {
    return <Loading />;
  }

  const renderList = () => {
    return (
      <Group gap={6}>
        {tags.map((item: string) => (
          <Badge key={item} variant="light">
            {item}
          </Badge>
        ))}
      </Group>
    );
  };

  const renderEmpty = () => {
    return (
      <Stack gap="lg">
        <Title order={5}>Looks like you don't have any topics/tags yet.</Title>
      </Stack>
    );
  };

  return (
    <Card withBorder>
      <Stack gap="lg">
        <Title order={3}>Liked Topics/Tags</Title>
        {tags.length > 0 ? renderList() : renderEmpty()}
        {ownProfile && (
          <Group>
            <Button
              leftSection={<IconEdit size={16} />}
              onClick={() => navigate('edit?tab=3')}
            >
              Edit
            </Button>
          </Group>
        )}
      </Stack>
    </Card>
  );
};

const Loading = () => {
  return (
    <Card withBorder>
      <Stack gap="lg">
        <Title order={3}>Liked Topics/Tags</Title>
        <Group gap={6}>
          <Skeleton height={24} radius="sm" width={120} />
          <Skeleton height={24} radius="sm" width={80} />
          <Skeleton height={24} radius="sm" width={100} />
          <Skeleton height={24} radius="sm" width={70} />
          <Skeleton height={24} radius="sm" width={150} />
          <Skeleton height={24} radius="sm" width={70} />
          <Skeleton height={24} radius="sm" width={60} />
          <Skeleton height={24} radius="sm" width={70} />
          <Skeleton height={24} radius="sm" width={150} />
          <Skeleton height={24} radius="sm" width={70} />
          <Skeleton height={24} radius="sm" width={100} />
          <Skeleton height={24} radius="sm" width={70} />
        </Group>
      </Stack>
    </Card>
  );
};

export default TagsPanel;
