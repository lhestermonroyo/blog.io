import { Fragment } from 'react';
import { useNavigate, useLocation } from 'react-router';
// @ts-ignore
import { Helmet } from 'react-helmet';
import { Button, Group, Stack, Tabs, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconArrowLeft } from '@tabler/icons-react';

import MainLayout from '../../layouts/main';
import UserInfoForm from '../../components/edit-profile/user-info-form';
import SocialsForm from '../../components/edit-profile/socials-form';
import TagsForm from '../../components/edit-profile/tags-form';
import AvatarCoverForm from '../../components/edit-profile/avatar-cover-form';
import AccountSettingsForm from '../../components/edit-profile/account-settings-form';

const EditProfile = () => {
  const isMd = useMediaQuery('(max-width: 768px)');

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tab = searchParams.get('tab');

  return (
    <Fragment>
      <Helmet>
        <title>blog.io | Edit Profile</title>
        <meta name="description" content="Edit your profile" />
        <link rel="canonical" href="/edit-profile" />
      </Helmet>
      <MainLayout size="lg">
        <Stack gap="lg">
          <Group>
            <Button
              variant="default"
              leftSection={<IconArrowLeft size={16} />}
              onClick={() => navigate('/profile')}
            >
              Back
            </Button>
          </Group>
          <Title order={1}>Edit Profile</Title>
          <Tabs
            defaultValue={tab || '1'}
            orientation={!isMd ? 'vertical' : 'horizontal'}
            mih={500}
          >
            <Tabs.List>
              <Tabs.Tab value="1">User Information</Tabs.Tab>
              <Tabs.Tab value="2">Socials</Tabs.Tab>
              <Tabs.Tab value="3">Topics/Tags</Tabs.Tab>
              <Tabs.Tab value="4">Avatar & Cover Photo</Tabs.Tab>
              <Tabs.Tab value="5" mt="auto">
                Account Settings
              </Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="1">
              <UserInfoForm />
            </Tabs.Panel>
            <Tabs.Panel value="2">
              <SocialsForm />
            </Tabs.Panel>
            <Tabs.Panel value="3">
              <TagsForm />
            </Tabs.Panel>
            <Tabs.Panel value="4">
              <AvatarCoverForm />
            </Tabs.Panel>
            <Tabs.Panel value="5">
              <AccountSettingsForm />
            </Tabs.Panel>
          </Tabs>
        </Stack>
      </MainLayout>
    </Fragment>
  );
};

export default EditProfile;
