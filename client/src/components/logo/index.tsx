import { FC } from 'react';
import { Image } from '@mantine/core';

import logo from '../../assets/logo.png';

type LogoProps = {
  height?: number;
};

const Logo: FC<LogoProps> = ({ height = 20 }) => {
  return <Image h={height} w="auto" src={logo} alt="logo" />;
};

export default Logo;
