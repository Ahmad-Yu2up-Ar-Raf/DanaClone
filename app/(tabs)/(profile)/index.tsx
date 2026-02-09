import BelanceCard from '@/components/ui/fragments/custom-ui/card/belance-card';
import FeatureCard from '@/components/ui/fragments/custom-ui/card/feature-card';
import ProfileCard from '@/components/ui/fragments/custom-ui/card/profile-card';
import React from 'react';
import { View, Text } from 'react-native';

import { Wrapper } from '../(home)';
const Index = () => {
  return (
    <Wrapper edges={['bottom']}>
      <ProfileCard />
      <View className="flex-1 items-center gap-5 px-4">
        <BelanceCard />
        <FeatureCard />
      </View>
      <Text
        className="m-auto mt-10 text-center text-sm text-muted-foreground"
        style={{ maxWidth: 360 }}>
        Versi 2.0.0
      </Text>
    </Wrapper>
  );
};

export default Index;
