import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeInLeft,
  FadeInRight,
  SlideInDown,
  SlideInUp,
  SlideInLeft,
  SlideInRight,
  ZoomIn,
  BounceIn,
  LinearTransition,
} from 'react-native-reanimated';

export type AnimationPreset =
  | 'fadeIn'
  | 'fadeInDown'
  | 'fadeInUp'
  | 'fadeInLeft'
  | 'fadeInRight'
  | 'slideInDown'
  | 'slideInUp'
  | 'slideInLeft'
  | 'slideInRight'
  | 'zoomIn'
  | 'bounceIn'
  | 'none';

export interface MotionProps {
  children: React.ReactNode;
  preset?: AnimationPreset;
  delay?: number;
  duration?: number;
  springConfig?: { damping?: number; stiffness?: number; mass?: number };
  style?: StyleProp<ViewStyle>;
  onAnimationComplete?: () => void;
}

const presetMap: Record<AnimationPreset, any> = {
  fadeIn: FadeIn,
  fadeInDown: FadeInDown,
  fadeInUp: FadeInUp,
  fadeInLeft: FadeInLeft,
  fadeInRight: FadeInRight,
  slideInDown: SlideInDown,
  slideInUp: SlideInUp,
  slideInLeft: SlideInLeft,
  slideInRight: SlideInRight,
  zoomIn: ZoomIn,
  bounceIn: BounceIn,
  none: undefined,
};

export function Motion({
  children,
  preset = 'fadeIn',
  delay = 0,
  duration = 500,
  springConfig,
  style,
  onAnimationComplete,
}: MotionProps) {
  const entering = presetMap[preset];

  let animation = entering;
  if (animation) {
    animation = animation.duration(duration);
    if (delay > 0) {
      animation = animation.delay(delay);
    }
    if (springConfig && (preset === 'zoomIn' || preset === 'bounceIn')) {
      animation = animation.springify()
        .damping(springConfig.damping ?? 15)
        .stiffness(springConfig.stiffness ?? 150)
        .mass(springConfig.mass ?? 1);
    }
  }

  return (
    <Animated.View
      entering={animation}
      layout={LinearTransition.duration(300)}
      style={style}
    >
      {children}
    </Animated.View>
  );
}

export function MotionGroup({
  children,
  preset = 'fadeInUp',
  stagger = 100,
  duration = 500,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  preset?: AnimationPreset;
  stagger?: number;
  duration?: number;
  delay?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const childArray = React.Children.toArray(children);
  return (
    <View style={style}>
      {childArray.map((child, index) => (
        <Motion key={index} preset={preset} delay={delay + index * stagger} duration={duration}>
          {child}
        </Motion>
      ))}
    </View>
  );
}