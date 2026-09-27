import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedLabelProps extends Omit<HTMLMotionProps<"span">, "children"> {
  children: ReactNode;
  delay?: number;
  variant?: "fade" | "slide" | "scale" | "bounce";
  as?: "span" | "p" | "h1" | "h2" | "h3" | "h4" | "label" | "div";
}

const variants = {
  fade: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
  },
  slide: {
    initial: { opacity: 0, x: -15 },
    animate: { opacity: 1, x: 0 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.85 },
    animate: { opacity: 1, scale: 1 },
  },
  bounce: {
    initial: { opacity: 0, y: 15, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1 },
  },
};

export function AnimatedLabel({ 
  children, 
  delay = 0, 
  variant = "fade", 
  as = "span",
  className = "",
  ...props 
}: AnimatedLabelProps) {
  const Component = motion[as] as typeof motion.span;
  const variantConfig = variants[variant];
  
  return (
    <Component
      initial={variantConfig.initial}
      animate={variantConfig.animate}
      transition={{
        duration: 0.4,
        delay,
        ease: variant === "bounce" ? [0.34, 1.56, 0.64, 1] : "easeOut",
      }}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
}

// Staggered children animation wrapper
interface StaggerLabelGroupProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}

export function StaggerLabelGroup({ children, staggerDelay = 0.08, className = "" }: StaggerLabelGroupProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={{
        animate: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Child component for stagger groups
export function StaggerLabelItem({ 
  children, 
  className = "",
  variant = "fade" 
}: { 
  children: ReactNode; 
  className?: string;
  variant?: "fade" | "slide" | "scale" | "bounce";
}) {
  const variantConfig = variants[variant];
  
  return (
    <motion.div
      variants={{
        initial: variantConfig.initial,
        animate: variantConfig.animate,
      }}
      transition={{
        duration: 0.4,
        ease: variant === "bounce" ? [0.34, 1.56, 0.64, 1] : "easeOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}