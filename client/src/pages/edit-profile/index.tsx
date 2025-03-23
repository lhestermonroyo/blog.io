import { useNavigate, useLocation } from 'react-router';
import { Button, Group, Stack, Tabs, Title } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';

import ProtectedLayout from '../../layouts/protected';
import UserInfoForm from '../../components/edit-profile/user-info-form';
import SocialsForm from '../../components/edit-profile/socials-form';
import TagsForm from '../../components/edit-profile/tags-form';
import { useEffect, useState } from 'react';
import AvatarCoverForm from '../../components/edit-profile/avatar-cover-form';

const EditProfile = () => {
  const [currTab, setCurrTab] = useState('1');

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tab = searchParams.get('tab');

  return (
    <ProtectedLayout size="lg">
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
        <Tabs defaultValue={tab || '1'} orientation="vertical" mih={500}>
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
        </Tabs>
      </Stack>
    </ProtectedLayout>
  );
};

export default EditProfile;
