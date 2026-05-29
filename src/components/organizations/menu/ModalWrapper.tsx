import { motion } from "framer-motion";
import { createPortal } from "react-dom";

interface ModalWrapperProps {
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}

const ModalWrapper = ({
  onClose,
  children,
  maxWidth = "max-w-md",
}: ModalWrapperProps) => {
  return createPortal(
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-neutral-950/40 dark:bg-neutral-950/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Centering container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.97 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className={`relative w-full ${maxWidth} bg-white dark:bg-neutral-900 rounded-2xl shadow-modal border border-neutral-200 dark:border-neutral-700 overflow-hidden pointer-events-auto`}
        >
          {children}
        </motion.div>
      </div>
    </>,
    document.body
  );
};

export default ModalWrapper;
