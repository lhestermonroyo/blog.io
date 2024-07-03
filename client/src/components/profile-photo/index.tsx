import React, { FC } from 'react';
import { Avatar } from 'native-base';

interface IProfilePhotoProps {
  uri: string | null;
  initials: string;
  size?: '2xl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs';
  otherProps?: any;
}

const ProfilePhoto: FC<IProfilePhotoProps> = ({
  uri,
  initials,
  size = 'md',
  otherProps,
}) => {
  return (
    <Avatar
      source={{
        uri,
      }}
      size={size}
      backgroundColor="warning.400"
      {...otherProps}
    >
      {initials.toUpperCase()}
    </Avatar>
  );
};

export default ProfilePhoto;
