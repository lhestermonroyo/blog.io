import { Fragment, useCallback, useEffect, useState } from 'react';
import {
  Autocomplete,
  AutocompleteProps,
  Avatar,
  Group,
  OptionsFilter,
  Stack,
  Text,
  Title,
  UnstyledButton
} from '@mantine/core';
import { IconArrowUpRight, IconClock, IconSearch } from '@tabler/icons-react';
import _ from 'lodash';
import { format } from 'date-fns';
import { useMutation } from '@apollo/client';

import { GET_SEARCH_RESULTS } from '../../graphql/mutations';
import { TPostItem, TProfileBadge } from '../../../types';

import classes from './style.module.css';
import { useNavigate } from 'react-router';

const SearchPanel = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<any>([]);
  const [resultsData, setResultsData] = useState<any>([]);

  const [getSearchResult] = useMutation(GET_SEARCH_RESULTS);

  const navigate = useNavigate();

  const dbFetchSearchResult = useCallback(
    _.debounce((query: string) => fetchSearchResults(query), 500),
    []
  );

  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      setResultsData([]);
      return;
    }

    dbFetchSearchResult(query);
    return () => dbFetchSearchResult.cancel(); // Cleanup
  }, [query, dbFetchSearchResult]);

  const fetchSearchResults = async (qryStr: string) => {
    try {
      const response = await getSearchResult({
        variables: { query: qryStr }
      });
      const key = Object.keys(response.data)[0];
      const data = response.data[key];

      // check duplicate in postItems
      const postItems = [...data.posts].map((post: TPostItem) => post?.title);
      const authorItems = [...data.users].map(
        (user: TProfileBadge) => `${user.firstName} ${user.lastName}`
      );

      if (authorItems.length) {
        resultsData.push({
          group: 'Authors',
          items: [...data.users]
        });
      }

      if (postItems.length) {
        resultsData.push({
          group: 'Posts',
          items: [...data.posts]
        });
      }

      setResults([
        {
          group: 'Authors',
          items: [...authorItems]
        },
        {
          group: 'Posts',
          items: [...postItems]
        }
      ]);
      setResultsData(resultsData);
    } catch (error) {
      console.log('error', error);
    }
  };

  const optionsFilter: OptionsFilter = ({ options, search }) => {
    options = options.map((option: any) => {
      if (option.group === 'Authors') {
        option.items = option.items.slice(0, 5);
      }
      if (option.group === 'Posts') {
        option.items = option.items.slice(0, 5);
      }
      return option;
    });

    return options;
  };

  const renderOption: AutocompleteProps['renderOption'] = ({ option }) => {
    const isAuthor =
      resultsData[0] &&
      resultsData[0].items.some(
        (item: TProfileBadge) =>
          `${item.firstName} ${item.lastName}` === option.value
      );
    const isPost =
      resultsData[1] &&
      resultsData[1].items.some(
        (item: TPostItem) => item.title === option.value
      );

    if (isAuthor) {
      const profile = resultsData[0].items.find(
        (item: TProfileBadge) =>
          `${item.firstName} ${item.lastName}` === option.value
      );

      return (
        <UnstyledButton onClick={() => navigate(`/profile/${profile?.email}`)}>
          <Group gap={6}>
            <Avatar
              src={profile?.avatar}
              alt={profile?.firstName}
              name={`${profile?.firstName} ${profile?.lastName}`}
              radius="xl"
              color="initials"
              size="sm"
            />
            <Text fw={500} size="sm" mx={2}>
              {`${profile?.firstName} ${profile?.lastName}`}
            </Text>
          </Group>
        </UnstyledButton>
      );
    }

    if (isPost) {
      const post = resultsData[1].items.find(
        (item: TPostItem) => item.title === option.value
      );
      return (
        <UnstyledButton onClick={() => navigate(`/post/${post?.id}`)}>
          <Stack gap={0}>
            <Title order={5}>{post?.title}</Title>
            <Group gap={4} align="center">
              <IconClock size={14} />
              <Text fz="xs" c="dimmed">
                {format(new Date(post?.createdAt), 'MMMM dd - hh:mm a')} &bull;{' '}
                {post?.creator?.firstName} {post?.creator?.lastName}
              </Text>
            </Group>
          </Stack>
        </UnstyledButton>
      );
    }

    return (
      <UnstyledButton w="100%" onClick={() => navigate(`/search`)}>
        <Group justify="space-between" align="center">
          <Text fw={500} flex={1}>
            {option.value}
          </Text>
          <IconArrowUpRight size={16} stroke={1.5} />
        </Group>
      </UnstyledButton>
    );
  };

  return (
    <Fragment>
      <Autocomplete
        miw={380}
        variant="filled"
        placeholder="Search"
        leftSection={<IconSearch size={16} stroke={1.5} />}
        onChange={(value) => setQuery(value)}
        filter={optionsFilter}
        data={[...results, 'Expand Search']}
        renderOption={renderOption}
        classNames={{
          dropdown: classes.dropdown
        }}
      />
    </Fragment>
  );
};

export default SearchPanel;
