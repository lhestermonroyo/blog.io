import { FC, Fragment, useState } from 'react';
import {
  Avatar,
  FileButton,
  UnstyledButton,
  Group,
  Stack,
  Text
} from '@mantine/core';
import { IconUser } from '@tabler/icons-react';
import ImageCropModal from '../image-crop-modal';
import { readFile } from '../../utils/upload.util';

interface UploadAvatarProps {
  avatarUri: string;
  onSelect: (base64Str: string) => void;
}

const UploadAvatar: FC<UploadAvatarProps> = ({ avatarUri, onSelect }) => {
  const [file, setFile] = useState<any>(null);

  const handleFile = async (file: any) => {
    const imgFile = await readFile(file);
    setFile(imgFile);
  };

  return (
    <Fragment>
      <ImageCropModal
        type="Avatar"
        imgFile={file}
        onConfirmSelect={onSelect}
        onClose={() => setFile(null)}
      />
      <Group>
        <FileButton
          onChange={handleFile}
          accept="image/png,image/jpeg,image/jpg"
        >
          {(props) => (
            <UnstyledButton {...props} className="button-upload">
              <Avatar
                src={avatarUri}
                alt="upload-avatar"
                radius="none"
                color="initials"
                size={150}
              >
                <Stack gap={0} justify="center" align="center">
                  <IconUser size={64} />
                  <Text ta="center">Select Avatar</Text>
                </Stack>
              </Avatar>
            </UnstyledButton>
          )}
        </FileButton>
      </Group>
    </Fragment>
  );
};

export default UploadAvatar;
