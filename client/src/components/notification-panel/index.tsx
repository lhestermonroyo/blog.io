import { Fragment, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  ActionIcon,
  Avatar,
  Divider,
  Group,
  Indicator,
  Menu,
  Skeleton,
  Stack,
  Text,
  Title
} from '@mantine/core';
import {
  IconBallpen,
  IconBell,
  IconBookmark,
  IconClock,
  IconHeart,
  IconMessage,
  IconUserPlus
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { format } from 'date-fns';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useMutation, useQuery, useSubscription } from '@apollo/client';

import states from '../../states';
import { GET_NOTIFICATIONS } from '../../graphql/queries';
import { ON_NEW_NOTIFICATION } from '../../graphql/subscriptions';
import { MARK_AS_READ } from '../../graphql/mutations';
import { TNotificationItem, TNotificationState } from '../../../types';

const NotificationPanel = () => {
  const auth = useRecoilValue(states.auth);
  const [notification, setNotification] = useRecoilState(states.notification);
  const { unreadCount, list } = notification;
  const { profile } = auth;

  const { data: notifResponse, loading: loadingNotif } = useQuery(
    GET_NOTIFICATIONS,
    {
      fetchPolicy: 'network-only'
    }
  );
  const { data: newNotifResponse } = useSubscription(ON_NEW_NOTIFICATION);
  const [markAsRead] = useMutation(MARK_AS_READ);

  const navigate = useNavigate();

  useEffect(() => {
    if (newNotifResponse) {
      const key = Object.keys(newNotifResponse)[0];
      const data = newNotifResponse[key];

      const ownNotification = data.notification.user.id === profile?.id;

      if (ownNotification) {
        setNotification((prev: TNotificationState) => {
          let currList = prev.list;
          const isExist = currList.find(
            (item: TNotificationItem) => item.id === data.notification.id
          );

          if (isExist) {
            currList = currList.map((item: TNotificationItem) => {
              if (item.id === data.notification.id) {
                return data.notification;
              }
              return item;
            });
          } else {
            currList = [data.notification, ...currList];
          }

          return {
            ...prev,
            unreadCount: data.unreadCount,
            list: currList.sort((a, b) => {
              const dateA = new Date(a.createdAt);
              const dateB = new Date(b.createdAt);
              return dateB.getTime() - dateA.getTime();
            })
          };
        });
      }
    }
  }, [newNotifResponse]);

  useEffect(() => {
    if (notifResponse) {
      const key = Object.keys(notifResponse)[0];
      const data = notifResponse[key];

      setNotification(data);
    }
  }, [notifResponse]);

  const redirect = (item: TNotificationItem) => {
    switch (item.type) {
      case 'new_post':
        navigate(`/post/${item.post?.id}`);
        break;
      case 'new_comment':
      case 'like_comment':
        if (item.comment) {
          navigate(`/post/${item.post?.id}?comment=${item?.comment}`);
        } else {
          navigate(`/post/${item.post?.id}`);
        }
        break;
      case 'reply_comment':
      case 'like_reply':
        if (item.comment) {
          navigate(
            `/post/${item.post?.id}?comment=${item?.comment}&showReplies=true`
          );
        } else {
          navigate(`/post/${item.post?.id}`);
        }
        break;
      case 'follow':
        navigate(`/profile`);
        break;
      default:
        navigate(`/post/${item.post?.id}`);
        break;
    }
  };

  const handleRead = async (item: TNotificationItem) => {
    if (item.isRead) {
      redirect(item);
      return;
    }

    try {
      redirect(item);

      const response = await markAsRead({
        variables: {
          notificationId: item?.id
        }
      });
      const key = Object.keys(response.data)[0];
      const data = response.data[key];

      setNotification((prev: TNotificationState) => ({
        ...prev,
        unreadCount: data.unreadCount,
        list: prev.list
          .map((item: TNotificationItem) => {
            if (item.id === data.notification.id) {
              return data.notification;
            }
            return item;
          })
          .sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB.getTime() - dateA.getTime();
          })
      }));
    } catch (error) {
      console.error(error);
      notifications.show({
        title: 'Error',
        message: 'An error occurred while marking as read.',
        color: 'red',
        position: 'top-center'
      });
    }
  };

  return (
    <Fragment>
      <Menu
        width={400}
        position="bottom-end"
        transitionProps={{ transition: 'pop-top-right' }}
        withinPortal
      >
        <Menu.Target>
          <Indicator
            disabled={!unreadCount}
            label={unreadCount}
            color="red"
            size={16}
          >
            <ActionIcon
              style={{
                borderWidth: 0,
                marginTop: 4
              }}
              variant="default"
              c="dimmed"
              radius="xl"
            >
              <IconBell size={24} />
            </ActionIcon>
          </Indicator>
        </Menu.Target>
        <Menu.Dropdown
          h={300}
          py="md"
          style={{
            overflowY: 'auto'
          }}
        >
          <Title order={5} ta="center" mb="md">
            Notifications ({unreadCount})
          </Title>
          <Divider />
          {loadingNotif && <Loading />}
          {list.length ? (
            <Fragment>
              {list.map((item: TNotificationItem) => {
                const avatar = item?.latestUser[0]?.avatar;
                const iconProps = {
                  size: 12
                };

                const typeIcon =
                  item?.type === 'new_post' ? (
                    <IconBallpen {...iconProps} />
                  ) : item?.type === 'new_comment' ||
                    item?.type === 'reply_comment' ? (
                    <IconMessage {...iconProps} />
                  ) : item?.type === 'like' ||
                    item?.type === 'like_comment' ||
                    item?.type === 'like_reply' ? (
                    <IconHeart {...iconProps} />
                  ) : item?.type === 'follow' ? (
                    <IconUserPlus {...iconProps} />
                  ) : item?.type === 'save' ? (
                    <IconBookmark {...iconProps} />
                  ) : null;

                return (
                  <Menu.Item key={item.id} onClick={() => handleRead(item)}>
                    <Group>
                      <Indicator
                        withBorder
                        label={typeIcon}
                        position="middle-end"
                        size={24}
                      >
                        <Avatar src={avatar} alt="notif-avatar" size="md" />
                      </Indicator>
                      <Stack gap={0} flex={1}>
                        <Text
                          size="sm"
                          lineClamp={2}
                          fw={!item?.isRead ? 700 : 500}
                        >
                          {item.message}
                        </Text>
                        <Group gap={4} align="center">
                          <IconClock size={14} />
                          <Text size="xs" c="dimmed">
                            {format(
                              new Date(item.createdAt),
                              'MMMM dd - hh:mm a'
                            )}
                          </Text>
                        </Group>
                      </Stack>
                    </Group>
                  </Menu.Item>
                );
              })}
            </Fragment>
          ) : (
            <Text size="sm" ta="center" c="dimmed" mt="lg">
              No notifications
            </Text>
          )}
        </Menu.Dropdown>
      </Menu>
    </Fragment>
  );
};

const Loading = () => (
  <Stack gap="sm">
    {[1, 2, 3, 4].map((_, i) => (
      <Group key={i} gap={6}>
        <Skeleton h={40} w={40} radius="xl" />
        <Stack gap={6} flex={1}>
          <Skeleton h={20} />
          <Skeleton h={16} w="30%" />
        </Stack>
      </Group>
    ))}
  </Stack>
);

export default NotificationPanel;
