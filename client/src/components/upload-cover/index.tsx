import { FC, Fragment, useState } from 'react';
import { Avatar, FileButton, UnstyledButton, Group, Text } from '@mantine/core';
import { IconPhoto } from '@tabler/icons-react';

import { readFile } from '../../utils/upload.util';

import ImageCropModal from '../image-crop-modal';

interface UploadCoverProps {
  coverUri: string;
  onSelect: (base64Str: string) => void;
}

const UploadCover: FC<UploadCoverProps> = ({ coverUri, onSelect }) => {
  const [file, setFile] = useState<any>(null);

  const handleFile = async (file: any) => {
    const imgFile = await readFile(file);
    setFile(imgFile);
  };

  return (
    <Fragment>
      <ImageCropModal
        type="Cover"
        imgFile={file}
        onConfirmSelect={onSelect}
        onClose={() => setFile(null)}
      />
      <FileButton onChange={handleFile} accept="image/png,image/jpeg,image/jpg">
        {(props) => (
          <UnstyledButton {...props} className="button-upload">
            <Avatar
              src={coverUri}
              alt="upload-avatar"
              radius="none"
              color="initials"
              w="100%"
              h="100%"
              style={{
                alignSelf: 'center',
                aspectRatio: '16/9'
              }}
            >
              <Group>
                <IconPhoto size={64} />
                <Text>Select your cover photo</Text>
              </Group>
            </Avatar>
          </UnstyledButton>
        )}
      </FileButton>
    </Fragment>
  );
};

export default UploadCover;
