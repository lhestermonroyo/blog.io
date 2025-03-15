import { FC } from 'react';
import { Avatar, Group, Text, UnstyledButton } from '@mantine/core';

import { TProfileBadge } from '../../../types';

type ProfileBadgeProps = {
  profile: TProfileBadge;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  avatarSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

const ProfileBadge: FC<ProfileBadgeProps> = ({
  profile,
  onClick,
  avatarSize = 'md'
}) => {
  return (
    <Group gap={6}>
      <Avatar
        src={profile?.avatar}
        alt={profile?.firstName}
        name={`${profile?.firstName} ${profile?.lastName}`}
        radius="xl"
        color="initials"
        size={avatarSize}
      />
      <UnstyledButton onClick={onClick}>
        <Text fw={500} size="sm" mx={2}>
          {`${profile?.firstName} ${profile?.lastName}`}
        </Text>
      </UnstyledButton>
    </Group>
  );
};

export default ProfileBadge;
