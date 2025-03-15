import { Fragment, useEffect, useMemo } from 'react';
import {
  Avatar,
  Button,
  Card,
  Group,
  Skeleton,
  Stack,
  Text,
  Title
} from '@mantine/core';
import { useMutation, useQuery } from '@apollo/client';
import { useRecoilState } from 'recoil';

import {
  GET_FOLLOWS_BY_EMAIL,
  GET_POSTS_BY_CREATOR,
  GET_POSTS_BY_TAGS,
  GET_PROFILE_BY_EMAIL
} from '../../../graphql/queries';
import states from '../../../states';
import { TPostState } from '../../../../types';
import AuthorPanel from '../author-panel';
import AuthorPostsPanel from '../author-posts-panel';
import SuggestionsPanel from '../suggestions-panel';

const PostSidebar = () => {
  const [post, setPost] = useRecoilState(states.post);
  const { postDetails } = post;

  const creatorId = postDetails?.creator?.id;
  const creatorEmail = postDetails?.creator?.email;

  const {
    data: creatorResponse,
    loading: creatorLoading,
    refetch: fetchProfileByEmail
  } = useQuery(GET_PROFILE_BY_EMAIL, {
    variables: { email: creatorEmail }
  });
  const {
    data: followsResponse,
    loading: followsLoading,
    refetch: fetchFollowsByEmail
  } = useQuery(GET_FOLLOWS_BY_EMAIL, {
    variables: { email: creatorEmail }
  });
  const {
    data: postsResponse,
    loading: postsLoading,
    refetch: fetchPostsByCreator
  } = useQuery(GET_POSTS_BY_CREATOR, {
    variables: { creator: creatorId, limit: 5 }
  });
  const {
    data: tagPostsResponse,
    loading: tagPostsLoading,
    refetch: fetchPostsByTags
  } = useQuery(GET_POSTS_BY_TAGS, {
    variables: { tags: postDetails?.tags, limit: 5 }
  });

  useEffect(() => {
    if (creatorId && creatorEmail) {
      init();
    }
  }, [creatorId, creatorEmail]);

  useEffect(() => {
    if (creatorResponse) {
      const key = Object.keys(creatorResponse)[0];
      const data = creatorResponse[key];

      setPost((prev: TPostState) => ({
        ...prev,
        creatorProfile: data
      }));
    }
  }, [creatorResponse]);

  useEffect(() => {
    if (followsResponse) {
      const key = Object.keys(followsResponse)[0];
      const data = followsResponse[key];

      setPost((prev: TPostState) => ({
        ...prev,
        creatorStats: {
          ...prev.creatorStats,
          followers: {
            count: data.followersCount,
            list: data.followers
          },
          following: {
            count: data.followingCount,
            list: data.following
          }
        }
      }));
    }
  }, [followsResponse]);

  useEffect(() => {
    if (postsResponse) {
      const key = Object.keys(postsResponse)[0];
      const data = postsResponse[key];

      setPost((prev: TPostState) => ({
        ...prev,
        creatorStats: {
          ...prev.creatorStats,
          posts: {
            count: data.totalCount,
            list: data.posts
          }
        }
      }));
    }
  }, [postsResponse]);

  const init = async () => {
    try {
      const requests = [
        fetchProfileByEmail(),
        fetchFollowsByEmail(),
        fetchPostsByCreator(),
        fetchPostsByTags()
      ];
      await Promise.all(requests);
    } catch (error) {
      console.log('error', error);
    }
  };

  const tagPostList = useMemo(() => {
    if (tagPostsResponse) {
      const key = Object.keys(tagPostsResponse)[0];
      const data = tagPostsResponse[key];

      return data.posts;
    }
  }, [tagPostsResponse]);

  return (
    <Stack gap="lg" className="extras-container">
      <AuthorPanel loading={creatorLoading || followsLoading || postsLoading} />
      <AuthorPostsPanel loading={postsLoading} />
      <SuggestionsPanel loading={tagPostsLoading} list={tagPostList} />
    </Stack>
  );
};

export default PostSidebar;
