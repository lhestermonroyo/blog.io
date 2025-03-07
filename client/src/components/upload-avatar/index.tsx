import { FC, Fragment, useCallback, useState } from 'react';
import {
  Avatar,
  FileButton,
  Modal,
  Stack,
  UnstyledButton,
  Slider,
  Text,
  Group,
  Button
} from '@mantine/core';
import { IconUser } from '@tabler/icons-react';
import Cropper from 'react-easy-crop';

interface UploadAvatarProps {
  avatarUri: string;
}

const readFile = (file: any) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
};

const UploadAvatar: FC<UploadAvatarProps> = ({ avatarUri }) => {
  const [file, setFile] = useState<any>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [cropArea, setCropArea] = useState<any>(null);

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCropArea(croppedAreaPixels);
  }, []);

  const handleFile = async (file: any) => {
    const imgFile = await readFile(file);
    setFile(imgFile);
  };

  return (
    <Fragment>
      <Modal
        opened={file}
        centered
        size="40%"
        title="Customize Avatar"
        onClose={() => setFile(null)}
      >
        <Stack gap="lg">
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: 500,
              backgroundColor: '#f9f9f9'
            }}
          >
            <Cropper
              image={file}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={1 / 1}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <Group gap="lg">
            <Stack gap={6} flex={1}>
              <Text>Zoom</Text>
              <Slider
                value={zoom}
                min={1}
                max={3}
                label={(value) => value.toFixed(1)}
                step={0.1}
                styles={{ markLabel: { display: 'none' } }}
                onChange={(zoom) => setZoom(zoom)}
              />
            </Stack>
            <Stack gap={6} flex={1}>
              <Text>Rotation</Text>
              <Slider
                label={(value) => value.toFixed(1)}
                value={rotation}
                min={0}
                max={360}
                step={0}
                styles={{ markLabel: { display: 'none' } }}
                onChange={(rotation) => setRotation(rotation)}
              />
            </Stack>
          </Group>
          <Group gap={6}>
            <Button onClick={() => setFile(null)}>Save Avatar</Button>
            <Button variant="default" onClick={() => setFile(null)}>
              Cancel
            </Button>
          </Group>
        </Stack>
      </Modal>
      <FileButton onChange={handleFile} accept="image/png,image/jpeg,image/jpg">
        {(props) => (
          <UnstyledButton {...props} className="upload-avatar">
            <Avatar
              src={avatarUri}
              alt="upload-avatar"
              radius="md"
              color="initials"
              size={120}
            >
              <IconUser size={64} />
            </Avatar>
          </UnstyledButton>
        )}
      </FileButton>
    </Fragment>
  );
};

export default UploadAvatar;
