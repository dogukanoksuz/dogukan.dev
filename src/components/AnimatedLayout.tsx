import { motion } from "framer-motion";

interface IProps {
  children: React.ReactNode;
}

const variants = {
  inactive: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
  out: {
    opacity: 0,
    y: -100,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
  in: {
    y: 100,
    opacity: 0,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

const AnimatedLayout: React.FC<IProps> = ({ children }) => (
  <motion.div variants={variants} initial="in" animate="inactive" exit="out">
    {children}
  </motion.div>
);
export default AnimatedLayout;
