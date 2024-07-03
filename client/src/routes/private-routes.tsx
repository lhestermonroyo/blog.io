import React, { FC } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import Home from '../pages/home';
import SubForums from '../pages/sub-forums';
import Profile from '../pages/profile';

const PrivateTabs = createBottomTabNavigator();

const PrivateRoutes: FC = () => {
  return (
    <PrivateTabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0891b2',
        tabBarInactiveTintColor: '#71717a',
      }}
    >
      <PrivateTabs.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />
      <PrivateTabs.Screen
        name="Sub-Forums"
        component={SubForums}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="people-circle" size={24} color={color} />
          ),
        }}
      />
      <PrivateTabs.Screen
        name="Create"
        component={SubForums}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="add" size={36} color={color} />
          ),
        }}
      />
      <PrivateTabs.Screen
        name="Notifications"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="notifications" size={24} color={color} />
          ),
        }}
      />
      <PrivateTabs.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={24} color={color} />
          ),
        }}
      />
    </PrivateTabs.Navigator>
  );
};

export default PrivateRoutes;
