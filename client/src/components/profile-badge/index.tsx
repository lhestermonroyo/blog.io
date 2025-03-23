import { FC } from 'react';
import { useNavigate } from 'react-router';
import { Avatar, Group, Text, UnstyledButton } from '@mantine/core';

import { TProfileBadge } from '../../../types';

type ProfileBadgeProps = {
  profile: TProfileBadge;
  avatarSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

const ProfileBadge: FC<ProfileBadgeProps> = ({
  profile,
  avatarSize = 'md'
}) => {
  const navigate = useNavigate();

  const handleNavigate = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    navigate(`/profile/${profile?.email}`);
  };

  return (
    <UnstyledButton className="profile-badge-name" onClick={handleNavigate}>
      <Group gap={6}>
        <Avatar
          src={profile?.avatar}
          alt={profile?.firstName}
          name={`${profile?.firstName} ${profile?.lastName}`}
          radius="xl"
          color="initials"
          size={avatarSize}
        />
        <Text fw={500} size="sm" mx={2}>
          {`${profile?.firstName} ${profile?.lastName}`}
        </Text>
      </Group>
    </UnstyledButton>
  );
};

export default ProfileBadge;
