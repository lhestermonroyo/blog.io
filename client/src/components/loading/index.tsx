import { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack, Spinner, Center, Text } from 'native-base';
import Logo from '../logo';

interface ILoadingProps {
  text?: string;
}

const Loading: FC<ILoadingProps> = ({
  text = 'Loading app data, please wait...',
}) => {
  return (
    <View style={styles.container}>
      <Stack space={20}>
        <Center>
          <Logo />
        </Center>
        <Stack space={4}>
          <Spinner size="lg" />
          <Text fontSize="md">{text}</Text>
        </Stack>
      </Stack>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 1000,
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Loading;
