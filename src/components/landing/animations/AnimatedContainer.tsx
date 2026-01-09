import { motion, useReducedMotion } from 'motion/react';
import { ReactNode } from 'react';

interface AnimatedContainerProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  staggerChildren?: boolean;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export const AnimatedContainer = ({
  children,
  delay = 0,
  className = '',
  staggerChildren = false,
  direction = 'up'
}: AnimatedContainerProps) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const getDirectionVariants = () => {
    const directions = {
      up: { y: 30, x: 0 },
      down: { y: -30, x: 0 },
      left: { x: 30, y: 0 },
      right: { x: -30, y: 0 }
    };
    return directions[direction];
  };

  const variants = {
    hidden: {
      opacity: 0,
      ...getDirectionVariants()
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.6,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
        ...(staggerChildren && {
          staggerChildren: 0.1,
          delayChildren: delay
        })
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};