'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSite } from '@/components/gui/Providers';

interface Word {
  text: string;
  className?: string;
}

interface AnimatedTypographyProps {
  words: (string | Word)[];
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4';
  variant?: 'title' | 'subtitle' | 'lede';
  delay?: number;
}

const variants: Record<
  NonNullable<AnimatedTypographyProps['variant']>,
  { hidden: { opacity: number; y: number }; visible: { opacity: number; y: number } }
> = {
  title: { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } },
  subtitle: { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } },
  lede: { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } },
};

export function AnimatedTypography({
  words,
  className = '',
  as: Tag = 'h1',
  variant = 'title',
  delay = 0,
}: AnimatedTypographyProps) {
  const { reducedMotion } = useSite();

  const arrayWords = useMemo(
    () => words.map((w) => (typeof w === 'string' ? { text: w } : w)),
    [words]
  );

  const letterVariants = useMemo(() => {
    if (reducedMotion) {
      return { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } };
    }
    return {
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0 },
    };
  }, [reducedMotion]);

  const wordVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 10 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          delay,
          stagger: { each: 0.06 },
        },
      },
    }),
    [delay]
  );

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={variants[variant]}
    >
      <Tag className="inline-block">
        <span style={{ display: 'inline-flex' }}>
          {arrayWords.map((item, i) => (
            <motion.span key={i} className={`inline-block ${item.className ?? ''}`}>
              <span style={{ display: 'inline-flex', verticalAlign: 'top' }}>
                {item.text.split('').map((letter, j) => (
                  <motion.span
                    key={j}
                    className="inline-block will-change-transform"
                    initial="hidden"
                    animate="visible"
                    variants={letterVariants}
                    style={{ display: 'inline-block' }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            </motion.span>
          ))}
        </span>
      </Tag>
    </motion.div>
  );
}
