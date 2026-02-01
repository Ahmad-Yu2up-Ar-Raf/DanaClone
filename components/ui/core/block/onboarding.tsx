import { Onboarding, useOnboarding } from '@/components/ui/fragments/shadcn-ui/onboarding';
import { Text } from '../../fragments/shadcn-ui/text';

import { Redirect } from 'expo-router';
import Onboarding1 from '@/assets/svg/onboarding/onboarding-1';
import Onboarding2 from '@/assets/svg/onboarding/onboarding-2';
import Onboarding3 from '@/assets/svg/onboarding/onboarding-3';
import Onboarding4 from '@/assets/svg/onboarding/onboarding-4';
import { View } from '../../fragments/shadcn-ui/view';

export const OnboardingPresets = {
  welcome: [
    {
      id: 'welcome',
      title: 'Welcome to Our App',
      description: 'Discover amazing features and get started with your journey.',
      icon: (
        <View className="flex h-fit scale-[.55] content-center items-center justify-start overflow-hidden">
          <Onboarding1 className=" " />
        </View>
      ),
    },
    {
      id: 'features',
      title: 'Powerful Features',
      description: 'Experience cutting-edge functionality designed to make your life easier.',
      icon: (
        <View className="flex h-fit scale-[.55] content-center items-center justify-start overflow-hidden">
          <Onboarding2 className=" " />
        </View>
      ),
    },
    {
      id: 'personalize',
      title: 'Personalize Your Experience',
      description: 'Customize the app to match your preferences and workflow.',
      icon: (
        <View className="flex h-fit scale-[.50] content-center items-center justify-start overflow-hidden">
          <Onboarding3 className=" " />
        </View>
      ),
    },
    {
      id: 'ready',
      title: "You're All Set!",
      description: "Everything is ready. Let's start exploring what you can achieve.",
      icon: (
        <View className="flex h-fit scale-[.55] content-center items-center justify-start overflow-hidden">
          <Onboarding4 className=" " />
        </View>
      ),
    },
  ],
};

export function OnboardingDemo() {
  const { hasCompletedOnboarding, completeOnboarding, skipOnboarding } = useOnboarding();

  if (hasCompletedOnboarding) {
    return <Redirect href={'/(auth)/sign-in'} />;
  }

  return (
    <Onboarding
      steps={OnboardingPresets.welcome}
      onComplete={completeOnboarding}
      onSkip={skipOnboarding}
      showSkip={true}
      showProgress={true}
      swipeEnabled={true}
      primaryButtonText="Get Started"
      skipButtonText="Skip"
      nextButtonText="Next"
      backButtonText="Back"
    />
  );
}
