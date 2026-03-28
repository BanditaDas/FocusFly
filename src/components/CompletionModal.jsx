import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

export default function CompletionModal({ open, onConfirm }) {
    return (
        <AnimatePresence>
          {open && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-slate-900 w-full max-w-md p-8 rounded-2xl text-center"
              >
                <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />

                <h3 className="text-2xl font-bold mb-2">Flight Landed!</h3>
                <p className="text-slate-400 mb-6">
                  You stayed focused. Good job.
                </p>

                <button
                  onClick={onConfirm}
                  className="w-full bg-emerald-600 py-3 rounded"
                >
                  Return to Dashboard
                </button>
              </motion.div>

            </div>
          )}
        </AnimatePresence>

        
    );
}