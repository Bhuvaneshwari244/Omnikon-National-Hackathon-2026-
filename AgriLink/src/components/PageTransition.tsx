import { motion } from "framer-motion";
import { ReactNode } from "react";

const pageVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.98
  },
  enter: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
      staggerChildren: 0.1
    }
  },
  exit: { 
    opacity: 0, 
    y: -10,
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  },
};

export default function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="enter"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}
