import { Box, Image } from 'native-base';
import React, { FC } from 'react';

interface ICoverPhotoProps {
  uri: string | null;
}

const CoverPhoto: FC<ICoverPhotoProps> = ({ uri }) => {
  const renderCoverPhoto = () => {
    if (!uri) {
      const coverPlaceholder = require('../../../assets/cover-placeholder.png');

      return (
        <Image
          resizeMode="cover"
          style={{
            width: '100%',
            height: '100%',
          }}
          source={coverPlaceholder}
        />
      );
    }

    return (
      <Image
        resizeMode="cover"
        style={{
          width: '100%',
          height: '100%',
        }}
        source={{
          uri,
        }}
      />
    );
  };

  return (
    <Box
      borderWidth={1}
      borderColor="gray.200"
      backgroundColor="amber.800"
      justifyContent="center"
      alignItems="center"
      overflow="hidden"
      style={{
        aspectRatio: 16 / 9,
      }}
    >
      {renderCoverPhoto()}
    </Box>
  );
};

export default CoverPhoto;
