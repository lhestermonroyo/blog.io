import { FC, Fragment, useState } from 'react';
import {
  Avatar,
  FileButton,
  UnstyledButton,
  Group,
  Box,
  Text,
  Image
} from '@mantine/core';
import { IconPhoto, IconUser } from '@tabler/icons-react';
import ImageCropModal from '../image-crop-modal';
import { readFile } from '../../utils/upload.util';

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
            {coverUri ? (
              <Image src={coverUri} alt="cover-photo" width="100%" />
            ) : (
              <Box
                w="100%"
                h={300}
                display="flex"
                className="upload-cover-default"
              >
                <Group>
                  <IconPhoto size={64} />
                  <Text>Select your cover photo</Text>
                </Group>
              </Box>
            )}
          </UnstyledButton>
        )}
      </FileButton>
    </Fragment>
  );
};

export default UploadCover;
