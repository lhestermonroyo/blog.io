import { FC } from 'react';
import {
  Avatar,
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
import { IconClock, IconHeart, IconMessage } from '@tabler/icons-react';
import { useNavigate } from 'react-router';
import { format } from 'date-fns';

import ProfileBadge from '../../profile-badge';

interface IPostCardProps {
  item: any;
}

const PostCard: FC<IPostCardProps> = ({ item }) => {
  const content = JSON.parse(item.content);
  const thumbnail = content.blocks.find((block: any) => block.type === 'image');
  const paragraph = content.blocks.find(
    (block: any) => block.type === 'paragraph'
  );

  const navigate = useNavigate();

  return (
    <UnstyledButton key={item.id} onClick={() => navigate(`/post/${item.id}`)}>
      <Card>
        <Grid>
          <Grid.Col span={thumbnail ? 8 : 12}>
            <Stack>
              <ProfileBadge
                avatarSize="sm"
                profile={item.creator}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/profile/${item.creator.email}`);
                }}
              />
              <Stack gap={0}>
                <Title order={4} lineClamp={2}>
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
                lineClamp={2}
                dangerouslySetInnerHTML={{
                  __html: paragraph?.data.text
                }}
              ></Text>
              <Group gap={6}>
                {item.tags.map((tag: string) => (
                  <Badge>{tag}</Badge>
                ))}
              </Group>
            </Stack>
          </Grid.Col>
          {thumbnail && (
            <Grid.Col flex={1} display="flex" span={4}>
              <Image
                radius="sm"
                mah={120}
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
      </Card>
    </UnstyledButton>
  );
};

export default PostCard;
