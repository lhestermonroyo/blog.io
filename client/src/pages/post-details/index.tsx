import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useMutation, useQuery } from '@apollo/client';
import {
  ActionIcon,
  Badge,
  Blockquote,
  Button,
  Code,
  Divider,
  Grid,
  Group,
  Image,
  List,
  Menu,
  Stack,
  Table,
  Text,
  Textarea,
  Title,
  useMantineTheme
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useMediaQuery } from '@mantine/hooks';
import {
  IconArrowLeft,
  IconClock,
  IconDotsVertical,
  IconEdit,
  IconTrash
} from '@tabler/icons-react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { format } from 'date-fns';

import { GET_POST_BY_ID } from '../../graphql/queries';
import {
  DELETE_POST,
  CREATE_COMMENT,
  LIKE_POST,
  SAVE_POST
} from '../../graphql/mutations';

import states from '../../states';
import { deleteBlogFiles } from '../../utils/upload.util';
import { TCommentItem, TPostDetails, TPostState } from '../../../types';

import MainLayout from '../../layouts/main';
import LoadingPost from '../../components/post-details/loading-post';
import ProfileBadge from '../../components/profile-badge';
import PostReaction from '../../components/post-details/post-reaction';
import CommentCard from '../../components/post-details/comment-card';
import PostSidebar from '../../components/post-details/post-sidebar';
import ExpandableImage from '../../components/expandable-image';

