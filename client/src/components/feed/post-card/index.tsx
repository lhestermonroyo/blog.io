import { FC } from 'react';
import {
  ActionIcon,
  Badge,
  Card,
  Grid,
  Group,
  Image,
  Stack,
  Text,
  Title,
  UnstyledButton
} from '@mantine/core';
import {
  IconBookmark,
  IconClock,
  IconHeart,
  IconMessage
} from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import { useNavigate } from 'react-router';
import { format } from 'date-fns';

import { TPostItem } from '../../../../types';

import ProfileBadge from '../../profile-badge';

type PostCardProps = {
  item: TPostItem;
};

const PostCard: FC<PostCardProps> = ({ item }) => {
  const content = JSON.parse(item.content);
  const thumbnail = content.blocks.find((block: any) => block.type === 'image');
  const paragraph = content.blocks.find(
    (block: any) => block.type === 'paragraph'
  );

  const isMd = useMediaQuery('(max-width: 768px)');
  const navigate = useNavigate();

  return (
    <UnstyledButton key={item.id} onClick={() => navigate(`/post/${item.id}`)}>
      <Card p={0}>
        <Grid>
          <Grid.Col span={thumbnail ? (!isMd ? 8 : 7) : 12}>
            <Stack>
              <Group>
                <ProfileBadge avatarSize="sm" profile={item.creator} />
              </Group>
              <Stack gap={0}>
                <Title order={!isMd ? 4 : 5} lineClamp={2}>
                  {item.title}
                </Title>
                <Group gap={4} align="center">
                  <IconClock size={14} />
                  <Text fz="xs" c="dimmed">
                    {format(new Date(item.createdAt), 'MMMM dd - hh:mm a')}
                  </Text>
                </Group>
              </Stack>
              <Text
                size={!isMd ? 'md' : 'sm'}
                lineClamp={2}
                dangerouslySetInnerHTML={{
                  __html: paragraph?.data.text
                }}
              />
              <Group gap={6}>
                {item.tags.map((tag: string) => (
                  <Badge key={tag} variant="light">
                    {tag}
                  </Badge>
                ))}
              </Group>
            </Stack>
          </Grid.Col>
          {thumbnail && (
            <Grid.Col flex={1} display="flex" span={!isMd ? 4 : 5}>
              <Image
                radius="sm"
                src={thumbnail?.data.file.url}
                fallbackSrc="https://placehold.co/600x400?text=No%20Image%20Available"
                alt="thumbnail"
                style={{
                  alignSelf: 'center',
                  aspectRatio: '16/9'
                }}
              />
            </Grid.Col>
          )}
        </Grid>
        <Group mt="md" gap="lg">
          <Group justify="center" align="center" gap={4}>
            <ActionIcon variant="transparent">
              <IconHeart size={!isMd ? 24 : 20} />
            </ActionIcon>
            <Text c="dimmed" size={!isMd ? 'md' : 'sm'}>
              {item.likeCount}
            </Text>
          </Group>
          <Group justify="center" align="center" gap={4}>
            <ActionIcon variant="transparent">
              <IconMessage size={!isMd ? 24 : 20} />
            </ActionIcon>
            <Text c="dimmed" size={!isMd ? 'md' : 'sm'}>
              {item.commentCount}
            </Text>
          </Group>
          <Group justify="center" align="center" gap={4}>
            <ActionIcon variant="transparent">
              <IconBookmark size={!isMd ? 24 : 20} />
            </ActionIcon>
            <Text c="dimmed" size={!isMd ? 'md' : 'sm'}>
              {item.saveCount}
            </Text>
          </Group>
        </Group>
      </Card>
    </UnstyledButton>
  );
};

export default PostCard;
