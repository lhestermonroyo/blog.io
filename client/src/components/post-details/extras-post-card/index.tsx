import { FC, Fragment } from 'react';
import {
  Badge,
  Divider,
  Grid,
  Group,
  Stack,
  Text,
  Title,
  UnstyledButton
} from '@mantine/core';
import { IconClock } from '@tabler/icons-react';
import { useNavigate } from 'react-router';
import { format } from 'date-fns';

import ProfileBadge from '../../profile-badge';

interface IExtrasPostCardProps {
  item: any;
  isLastPost: boolean;
  displayProfile?: boolean;
}

const ExtrasPostCard: FC<IExtrasPostCardProps> = ({
  item,
  isLastPost,
  displayProfile = true
}) => {
  const navigate = useNavigate();

  return (
    <Fragment>
      <UnstyledButton
        key={item.id}
        onClick={() => navigate(`/post/${item.id}`)}
      >
        <Stack gap="xs">
          {displayProfile && (
            <ProfileBadge
              avatarSize="sm"
              profile={item.creator}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/profile/${item.creator.email}`);
              }}
            />
          )}
          <Stack gap={0}>
            <Title order={5} lineClamp={2}>
              {item.title}
            </Title>
            <Group gap={4} align="center">
              <IconClock size={14} />
              <Text fz="xs" c="dimmed">
                {format(new Date(item.createdAt), 'MMMM dd - hh:mm a')}
              </Text>
            </Group>
          </Stack>
          <Group gap={6}>
            {item.tags.map((tag: string) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </Group>
        </Stack>
      </UnstyledButton>
      {!isLastPost && <Divider />}
    </Fragment>
  );
};

export default ExtrasPostCard;
