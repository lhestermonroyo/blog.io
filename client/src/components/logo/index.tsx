import { FC } from 'react';
import { Image } from '@mantine/core';

import logoLight from '../../assets/logo-light.png';

type LogoProps = {
  height?: number;
};

const Logo: FC<LogoProps> = ({ height = 20 }) => {
  return <Image height={height} src={logoLight} alt="logo" />;
};

export default Logo;
