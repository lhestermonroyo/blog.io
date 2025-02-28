import { FC } from 'react';
import { Image, useMantineColorScheme } from '@mantine/core';

import logoLight from '../../assets/logo-light.png';
import logoDark from '../../assets/logo-dark.png';

interface ILogo {
  height?: number;
}

const Logo: FC<ILogo> = ({ height = 20 }) => {
  const colorScheme = useMantineColorScheme();
  const isDark = colorScheme.colorScheme === 'dark';

  return <Image height={height} src={logoLight} alt="logo" />;
};

export default Logo;
