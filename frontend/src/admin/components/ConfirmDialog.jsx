import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import Button from '../../components/Button';

export const ConfirmDialog = ({
  isOpen,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDestructive = true,
  onConfirm,
  onCancel,
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E2E8F0]"
        >
          <div className="flex items-start gap-4">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isDestructive
                  ? 'bg-rose-100 text-rose-600'
                  : 'bg-amber-100 text-amber-600'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-[#0F172A]">{title}</h3>
              <p className="text-sm text-[#64748B] mt-1 leading-relaxed">{message}</p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <Button
              onClick={onCancel}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              {cancelText}
            </Button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`px-4 py-2 text-xs font-bold rounded-lg text-white transition-colors disabled:opacity-50 ${
                isDestructive
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : 'bg-[#2563EB] hover:bg-[#1D4ED8]'
              }`}
            >
              {loading ? 'Processing...' : confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmDialog;
