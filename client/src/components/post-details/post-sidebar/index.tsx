import { useEffect, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { useRecoilState } from 'recoil';
import { Stack } from '@mantine/core';

import {
  GET_STATS_BY_EMAIL,
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
    variables: { email: creatorEmail },
    skip: !creatorEmail,
    fetchPolicy: 'network-only'
  });
  const {
    data: statsResponse,
    loading: statsLoading,
    refetch: fetchStatsByEmail
  } = useQuery(GET_STATS_BY_EMAIL, {
    variables: { email: creatorEmail },
    skip: !creatorEmail,
    fetchPolicy: 'network-only'
  });
  const {
    data: postsResponse,
    loading: postsLoading,
    refetch: fetchPostsByCreator
  } = useQuery(GET_POSTS_BY_CREATOR, {
    variables: { creator: creatorId, limit: 5 },
    skip: !creatorId,
    fetchPolicy: 'network-only'
  });
  const {
    data: tagPostsResponse,
    loading: tagPostsLoading,
    refetch: fetchPostsByTags
  } = useQuery(GET_POSTS_BY_TAGS, {
    variables: { tags: postDetails?.tags, limit: 5 },
    skip: !postDetails?.tags,
    fetchPolicy: 'network-only'
  });

  useEffect(() => {
    init();
  }, []);

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
    if (statsResponse) {
      const key = Object.keys(statsResponse)[0];
      const data = statsResponse[key];

      setPost((prev: TPostState) => ({
        ...prev,
        creatorStats: {
          posts: {
            ...prev.creatorStats.posts,
            count: data.posts.count || 0
          },
          savedPosts: data.savedPosts,
          followers: data.followers,
          following: data.following
        }
      }));
    }
  }, [statsResponse]);

  useEffect(() => {
    if (postsResponse) {
      const key = Object.keys(postsResponse)[0];
      const data = postsResponse[key];

      setPost((prev: TPostState) => ({
        ...prev,
        creatorStats: {
          ...prev.creatorStats,
          posts: {
            ...prev.creatorStats.posts,
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
        fetchStatsByEmail(),
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
    <Stack gap="lg" className="sidebar-container">
      <AuthorPanel loading={creatorLoading || statsLoading || postsLoading} />
      <AuthorPostsPanel loading={postsLoading} />
      <SuggestionsPanel loading={tagPostsLoading} list={tagPostList} />
    </Stack>
  );
};

export default PostSidebar;
