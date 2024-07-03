import { FC } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import {
  Center,
  Text,
  Heading,
  HStack,
  Button,
  VStack,
  Box,
} from 'native-base';
import Ionicons from '@expo/vector-icons/Ionicons';

import Logo from '../logo';

interface IErrorProps {
  text?: string;
  refetch: () => void;
  logout: () => void;
}

const Error: FC<IErrorProps> = ({
  text = "Looks like we're having some trouble loading data.",
  refetch,
  logout,
}) => {
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Box marginX={4}>
          <Center>
            <Logo />
          </Center>
          <VStack space={12} flex={1} justifyContent="center">
            <VStack space={4}>
              <Heading size="2xl" textAlign="center">
                Ooops!
              </Heading>
              <Text fontSize="xl" color="gray.500" textAlign="center">
                {text}
              </Text>
            </VStack>

            <HStack space={2}>
              <Button
                flex={1}
                size="lg"
                startIcon={
                  <Ionicons name="refresh-outline" color="#fff" size={24} />
                }
                onPress={refetch}
              >
                Refresh
              </Button>
              <Button
                flex={1}
                size="lg"
                variant="subtle"
                startIcon={<Ionicons name="log-out-outline" size={24} />}
                onPress={logout}
              >
                Logout
              </Button>
            </HStack>
          </VStack>
        </Box>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 1000,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
});

export default Error;
