import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  Button,
  Group,
  Paper,
  Stack,
  TagsInput,
  Text,
  TextInput,
  Title,
  useMantineColorScheme
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import cx from 'clsx';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Table from '@editorjs/table';
import ImageTool from '@editorjs/image';
import CodeTool from '@editorjs/code';
import Quote from '@editorjs/quote';
import { useMutation, useQuery } from '@apollo/client';

import { UPDATE_POST } from '../../graphql/mutations';
import { isBase64, uploadBlogFiles } from '../../utils/upload.util';

import ProtectedLayout from '../../layouts/protected';
import classes from './style.module.css';
import { GET_POST_BY_ID } from '../../graphql/queries';
import { IconArrowLeft } from '@tabler/icons-react';

const EditPost = () => {
  const [submitting, setSubmitting] = useState(false);
  const form = useForm({
    initialValues: {
      title: '',
      tags: [],
      content: null
    },
    validate: {
      title: (value) => (!value.length ? 'Title must not be empty' : null),
      tags: (value) => (!value.length ? 'Tags must not be empty' : null),
      content: (value) => (!value ? 'Content must not be empty' : null)
    },
    mode: 'uncontrolled',
    validateInputOnBlur: true
  });

  const ejInstance = useRef<EditorJS | null>(null);
  const editorRef = useRef(null);

  const colorScheme = useMantineColorScheme();
  const isDark = colorScheme.colorScheme === 'dark';

  const [updatePost] = useMutation(UPDATE_POST);

  const params = useParams();
  const navigate = useNavigate();

  const { data, loading, error } = useQuery(GET_POST_BY_ID, {
    variables: {
      postId: params.id
    }
  });

  useEffect(() => {
    if (error) {
      console.log('Error:', error);
      navigate('/');
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      const key = Object.keys(data)[0];
      const post = data[key];

      form.setValues({
        title: post.title,
        tags: post.tags,
        content: JSON.parse(post.content)
      });
    }
  }, [data]);

  useEffect(() => {
    if (!ejInstance.current && editorRef.current) {
      initEditor();
    }

    return () => {
      if (ejInstance.current) {
        ejInstance.current.destroy();
        ejInstance.current = null;
      }
    };
  }, []);

  const initEditor = () => {
    const editor = new EditorJS({
      data: form.getValues().content ?? {
        time: Date.now(),
        blocks: []
      },
      holder: editorRef.current || undefined,
      placeholder: 'Compose something...',
      defaultBlock: 'paragraph',
      inlineToolbar: true,
      tools: {
        header: Header,
        list: List,
        table: Table,
        code: CodeTool,
        quote: Quote,
        image: {
          class: ImageTool,
          config: {
            uploader: {
              uploadByFile: async (file: any) => {
                return new Promise((resolve, reject) => {
                  const reader = new FileReader();
                  reader.onload = () => {
                    resolve({
                      success: 1,
                      file: {
                        url: reader.result // Base64 encoded image
                      }
                    });
                  };
                  reader.onerror = reject;
                  reader.readAsDataURL(file);
                });
              }
            }
          }
        }
      },
      onReady: () => {
        ejInstance.current = editor;
      },
      onChange: async () => {
        editor.saver.save().then((outputData: any) => {
          form.setFieldValue('content', outputData);
        });
      }
    });
  };

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setSubmitting(true);

      const { title, tags, content } = values as any;

      // Upload base64 images only
      const uploadFiles = content.blocks.filter(
        (block: any) => block.type === 'image' && isBase64(block.data.file.url)
      );

      const fileUrls = await uploadBlogFiles(uploadFiles);
      content.blocks = content.blocks.map((block: any) => {
        fileUrls.forEach((file: any) => {
          if (block.id === file.id) {
            block.data.file.url = file.url;
          }
        });
        return block;
      });

      const response = await updatePost({
        variables: {
          postId: params.id,
          postInput: {
            title,
            tags,
            content: JSON.stringify(content)
          }
        }
      });
      const key = Object.keys(response.data)[0];
      const data = response.data[key];

      if (data) {
        notifications.show({
          title: 'Success',
          message: 'Your post has been updated successfully.',
          color: 'green',
          position: 'top-center'
        });
        navigate(`/post/${data.id}`);
      }
    } catch (error) {
      console.log('Error:', error);
      notifications.show({
        title: 'Error',
        message: 'An error occurred. Please try again.',
        color: 'red',
        position: 'top-center'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return null;

  return (
    <ProtectedLayout>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack display="flex" justify="stretch" gap="lg">
          <Group>
            <Button
              leftSection={<IconArrowLeft size={16} />}
              onClick={() => navigate(`/post/${params.id}`)}
            >
              Back
            </Button>
          </Group>
          <Group justify="space-between" align="center">
            <Title order={1}>Edit Post</Title>
            <Button loading={submitting} type="submit">
              Save Changes
            </Button>
          </Group>
          <TextInput
            variant="filled"
            label="Title"
            placeholder="Enter your title"
            name="title"
            key={form.key('title')}
            {...form.getInputProps('title')}
          />
          <TagsInput
            variant="filled"
            label="Tags"
            name="tags"
            placeholder="Enter your tags"
            clearable
            key={form.key('tags')}
            {...form.getInputProps('tags')}
          />
          <Stack gap={2}>
            <Paper
              p={6}
              flex={1}
              className={cx(classes.editor, {
                [classes.dark]: isDark,
                [classes.error]: form.errors.content
              })}
              ref={editorRef}
            />
            {form.errors.content && (
              <Text color="red" fz="xs">
                {form.errors.content}
              </Text>
            )}
          </Stack>
        </Stack>
      </form>
    </ProtectedLayout>
  );
};

export default EditPost;
