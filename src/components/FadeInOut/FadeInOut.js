import React from "react";
import { motion } from "framer-motion";

const FadeInOut = ({ children, ...rest }) => {
  return (
    <motion.div
      {...rest}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  );
};

export default FadeInOut;
