import {
  Button,
  Card,
  Group,
  Image,
  Skeleton,
  Stack,
  Text,
  Title,
  UnstyledButton
} from '@mantine/core';
import {
  IconArrowUpRight,
  IconEdit,
  IconGlobeFilled
} from '@tabler/icons-react';
import { useNavigate } from 'react-router';

import { TProfile } from '../../../../types';

import classes from './style.module.css';

import facebook from '../../../assets/Facebook.png';
import twitter from '../../../assets/Twitter.png';
import instagram from '../../../assets/Instagram.png';
import github from '../../../assets/Github.png';
import linkedin from '../../../assets/Linkedin.png';

const SocialsPanel = ({
  loading,
  ownProfile,
  socials
}: {
  loading: boolean;
  ownProfile: boolean;
  socials: TProfile['socials'];
}) => {
  const navigate = useNavigate();

  const isEmpty = Object.entries(socials)
    .filter(([key]) => key !== '__typename')
    .every(([_, link]) => !link);

  if (loading) {
    return <Loading />;
  }

  return (
    <Card withBorder>
      <Stack gap="lg">
        <Title order={3}>Socials</Title>
        {isEmpty ? (
          <Text>No social links added yet.</Text>
        ) : (
          <Card.Section>
            <Stack gap={0}>
              {Object.entries(socials)
                .filter(([key]) => key !== '__typename')
                .map((link) => (
                  <SocialItem key={link[0]} type={link[0]} link={link[1]} />
                ))}
            </Stack>
          </Card.Section>
        )}
        {ownProfile && (
          <Group>
            <Button
              leftSection={<IconEdit size={16} />}
              onClick={() => navigate('edit?tab=2')}
            >
              Edit
            </Button>
          </Group>
        )}
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
    facebook: <Image src={facebook} alt="facebook" w={48} />,
    twitter: <Image src={twitter} alt="twitter" w={48} />,
    linkedin: <Image src={linkedin} alt="linkedin" w={48} />,
    instagram: <Image src={instagram} alt="instagram" w={48} />,
    github: <Image src={github} alt="github" w={48} />,
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
          {socialIcon[type]}
          <Text tt="capitalize">{type}</Text>
        </Group>
        <IconArrowUpRight size={24} />
      </Group>
    </UnstyledButton>
  );
};

export default SocialsPanel;
