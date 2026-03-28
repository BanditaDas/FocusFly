import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface AbortModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function AbortModal({ open, onCancel, onConfirm }: AbortModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-slate-900 p-6 rounded-2xl text-center"
          >
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />

            <h3 className="text-xl font-bold mb-2">Abort Flight?</h3>
            <p className="text-slate-400 mb-6">
              Your focus session will end early.
            </p>

            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 bg-slate-700 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={onConfirm}
                className="flex-1 bg-red-600 py-2 rounded"
              >
                Abort
              </button>
            </div>
          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
}