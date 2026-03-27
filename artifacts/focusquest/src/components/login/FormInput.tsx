import { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  isPassword?: boolean;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, isPassword = false, className = '', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const inputType = isPassword ? (showPassword ? 'text' : 'password') : props.type;

    return (
      <div className="w-full">
        <label className="block text-white/80 text-sm font-semibold mb-1.5 tracking-wide">
          {label}
        </label>
        <div className="relative group">
          <input
            ref={ref}
            {...props}
            type={inputType}
            className={`
              w-full bg-white/10 border-2 rounded-xl px-4 py-3 text-white text-base font-medium
              placeholder-white/30 outline-none transition-all duration-200
              ${error
                ? 'border-red-400/70 focus:border-red-400'
                : 'border-white/20 focus:border-white/60 hover:border-white/35'
              }
              ${isPassword ? 'pr-12' : ''}
              ${className}
            `}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors p-0.5"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="mt-1.5 text-red-300 text-xs font-semibold flex items-center gap-1"
            >
              ⚠️ {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';