const PostDetails = () => {
  const [submitting, setSubmitting] = useState(false);

  const commentRef = useRef<HTMLTextAreaElement>(null);

  const [post, setPost] = useRecoilState(states.post);
  const auth = useRecoilValue(states.auth);
  const { postDetails } = post;

  const form = useForm({
    initialValues: {
      comment: ''
    },
    validate: {
      comment: (value) => (!value.length ? 'Comment must not be empty' : null)
    },
    mode: 'uncontrolled'
  });

  const isLg = useMediaQuery('(max-width: 1200px)');

  const theme = useMantineTheme();
  const params = useParams();
  const navigate = useNavigate();

  const { data, loading, error, refetch } = useQuery(GET_POST_BY_ID, {
    variables: {
      postId: params.id
    },
    fetchPolicy: 'network-only'
  });

  const [deletePost] = useMutation(DELETE_POST);
  const [likePost] = useMutation(LIKE_POST);
  const [savePost] = useMutation(SAVE_POST);
  const [createComment] = useMutation(CREATE_COMMENT);

  useEffect(() => {
    window.addEventListener('scroll', stickyListener);

    return () => {
      window.removeEventListener('scroll', stickyListener);
    };
  });

  useEffect(() => {
    refetch();
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (data) {
      const key = Object.keys(data)[0];
      const postDetails = data[key];

      setPost((prev: TPostState) => ({
        ...prev,
        postDetails
      }));
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      console.log('Error:', error);
      navigate('/');
    }
  }, [error]);

  const stickyListener = () => {
    const extras = document.querySelector('.sidebar-container');
    const scrollTop = window.scrollY;

    if (extras) {
      if (scrollTop >= 25) {
        extras.classList.add('is-sticky');
      } else {
        extras.classList.remove('is-sticky');
      }
    }
  };

  const handleDeletePost = async () => {
    try {
      const content = JSON.parse(postDetails?.content as string);
      const files = content.blocks.filter(
        (block: any) => block.type === 'image'
      );

      const response = await deletePost({
        variables: {
          postId: params.id
        }
      });
      const key = Object.keys(response.data)[0];
      const data = response.data[key];

      if (data.success) {
        await deleteBlogFiles(files);

        notifications.show({
          title: 'Success',
          message: 'Your post has been deleted successfully.',
          color: 'teal',
          position: 'top-center'
        });
        modals.close('delete-post');
        navigate('/');
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'An error occurred while deleting the post.',
        color: 'red',
        position: 'top-center'
      });
    }
  };

  const handleLike = async () => {
    try {
      const response = await likePost({
        variables: {
          postId: params.id
        }
      });
      const key = Object.keys(response.data)[0];
      const data = response.data[key];

      if (data) {
        setPost((prev: TPostState) => ({
          ...prev,
          postDetails: {
            ...(prev.postDetails as TPostDetails),
            likes: data.likes,
            likeCount: data.likeCount
          }
        }));
      }
    } catch (error) {
      console.log('Error:', error);
      notifications.show({
        title: 'Error',
        message: 'An error occurred while liking the post.',
        color: 'red',
        position: 'top-center'
      });
    }
  };

  const handleSubmitComment = async (values: typeof form.values) => {
    try {
      setSubmitting(true);

      const response = await createComment({
        variables: {
          postId: params.id,
          body: values.comment
        }
      });
      const key = Object.keys(response.data)[0];
      const data = response.data[key];

      if (data) {
        setPost((prev) => ({
          ...prev,
          postDetails: {
            ...(prev.postDetails as TPostDetails),
            comments: data.comments,
            commentCount: data.commentCount
          }
        }));
        form.reset();
        commentRef.current?.blur();
        notifications.show({
          title: 'Success',
          message: 'Your comment has been submitted successfully.',
          color: 'teal',
          position: 'top-center'
        });
      }
    } catch (error) {
      console.log('Error:', error);
      notifications.show({
        title: 'Error',
        message: 'An error occurred while submitting the comment.',
        color: 'red',
        position: 'top-center'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSavePost = async () => {
    try {
      const response = await savePost({
        variables: {
          postId: params.id
        }
      });
      const key = Object.keys(response.data)[0];
      const data = response.data[key];

      if (data) {
        setPost((prev: TPostState) => ({
          ...prev,
          postDetails: {
            ...(prev.postDetails as TPostDetails),
            saveCount: data.saveCount,
            saves: data.saves
          }
        }));
      }
    } catch (error) {
      console.log('Error:', error);
      notifications.show({
        title: 'Error',
        message: 'An error occurred while saving the post.',
        color: 'red',
        position: 'top-center'
      });
    }
  };

  const showDeleteModal = () =>
    modals.openConfirmModal({
      id: 'delete-post',
      withCloseButton: false,
      title: 'Delete Post',
      children: (
        <Text size="sm">
          Are you sure you want to delete this post? This action cannot be
          undone.
        </Text>
      ),
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onConfirm: () => handleDeletePost()
    });

  const profileEmail = auth?.profile?.email as string;

  const isOwnPost = useMemo(() => {
    return postDetails?.creator.email === profileEmail;
  }, [postDetails?.creator.email, profileEmail]);

  const content = postDetails && JSON.parse(postDetails?.content);

  return (
    <MainLayout>
      <Grid gutter="xl">
        <Grid.Col span={!isLg ? 8 : 12}>
          <Stack gap="lg">
            <Group justify="space-between" align="center">
              <Button
                variant="default"
                leftSection={<IconArrowLeft size={16} />}
                onClick={() => navigate('/')}
              >
                Back
              </Button>

              {isOwnPost && (
                <Menu
                  width={120}
                  position="bottom-end"
                  transitionProps={{ transition: 'pop-top-right' }}
                  withinPortal
                >
                  <Menu.Target>
                    <ActionIcon variant="transparent" color="dimmed">
                      <IconDotsVertical />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      leftSection={<IconEdit size={16} stroke={1.5} />}
                      onClick={() => navigate(`/edit-post/${params.id}`)}
                    >
                      Edit
                    </Menu.Item>
                    <Menu.Divider />

                    <Menu.Item
                      leftSection={
                        <IconTrash
                          size={16}
                          color={theme.colors.red[6]}
                          stroke={1.5}
                        />
                      }
                      onClick={showDeleteModal}
                    >
                      Delete
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              )}
            </Group>
            <LoadingPost loading={loading}>
              {postDetails && (
                <Fragment>
                  <Stack gap={4}>
                    <Title order={1}>{postDetails?.title}</Title>
                    <Group gap={4} align="center">
                      <IconClock size={14} />
                      <Text fz="xs" c="dimmed">
                        {format(
                          new Date(postDetails?.createdAt),
                          'MMMM dd - hh:mm a'
                        )}
                      </Text>
                    </Group>
                  </Stack>

                  <Stack gap="xs">
                    <Group align="center" justify="space-between">
                      <Group gap={6}>
                        <ProfileBadge profile={postDetails?.creator} />
                      </Group>
                      <PostReaction
                        post={postDetails}
                        onLike={handleLike}
                        onComment={() => commentRef.current?.focus()}
                        onSave={handleSavePost}
                      />
                    </Group>
                    <Divider />
                  </Stack>

                  <Stack flex={1} w="100%">
                    {content.blocks.map((block: any) => {
                      switch (block.type) {
                        case 'paragraph':
                          return (
                            <Text
                              key={block.id}
                              dangerouslySetInnerHTML={{
                                __html: block.data.text
                              }}
                            />
                          );
                        case 'header':
                          return (
                            <Title
                              key={block.id}
                              order={block.data.level + 1}
                              dangerouslySetInnerHTML={{
                                __html: block.data.text
                              }}
                            />
                          );
                        case 'list':
                          return (
                            <List
                              w="100%"
                              withPadding
                              key={block.id}
                              type={block.data.style}
                            >
                              {block.data.items.map(
                                (item: any, index: number) => (
                                  <List.Item key={index}>
                                    <span
                                      dangerouslySetInnerHTML={{
                                        __html: item.content
                                      }}
                                    />
                                  </List.Item>
                                )
                              )}
                            </List>
                          );
                        case 'quote':
                          return (
                            <Blockquote
                              color="green"
                              key={block.id}
                              cite={block.data.caption}
                              mt="xl"
                            >
                              {block.data.text}
                            </Blockquote>
                          );
                        case 'code':
                          return (
                            <Code key={block.id} block>
                              {block.data.code}
                            </Code>
                          );
                        case 'table':
                          const withHeadings = block.data.withHeadings;
                          const rows = withHeadings
                            ? block.data.content.slice(1)
                            : block.data.content;

                          return (
                            <Stack
                              w="100%"
                              style={{
                                overflowX: 'auto'
                              }}
                              key={block.id}
                            >
                              <Table
                                withTableBorder
                                withColumnBorders
                                w="100%"
                                layout="auto"
                              >
                                {withHeadings && (
                                  <Table.Thead>
                                    <Table.Tr>
                                      {block.data.content[0].map(
                                        (heading: string, index: number) => (
                                          <Table.Th key={index}>
                                            {heading}
                                          </Table.Th>
                                        )
                                      )}
                                    </Table.Tr>
                                  </Table.Thead>
                                )}
                                <Table.Tbody>
                                  {rows.map((row: any, index: number) => (
                                    <Table.Tr key={index}>
                                      {row.map(
                                        (cell: string, index: number) => (
                                          <Table.Td key={index}>
                                            {cell}
                                          </Table.Td>
                                        )
                                      )}
                                    </Table.Tr>
                                  ))}
                                </Table.Tbody>
                              </Table>
                            </Stack>
                          );
                        case 'image':
                          if (block.data.withBackground) {
                            return (
                              <Group
                                justify="center"
                                bg="dimmed"
                                key={block.id}
                                style={{
                                  borderRadius: theme.radius.sm
                                }}
                              >
                                <ExpandableImage src={block.data.file.url}>
                                  <Image
                                    fit="contain"
                                    w="100%"
                                    h="auto"
                                    src={block.data.file.url}
                                    alt={block.data.caption}
                                  />
                                </ExpandableImage>
                                <Text>{block.data.caption}</Text>
                              </Group>
                            );
                          }

                          return (
                            <ExpandableImage src={block.data.file.url}>
                              <Image
                                radius="sm"
                                key={block.id}
                                src={block.data.file.url}
                                alt={block.data.caption}
                              />
                            </ExpandableImage>
                          );
                        default:
                          return (
                            <Text
                              key={block.id}
                              dangerouslySetInnerHTML={{
                                __html: block.data
                              }}
                            />
                          );
                      }
                    })}
                  </Stack>

                  <Group gap={6} mb="lg">
                    {postDetails.tags.map((tag: string) => (
                      <Badge
                        key={tag}
                        variant="light"
                        style={{
                          cursor: 'pointer'
                        }}
                        component="button"
                        onClick={() => navigate(`/tag/${tag}`)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </Group>

                  <Stack gap="xs">
                    <Divider />
                    <PostReaction
                      post={postDetails}
                      onLike={handleLike}
                      onComment={() => commentRef.current?.focus()}
                      onSave={handleSavePost}
                    />
                  </Stack>

                  {auth.isAuth && auth.profile ? (
                    <Fragment>
                      <Title order={2}>
                        Comments ({postDetails.commentCount})
                      </Title>

                      <form onSubmit={form.onSubmit(handleSubmitComment)}>
                        <Stack>
                          <Textarea
                            ref={commentRef}
                            label="Comment"
                            placeholder="Enter your comment"
                            name="comment"
                            key={form.key('comment')}
                            {...form.getInputProps('comment')}
                          />
                          <Group>
                            <Button type="submit" loading={submitting}>
                              Submit
                            </Button>
                          </Group>
                        </Stack>
                      </form>

                      {postDetails.comments.length > 0 ? (
                        <Stack gap="lg" my="xl">
                          {postDetails.comments.map(
                            (comment: TCommentItem, index: number) => (
                              <CommentCard
                                key={comment.id}
                                comment={comment}
                                isLastComment={
                                  postDetails.comments.length === index + 1
                                }
                                isOwnComment={
                                  comment.commentor.email === profileEmail
                                }
                              />
                            )
                          )}
                        </Stack>
                      ) : (
                        <Text c="dimmed">No comments yet.</Text>
                      )}
                    </Fragment>
                  ) : (
                    <Text c="dimmed">
                      You must be logged in to comment on this post.
                    </Text>
                  )}
                </Fragment>
              )}
            </LoadingPost>
          </Stack>
        </Grid.Col>
        <Grid.Col span={!isLg ? 4 : 12}>
          {postDetails && <PostSidebar />}
        </Grid.Col>
      </Grid>
    </MainLayout>
  );
};

export default PostDetails;
