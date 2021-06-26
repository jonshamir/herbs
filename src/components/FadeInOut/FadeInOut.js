import React from "react";
import { motion } from "framer-motion";

const FadeInOut = ({ children, enterDelay, ...rest }) => {
  return (
    <motion.div
      {...rest}
      initial={{ opacity: 0 }}
      animate={{
        transition: { delay: enterDelay ? enterDelay : 0 },
        opacity: 1,
      }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      {children}
    </motion.div>
  );
};

export default FadeInOut;
