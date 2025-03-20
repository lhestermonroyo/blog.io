import {
  Button,
  Card,
  Group,
  Skeleton,
  Stack,
  Text,
  Title,
  UnstyledButton
} from '@mantine/core';
import {
  IconArrowUpRight,
  IconBrandFacebookFilled,
  IconBrandGithubFilled,
  IconBrandInstagramFilled,
  IconBrandLinkedinFilled,
  IconBrandTwitterFilled,
  IconEdit,
  IconGlobeFilled
} from '@tabler/icons-react';

import { TProfile } from '../../../../types';

import classes from './style.module.css';

const SocialsPanel = ({
  loading,
  socials
}: {
  loading: boolean;
  socials: TProfile['socials'];
}) => {
  if (loading) {
    return <Loading />;
  }

  const isEmpty = Object.entries(socials)
    .filter(([key]) => key !== '__typename')
    .every(([_, link]) => !link);

  if (isEmpty) {
    return <Empty />;
  }

  return (
    <Card withBorder>
      <Stack gap="lg">
        <Title order={3}>Socials</Title>
        <Card.Section>
          <Stack gap={0}>
            {Object.entries(socials)
              .filter(([key]) => key !== '__typename')
              .map((link) => (
                <SocialItem key={link[0]} type={link[0]} link={link[1]} />
              ))}
          </Stack>
        </Card.Section>
        <Group>
          <Button leftSection={<IconEdit size={16} />}>Edit</Button>
        </Group>
      </Stack>
    </Card>
  );
};

const Loading = () => {
  return (
    <Card withBorder>
      <Stack gap="lg">
        <Title order={3}>Socials</Title>
        <Stack gap="sm">
          <Skeleton height={40} radius="md" />
          <Skeleton height={40} radius="md" />
          <Skeleton height={40} radius="md" />
          <Skeleton height={40} radius="md" />
          <Skeleton height={40} radius="md" />
        </Stack>
        <Group>
          <Button leftSection={<IconEdit size={16} />}>Edit</Button>
        </Group>
      </Stack>
    </Card>
  );
};

const Empty = () => {
  return (
    <Card withBorder>
      <Stack gap="lg">
        <Title order={3}>Socials</Title>
        <Text>No social links added yet.</Text>
        <Group>
          <Button leftSection={<IconEdit size={16} />}>Edit</Button>
        </Group>
      </Stack>
    </Card>
  );
};

const SocialItem = ({ type, link }: { type: string; link: string }) => {
  if (link === '' || link === null) return null;

  const iconProps = {
    size: 24,
    stroke: 1,
    strokeWidth: 1,
    color: '#fff'
  };
  const socialIcon = {
    facebook: <IconBrandFacebookFilled {...iconProps} />,
    twitter: <IconBrandTwitterFilled {...iconProps} />,
    linkedin: <IconBrandLinkedinFilled {...iconProps} />,
    instagram: <IconBrandInstagramFilled {...iconProps} />,
    github: <IconBrandGithubFilled {...iconProps} />,
    website: <IconGlobeFilled {...iconProps} />
  } as Record<string, JSX.Element>;

  return (
    <UnstyledButton
      py="md"
      className={classes.social}
      onClick={() => window.open(link, '_blank')}
    >
      <Group justify="space-between" align="center">
        <Group gap={6} align="center">
          <Group
            w={32}
            h={32}
            bg="green"
            justify="center"
            align="center"
            style={{ borderRadius: 6 }}
          >
            {socialIcon[type]}
          </Group>
          <Text tt="capitalize">{type}</Text>
        </Group>
        <IconArrowUpRight size={24} />
      </Group>
    </UnstyledButton>
  );
};

export default SocialsPanel;
