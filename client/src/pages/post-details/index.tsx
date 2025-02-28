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
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  IconArrowLeft,
  IconClock,
  IconDotsVertical,
  IconEdit,
  IconTrash
} from '@tabler/icons-react';
import { useRecoilValue } from 'recoil';
import { format } from 'date-fns';

import { GET_POST_BY_ID } from '../../graphql/queries';
import {
  CREATE_COMMENT,
  DELETE_COMMENT,
  LIKE_POST,
  UPDATE_COMMENT
} from '../../graphql/mutations';
import states from '../../states';

import ProtectedLayout from '../../layouts/protected';
import LoadingPost from '../../components/post-details/loading-post';
import ProfileBadge from '../../components/profile-badge';
import PostReaction from '../../components/post-details/post-reaction';
import CommentCard from '../../components/post-details/comment-card';

const PostDetails = () => {
  const [postDetails, setPostDetails] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const commentRef = useRef<HTMLTextAreaElement>(null);

  const auth = useRecoilValue(states.auth);

  const form = useForm({
    initialValues: {
      comment: ''
    },
    validate: {
      comment: (value) => (!value.length ? 'Comment must not be empty' : null)
    },
    mode: 'uncontrolled'
  });

  const theme = useMantineTheme();
  const params = useParams();
  const navigate = useNavigate();

  const { data, loading, error } = useQuery(GET_POST_BY_ID, {
    variables: {
      postId: params.id
    }
  });
  const [likePost] = useMutation(LIKE_POST);
  const [createComment] = useMutation(CREATE_COMMENT);
  const [updateComment] = useMutation(UPDATE_COMMENT);
  const [deleteComment] = useMutation(DELETE_COMMENT);

  useEffect(() => {
    if (data) {
      const key = Object.keys(data)[0];
      const post = data[key];

      setPostDetails(post);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      console.log('Error:', error);
      navigate('/');
    }
  }, [error]);

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
        setPostDetails(data);
      }
    } catch (error) {
      console.log('Error:', error);
      notifications.show({
        title: 'Like/Unlike Post failed',
        message: 'An error occurred. Please try again.',
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
        setPostDetails(data);
        form.reset();
        commentRef.current?.blur();
        notifications.show({
          title: 'Comment submitted',
          message: 'Your comment has been submitted successfully.',
          color: 'teal',
          position: 'top-center'
        });
      }
    } catch (error) {
      console.log('Error:', error);
      notifications.show({
        title: 'Submitting Comment failed',
        message: 'An error occurred. Please try again.',
        color: 'red',
        position: 'top-center'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateComment = async (commentId: string, values: any) => {
    const response = await updateComment({
      variables: {
        postId: params.id,
        commentId,
        body: values.comment
      }
    });
    const key = Object.keys(response.data)[0];
    return response.data[key];
  };

  const handleDeleteComment = async (commentId: string) => {
    const response = await deleteComment({
      variables: {
        postId: params.id,
        commentId
      }
    });
    const key = Object.keys(response.data)[0];
    return response.data[key];
  };

  const isOwnPost = useMemo(() => {
    return postDetails?.creator.email === auth?.profile.email;
  }, [postDetails?.creator.email, auth?.profile.email]);

  const renderPost = (post: any) => {
    const content = JSON.parse(post?.content);

    const isLiked = post?.likes?.some(
      (item: any) => item.liker.email === auth?.profile.email
    );
    const isCommented = post?.comments?.some(
      (item: any) => item.commentor.email === auth?.profile.email
    );

    return (
      <Fragment>
        <Stack gap={4}>
          <Title order={1}>{post.title}</Title>
          <Group gap={4} align="center">
            <IconClock size={14} />
            <Text fz="xs" c="dimmed">
              {format(new Date(post.createdAt), 'MMMM dd - hh:mm a')}
            </Text>
          </Group>
        </Stack>

        <Stack gap="xs">
          <Group align="center" justify="space-between">
            <Group gap={6}>
              <ProfileBadge
                profile={post.creator}
                onClick={() => navigate(`/profile/${post.creator.email}`)}
              />

              {isOwnPost && (
                <Fragment>
                  &bull;
                  <Button px={0} variant="transparent">
                    Follow
                  </Button>
                </Fragment>
              )}
            </Group>
            <PostReaction
              post={post}
              isLiked={isLiked}
              isCommented={isCommented}
              onLike={handleLike}
              onComment={() => commentRef.current?.focus()}
            />
          </Group>
          <Divider />
        </Stack>

        <Stack>
          {content.blocks.map((block: any, index: number) => {
            console.log(block);
            switch (block.type) {
              case 'paragraph':
                return (
                  <Text
                    key={block.id}
                    dangerouslySetInnerHTML={{ __html: block.data.text }}
                  />
                );
              case 'header':
                return (
                  <Title
                    key={block.id}
                    order={block.data.level + 1}
                    dangerouslySetInnerHTML={{ __html: block.data.text }}
                  />
                );
              case 'list':
                return (
                  <List withPadding key={block.id} type={block.data.style}>
                    {block.data.items.map((item: any, index: number) => (
                      <List.Item key={index}>
                        <span
                          dangerouslySetInnerHTML={{ __html: item.content }}
                        />
                      </List.Item>
                    ))}
                  </List>
                );
              case 'quote':
                return (
                  <Blockquote color="green" cite={block.data.caption} mt="xl">
                    {block.data.text}
                  </Blockquote>
                );
              case 'code':
                return <Code block>{block.data.code}</Code>;
              case 'table':
                const withHeadings = block.data.withHeadings;
                const rows = withHeadings
                  ? block.data.content.slice(1)
                  : block.data.content;

                return (
                  <Table withTableBorder withColumnBorders key={block.id}>
                    {withHeadings && (
                      <Table.Thead>
                        <Table.Tr>
                          {block.data.content[0].map(
                            (heading: string, index: number) => (
                              <Table.Th key={index}>{heading}</Table.Th>
                            )
                          )}
                        </Table.Tr>
                      </Table.Thead>
                    )}
                    <Table.Tbody>
                      {rows.map((row: any, index: number) => (
                        <Table.Tr key={index}>
                          {row.map((cell: string, index: number) => (
                            <Table.Td key={index}>{cell}</Table.Td>
                          ))}
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                );
              case 'image':
                if (block.data.withBackground) {
                  return (
                    <Group
                      justify="center"
                      bg="dimmed"
                      key={index}
                      style={{
                        borderRadius: theme.radius.sm
                      }}
                    >
                      <Image
                        fit="contain"
                        w="100%"
                        h="auto"
                        src={block.data.file.url}
                        alt={block.data.caption}
                      />
                      <Text>{block.data.caption}</Text>
                    </Group>
                  );
                }

                return (
                  <Image
                    radius="sm"
                    key={index}
                    src={block.data.file.url}
                    alt={block.data.caption}
                  />
                );
              default:
                return null;
            }
          })}
        </Stack>

        <Group gap={6} mb="lg">
          {post.tags.map((tag: string) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </Group>

        <Stack gap="xs">
          <Divider />
          <PostReaction
            post={post}
            isLiked={isLiked}
            isCommented={isCommented}
            onLike={handleLike}
            onComment={() => commentRef.current?.focus()}
          />
        </Stack>

        <Title order={2}>Comments ({post.commentCount})</Title>

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

        {post.comments.length > 0 && (
          <Stack gap="lg" my="xl">
            {post.comments.map((comment: any, index: number) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                isLastComment={post.comments.length === index + 1}
                isOwnComment={comment.commentor.email === auth?.profile.email}
                updateComment={handleUpdateComment}
                deleteComment={handleDeleteComment}
              />
            ))}
          </Stack>
        )}
      </Fragment>
    );
  };

  return (
    <ProtectedLayout>
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <Button leftSection={<IconArrowLeft />} onClick={() => navigate('/')}>
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
                <Menu.Item leftSection={<IconEdit size={16} stroke={1.5} />}>
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
                >
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>
        <LoadingPost loading={loading}>
          {postDetails && renderPost(postDetails)}
        </LoadingPost>
      </Stack>
    </ProtectedLayout>
  );
};

export default PostDetails;
