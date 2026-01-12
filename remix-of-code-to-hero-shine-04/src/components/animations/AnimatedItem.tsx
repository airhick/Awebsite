import { motion, useReducedMotion } from 'motion/react';
import { ReactNode } from 'react';

interface AnimatedItemProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export const AnimatedItem = ({
  children,
  delay = 0,
  className = '',
  direction = 'up'
}: AnimatedItemProps) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const getDirectionVariants = () => {
    const directions = {
      up: { y: 20, x: 0 },
      down: { y: -20, x: 0 },
      left: { x: 20, y: 0 },
      right: { x: -20, y: 0 }
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
      y: 0
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={variants}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};