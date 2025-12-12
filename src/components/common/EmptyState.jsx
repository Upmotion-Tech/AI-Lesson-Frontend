import { Inbox } from "lucide-react";
import { motion } from "framer-motion";
import Button from "./Button.jsx";

const EmptyState = ({
  message,
  title,
  description,
  actionLabel,
  onAction,
  icon: Icon = Inbox,
  className = "",
  illustration,
}) => {
  const IconComponent = icon;

  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className={`text-center py-12 px-4 ${className}`}
    >
      <motion.div variants={itemVariants}>
        {illustration ? (
          <div className="mb-6 flex justify-center">{illustration}</div>
        ) : (
          <IconComponent className="h-16 w-16 sm:h-20 sm:w-20 text-muted-foreground mx-auto mb-4 opacity-50" />
        )}
      </motion.div>
      {title && (
        <motion.h3
          variants={itemVariants}
          className="text-xl sm:text-2xl font-semibold text-foreground mb-2"
        >
          {title}
        </motion.h3>
      )}
      <motion.p
        variants={itemVariants}
        className="text-muted-foreground mb-6 max-w-md mx-auto text-sm sm:text-base"
      >
        {description || message}
      </motion.p>
      {actionLabel && onAction && (
        <motion.div variants={itemVariants}>
          <Button onClick={onAction} variant="primary" size="lg">
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;
