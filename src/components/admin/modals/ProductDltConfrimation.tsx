"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;

}

export default function ProductDltConfirmation({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: DeleteConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4 dark:bg-black/70">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md"
          >
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">

              {/* Header */}
              <div className=" bg-gradient-to-r from-[#47B083] to-[#3A9E75] text-white py-6 text-center relative">
                <div className="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
                <div className="relative z-10 flex flex-col items-center">
                  <AlertTriangle className="h-10 w-10 mb-2" />
                  <h2 className="text-xl font-bold">Confirm Deletion</h2>
                </div>
              </div>

              {/* Body */}
              <div className="px-6 py-6 text-center">
                <p className="text-gray-700 dark:text-gray-300">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-red-500">
                    "this product"
                  </span>
                  ?
                </p>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  This action cannot be undone.
                </p>

                {/* Buttons */}
                <div className="flex justify-center gap-4 mt-6">
                  <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="px-5 py-2 hover:cursor-pointer rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={onConfirm}
                    disabled={isLoading}
                    className="px-5 py-2 hover:cursor-pointer rounded-lg bg-gradient-to-r from-[#47B083] to-[#3A9E75] text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Yes, Delete"
                    )}
                  </button>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-1 hover:cursor-pointer z-20"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}