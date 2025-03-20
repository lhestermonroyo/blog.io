import { Button, Group, Modal, MultiSelect, Stack, Title } from '@mantine/core';
import { FC, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import states from '../../../states';
import { useForm } from '@mantine/form';
import { TPostState } from '../../../../types';
import { notifications } from '@mantine/notifications';

type FiltersModalProps = {
  opened: boolean;
  onClose: () => void;
};

const FiltersModal: FC<FiltersModalProps> = ({ opened, onClose }) => {
  const form = useForm({
    initialValues: {
      tags: [] as string[]
    },
    validate: {
      tags: (value) =>
        !value.length ? 'Select atleast 1 topic/tag to filter' : null
    },
    mode: 'uncontrolled',
    validateInputOnBlur: true
  });

  const [post, setPost] = useRecoilState(states.post);
  const auth = useRecoilValue(states.auth);
  const { filters } = post.feed.forYou;
  const { profile } = auth;

  useEffect(() => {
    if (opened) {
      form.setValues({
        tags: filters
      });
    }
  }, [opened]);

  const handleSubmit = (values: typeof form.values) => {
    setPost((prev: TPostState) => ({
      ...prev,
      feed: {
        ...prev.feed,
        forYou: {
          ...prev.feed.forYou,
          filters: values.tags
        }
      }
    }));
    notifications.show({
      title: 'Success',
      message: 'Filters has been applied successfully.',
      color: 'green',
      position: 'top-center'
    });
    onClose();
  };

  const clearFilters = () => {
    form.setValues({
      tags: []
    });
    setPost((prev: TPostState) => ({
      ...prev,
      feed: {
        ...prev.feed,
        forYou: {
          ...prev.feed.forYou,
          filters: []
        }
      }
    }));
    notifications.show({
      title: 'Success',
      message: 'Filters has been cleared successfully.',
      color: 'green',
      position: 'top-center'
    });
    onClose();
  };

  return (
    <Modal
      opened={opened}
      centered
      size={800}
      title="Filter Posts"
      onClose={onClose}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="lg">
          <Title order={4}>
            Select your preferred topics to filter your feed.
          </Title>
          <MultiSelect
            label="Select Topics/tags"
            placeholder="Select topics/tags to filter"
            data={profile?.tags}
            searchable
            clearable
            checkIconPosition="right"
            key={form.key('tags')}
            {...form.getInputProps('tags')}
          />
        </Stack>

        <Group gap={6} mt="lg">
          <Button type="submit" value="filled">
            Save Filters
          </Button>
          {filters.length && (
            <Button value="filled" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default FiltersModal;
