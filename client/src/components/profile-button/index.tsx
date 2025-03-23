import { FC } from 'react';
import { useNavigate } from 'react-router';
import { Avatar, Group, Stack, Text, UnstyledButton } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { useRecoilValue } from 'recoil';

import states from '../../states';

import { TProfileBadge } from '../../../types';
import classes from './style.module.css';

type ProfileBadgeProps = {
  profile: TProfileBadge;
  avatarSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

const ProfileButton: FC<ProfileBadgeProps> = ({
  profile,
  avatarSize = 'md'
}) => {
  const auth = useRecoilValue(states.auth);

  const ownProfile = auth?.profile?.id === profile?.id;

  const navigate = useNavigate();

  const handleNavigate = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    navigate(`/profile/${profile?.email}`);
  };

  return (
    <UnstyledButton onClick={handleNavigate} className={classes.user} py="md">
      <Group gap={6}>
        <Avatar
          src={profile?.avatar}
          alt={profile?.firstName}
          name={`${profile?.firstName} ${profile?.lastName}`}
          radius="xl"
          color="initials"
          size={avatarSize}
        />
        <Stack gap={2} flex={1}>
          <Text fw={500} mx={2}>
            {`${profile?.firstName} ${profile?.lastName}`}{' '}
            {ownProfile && '(You)'}
          </Text>
          <Text size="sm" mx={2} color="dimmed">
            {profile?.email}
          </Text>
        </Stack>

        <IconChevronRight size={24} />
      </Group>
    </UnstyledButton>
  );
};

export default ProfileButton;
