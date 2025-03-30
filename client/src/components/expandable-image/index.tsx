import React, { FC, Fragment } from 'react';
import {
  CloseButton,
  Group,
  Image,
  Modal,
  UnstyledButton
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

type ExpandableImageProps = {
  src: string;
  children: React.ReactNode;
};

const ExpandableImage: FC<ExpandableImageProps> = ({ src, children }) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Fragment>
      <Modal
        padding={0}
        size="auto"
        centered
        withCloseButton={false}
        opened={opened}
        onClose={close}
        pos="relative"
      >
        <CloseButton
          size="xl"
          variant="transparent"
          onClick={close}
          pos="absolute"
          right={0}
        />
        <Group p={0} justify="center">
          <Image src={src} alt="Image" w="100%" fit="cover" />
        </Group>
      </Modal>
      <UnstyledButton component="span" onClick={open}>
        {children}
      </UnstyledButton>
    </Fragment>
  );
};

export default ExpandableImage;
