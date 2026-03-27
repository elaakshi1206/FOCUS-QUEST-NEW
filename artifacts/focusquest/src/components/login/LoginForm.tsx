import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, LogIn, UserPlus, UserCheck } from 'lucide-react';
import { FormInput } from './FormInput';
import { SocialLoginButtons } from './SocialLoginButtons';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Mode = 'login' | 'signup';

interface FormErrors {
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
}

interface LoginFormProps {
  onSuccess: (identifier: string, isNewUser: boolean) => void;
  onGuest: () => void;
}

export function LoginForm({ onSuccess, onGuest }: LoginFormProps) {
  const [mode, setMode] = useState<Mode>('login');

  // Shared fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Sign-up only fields
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'apple' | null>(null);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);

  const isLoginEmpty = !email.trim() || !password.trim();
  const isSignupEmpty = !username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim();
  const isEmpty = mode === 'login' ? isLoginEmpty : isSignupEmpty;

  const clearErrors = () => setErrors({});

  const switchMode = (next: Mode) => {
    setMode(next);
    clearErrors();
  };

  const validateLogin = useCallback((): boolean => {
    const e: FormErrors = {};
    if (!email.trim()) {
      e.email = 'Email or username is required';
    } else if (email.includes('@') && !EMAIL_RE.test(email)) {
      e.email = 'Enter a valid email address';
    }
    if (!password.trim()) {
      e.password = 'Password is required';
    } else if (password.length < 4) {
      e.password = 'Password must be at least 4 characters';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [email, password]);

  const validateSignup = useCallback((): boolean => {
    const e: FormErrors = {};
    if (!username.trim()) {
      e.username = 'Hero name is required';
    } else if (username.trim().length < 2) {
      e.username = 'Hero name must be at least 2 characters';
    }
    if (!email.trim()) {
      e.email = 'Email is required';
    } else if (!EMAIL_RE.test(email)) {
      e.email = 'Enter a valid email address';
    }
    if (!password.trim()) {
      e.password = 'Password is required';
    } else if (password.length < 6) {
      e.password = 'Password must be at least 6 characters';
    }
    if (!confirmPassword.trim()) {
      e.confirmPassword = 'Please confirm your password';
    } else if (confirmPassword !== password) {
      e.confirmPassword = 'Passwords do not match';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [username, email, password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const valid = mode === 'login' ? validateLogin() : validateSignup();
    if (!valid) return;

    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setIsLoading(false);

    const identifier = mode === 'signup' ? username.trim() : email.trim();
    onSuccess(identifier, mode === 'signup');
  };

  const handleSocial = async (provider: 'google' | 'apple') => {
    setSocialLoading(provider);
    await new Promise(r => setTimeout(r, 1000));
    setSocialLoading(null);
    onSuccess(provider === 'google' ? 'GoogleHero' : 'AppleHero', false);
  };

  const handleForgotPassword = () => {
    alert('A password reset link has been sent! (Demo — not wired to backend)');
  };

  const isBusy = isLoading || socialLoading !== null;

  return (
    <div>
      {/* ── Mode Tabs ── */}
      <div className="flex bg-white/10 rounded-2xl p-1 mb-5 gap-1">
        {(['login', 'signup'] as Mode[]).map(m => (
          <button
            key={m}
            type="button"
            onClick={() => switchMode(m)}
            className="relative flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors z-10"
            style={{ color: mode === m ? '#1a1a1a' : 'rgba(255,255,255,0.55)' }}
          >
            {mode === m && (
              <motion.div
                layoutId="tab-pill"
                className="absolute inset-0 bg-yellow-300 rounded-xl"
                style={{ zIndex: -1 }}
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}
            {m === 'login' ? '🗝️ Sign In' : '⚔️ Sign Up'}
          </button>
        ))}
      </div>

      {/* ── Forms ── */}
      <AnimatePresence mode="wait">
        <motion.form
          key={mode}
          onSubmit={handleSubmit}
          noValidate
          initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: mode === 'login' ? 20 : -20 }}
          transition={{ duration: 0.22 }}
          className="space-y-4"
        >
          {/* ── Sign Up: Hero Name ── */}
          {mode === 'signup' && (
            <FormInput
              ref={usernameRef}
              label="Hero Name"
              id="fq-username"
              type="text"
              placeholder="e.g. Captain Nova ⚡"
              value={username}
              onChange={e => { setUsername(e.target.value); setErrors(p => ({ ...p, username: undefined })); }}
              error={errors.username}
              autoComplete="username"
              disabled={isBusy}
            />
          )}

          {/* ── Email ── */}
          <FormInput
            ref={emailRef}
            label={mode === 'login' ? 'Email or Username' : 'Email Address'}
            id="fq-email"
            type="email"
            placeholder="explorer@focusquest.com"
            value={email}
            onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })); }}
            error={errors.email}
            autoComplete="email"
            disabled={isBusy}
          />

          {/* ── Password ── */}
          <FormInput
            ref={passwordRef}
            label="Password"
            id="fq-password"
            isPassword
            placeholder={mode === 'signup' ? 'Create a strong password 🔒' : 'Your secret spell ✨'}
            value={password}
            onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })); }}
            error={errors.password}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            disabled={isBusy}
          />

          {/* ── Sign Up: Confirm Password ── */}
          {mode === 'signup' && (
            <FormInput
              ref={confirmRef}
              label="Confirm Password"
              id="fq-confirm-password"
              isPassword
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={e => { setConfirmPassword(e.target.value); setErrors(p => ({ ...p, confirmPassword: undefined })); }}
              error={errors.confirmPassword}
              autoComplete="new-password"
              disabled={isBusy}
            />
          )}

          {/* ── Forgot Password (login only) ── */}
          {mode === 'login' && (
            <div className="flex justify-end -mt-1">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs text-white/50 hover:text-yellow-300 font-semibold transition-colors"
              >
                Forgot Password?
              </button>
            </div>
          )}

          {/* ── Sign Up: Terms note ── */}
          {mode === 'signup' && (
            <p className="text-white/40 text-xs text-center -mt-1">
              By signing up you agree to the{' '}
              <span className="text-yellow-300/70 cursor-pointer hover:text-yellow-300">Terms of Service</span>
            </p>
          )}

          {/* ── Primary CTA ── */}
          <motion.button
            type="submit"
            disabled={isEmpty || isBusy}
            whileHover={!isEmpty && !isBusy ? { scale: 1.02, y: -1 } : {}}
            whileTap={!isEmpty && !isBusy ? { scale: 0.97 } : {}}
            className="
              w-full flex items-center justify-center gap-2.5
              bg-gradient-to-r from-yellow-400 to-amber-400
              hover:from-yellow-300 hover:to-amber-300
              text-yellow-900 font-black text-base
              rounded-xl py-3.5 px-6
              transition-all duration-200
              shadow-lg shadow-yellow-500/20
              disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
            "
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {mode === 'login' ? 'Entering Quest...' : 'Creating Hero...'}
                </motion.span>
              ) : (
                <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                  {mode === 'login' ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                  {mode === 'login' ? 'Start Quest' : 'Create Account'}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* ── Divider ── */}
          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-white/15" />
            <span className="text-white/40 text-xs font-bold tracking-widest uppercase">or</span>
            <div className="flex-1 h-px bg-white/15" />
          </div>

          {/* ── Social Login ── */}
          <SocialLoginButtons
            onGoogleLogin={() => handleSocial('google')}
            onAppleLogin={() => handleSocial('apple')}
            disabled={isBusy}
          />

          {/* Social loading */}
          <AnimatePresence>
            {socialLoading && (
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-center text-white/50 text-xs font-semibold flex items-center justify-center gap-2"
              >
                <Loader2 className="w-3 h-3 animate-spin" />
                Connecting to {socialLoading === 'google' ? 'Google' : 'Apple'}...
              </motion.p>
            )}
          </AnimatePresence>

          {/* ── Guest ── */}
          <motion.button
            type="button"
            onClick={onGuest}
            disabled={isBusy}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="
              w-full flex items-center justify-center gap-2
              bg-transparent hover:bg-white/10
              border-2 border-white/20 hover:border-white/40
              text-white/70 hover:text-white font-semibold text-sm
              rounded-xl py-3 px-6
              transition-all duration-200
              disabled:opacity-40 disabled:cursor-not-allowed
            "
          >
            <UserCheck className="w-4 h-4" />
            Continue as Guest
          </motion.button>

          {/* ── Mode switch link ── */}
          <p className="text-center text-white/45 text-xs font-medium pt-1">
            {mode === 'login' ? (
              <>Don't have an account?{' '}
                <button type="button" onClick={() => switchMode('signup')} className="text-yellow-300 font-bold hover:underline">
                  Sign Up free
                </button>
              </>
            ) : (
              <>Already have an account?{' '}
                <button type="button" onClick={() => switchMode('login')} className="text-yellow-300 font-bold hover:underline">
                  Sign In
                </button>
              </>
            )}
          </p>
        </motion.form>
      </AnimatePresence>
    </div>
  );
}
