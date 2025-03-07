import { FC, Fragment, useCallback, useState } from 'react';
import { Modal, Stack, Slider, Text, Group, Button } from '@mantine/core';
import Cropper from 'react-easy-crop';

interface ImageCropModalProps {
  type: 'avatar' | 'cover';
  imgFile: string | null;
  onSave: (img: string) => void;
  onClose: () => void;
}

const ImageCropModal: FC<ImageCropModalProps> = ({
  imgFile,
  onSave,
  onClose
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [cropArea, setCropArea] = useState<any>(null);

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCropArea(croppedAreaPixels);
  }, []);

  return (
    <Modal
      opened={!!imgFile}
      centered
      size="40%"
      title={`Customize ${imgFile ? 'Avatar' : 'Cover'}`}
      onClose={onClose}
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
            image={imgFile || undefined}
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
        <Group gap={6} mt="lg">
          <Button onClick={() => onSave(cropArea)}>Save Avatar</Button>
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default ImageCropModal;
