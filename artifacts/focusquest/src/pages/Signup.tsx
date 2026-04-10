import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import {
  User, Phone, Mail, ChevronRight, ChevronLeft,
  Shield, CheckCircle, RefreshCw, Eye, EyeOff, Gamepad2
} from 'lucide-react';

// ─── Constants ─────────────────────────────────────────────────────────────

const API = import.meta.env.VITE_API_URL || '/api';

const AVATARS = ['🦅', '🐯', '🦁', '🐉', '🦊', '🐺', '🦋', '🤖', '🚀', '⚡', '🎭', '🌟'];

const GRADE_GROUPS = [
  { label: '1st – 4th Standard', emoji: '🌊', theme: 'ocean', grades: [1,2,3,4], desc: 'Sea World Adventure' },
  { label: '5th – 7th Standard', emoji: '🪐', theme: 'space', grades: [5,6,7], desc: 'Space Explorer' },
  { label: '8th – 10th Standard', emoji: '⚡', theme: 'future', grades: [8,9,10], desc: 'Futuristic Mind Lab' },
];

const COUNTRY_CODES = [
  { code: '+91', flag: '🇮🇳', name: 'India' },
  { code: '+1',  flag: '🇺🇸', name: 'USA' },
  { code: '+44', flag: '🇬🇧', name: 'UK' },
  { code: '+971', flag: '🇦🇪', name: 'UAE' },
  { code: '+65', flag: '🇸🇬', name: 'Singapore' },
];

// ─── Step indicators ────────────────────────────────────────────────────────

function StepBar({ step }: { step: number }) {
  const steps = ['Student Info', 'Parent Details', 'Verification'];
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((s, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300
            ${i + 1 < step ? 'bg-green-500/30 text-green-300 border border-green-500/50' :
              i + 1 === step ? 'bg-primary/30 text-white border border-primary/70 scale-105' :
              'bg-white/5 text-white/40 border border-white/10'}`}>
            {i + 1 < step ? <CheckCircle className="w-3 h-3" /> : <span>{i + 1}</span>}
            <span className="hidden sm:inline">{s}</span>
          </div>
          {i < steps.length - 1 && <div className={`w-6 h-px transition-colors duration-300 ${i + 1 < step ? 'bg-green-500/50' : 'bg-white/10'}`} />}
        </div>
      ))}
    </div>
  );
}

// ─── Input component ────────────────────────────────────────────────────────

function Field({ label, icon: Icon, children, hint }: {
  label: string; icon: any; children: React.ReactNode; hint?: string;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-white/80 text-sm font-bold mb-2">
        <Icon className="w-3.5 h-3.5" /> {label}
      </label>
      {children}
      {hint && <p className="text-white/40 text-xs mt-1">{hint}</p>}
    </div>
  );
}

function Input({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full bg-white/10 border-2 border-white/20 focus:border-primary/70 text-white placeholder-white/30
        rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all ${className}`}
    />
  );
}

// ─── Step 1: Student Details ────────────────────────────────────────────────

function Step1({
  data, onChange, onNext
}: {
  data: any; onChange: (k: string, v: any) => void; onNext: () => void;
}) {
  const canProceed = data.fullName.trim() && data.age && data.gradeGroup !== null && data.avatar;

  return (
    <motion.div key="step1" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
      className="space-y-5">
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">🧒</div>
        <h2 className="text-2xl font-black text-white">Create Your Hero</h2>
        <p className="text-white/50 text-sm mt-1">Tell us about the student</p>
      </div>

      <Field label="Full Name" icon={User}>
        <Input
          value={data.fullName}
          onChange={e => onChange('fullName', e.target.value)}
          placeholder="e.g. Arjun Kumar"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Hero Name" icon={Gamepad2} hint="Username for the game">
          <Input
            value={data.studentName}
            onChange={e => onChange('studentName', e.target.value)}
            placeholder="e.g. CaptainArjun"
          />
        </Field>
        <Field label="Age" icon={User}>
          <Input
            type="number"
            min={6} max={18}
            value={data.age}
            onChange={e => onChange('age', e.target.value)}
            placeholder="e.g. 12"
          />
        </Field>
      </div>

      {/* Grade group */}
      <Field label="Class / Standard" icon={User}>
        <div className="grid grid-cols-3 gap-2">
          {GRADE_GROUPS.map((g, i) => (
            <button key={i} onClick={() => { onChange('gradeGroup', i); onChange('grade', g.grades[0]); }}
              className={`p-3 rounded-xl border-2 text-center transition-all font-bold text-xs
                ${data.gradeGroup === i ? 'border-primary bg-primary/20 text-white scale-105' : 'border-white/20 bg-white/5 text-white/60 hover:border-primary/40'}`}>
              <div className="text-2xl mb-1">{g.emoji}</div>
              <div>{g.label}</div>
              <div className="text-white/40 text-[10px]">{g.desc}</div>
            </button>
          ))}
        </div>
      </Field>

      {/* Avatar */}
      <Field label="Choose Your Avatar" icon={User}>
        <div className="grid grid-cols-6 gap-2">
          {AVATARS.map(a => (
            <button key={a} onClick={() => onChange('avatar', a)}
              className={`h-11 rounded-xl text-xl flex items-center justify-center border-2 transition-all
                ${data.avatar === a ? 'border-primary bg-primary/20 scale-110' : 'border-white/20 bg-white/5 hover:border-primary/40'}`}>
              {a}
            </button>
          ))}
        </div>
      </Field>

      <motion.button
        onClick={onNext}
        disabled={!canProceed}
        whileHover={canProceed ? { scale: 1.02 } : {}}
        whileTap={canProceed ? { scale: 0.98 } : {}}
        className={`w-full py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all
          ${canProceed ? 'bg-gradient-to-r from-primary to-violet-500 text-white shadow-lg shadow-primary/30' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}>
        Continue <ChevronRight className="w-5 h-5" />
      </motion.button>
    </motion.div>
  );
}

// ─── Step 2: Parent Details ─────────────────────────────────────────────────

function Step2({
  data, onChange, onNext, onBack, loading, error
}: {
  data: any; onChange: (k: string, v: any) => void; onNext: () => void; onBack: () => void;
  loading: boolean; error: string;
}) {
  const [showCC, setShowCC] = useState(false);
  const canProceed = data.parentName.trim() && data.parentPhone.trim() && data.parentEmail.trim();

  return (
    <motion.div key="step2" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
      className="space-y-5">
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">👨‍👩‍👧</div>
        <h2 className="text-2xl font-black text-white">Parent / Guardian Info</h2>
        <p className="text-white/50 text-sm mt-1">Required for daily progress reports</p>
      </div>

      <div className="bg-primary/10 border border-primary/30 rounded-xl p-3 flex items-start gap-2">
        <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        <p className="text-primary text-xs font-medium">
          Parent details are used exclusively for daily study reports and account verification. Your data is secure.
        </p>
      </div>

      <Field label="Parent / Guardian Full Name" icon={User}>
        <Input
          value={data.parentName}
          onChange={e => onChange('parentName', e.target.value)}
          placeholder="e.g. Priya Kumar"
        />
      </Field>

      <Field label="WhatsApp Phone Number" icon={Phone} hint="Daily reports sent here via WhatsApp">
        <div className="flex gap-2">
          {/* Country code selector */}
          <div className="relative">
            <button onClick={() => setShowCC(v => !v)}
              className="h-full px-3 bg-white/10 border-2 border-white/20 rounded-xl text-white text-sm font-bold flex items-center gap-1 hover:border-primary/50 transition-all min-w-[80px]">
              {data.countryCode} <ChevronRight className="w-3 h-3 rotate-90" />
            </button>
            {showCC && (
              <div className="absolute top-full mt-1 left-0 bg-slate-800 border border-white/20 rounded-xl overflow-hidden z-50 shadow-2xl">
                {COUNTRY_CODES.map(cc => (
                  <button key={cc.code} onClick={() => { onChange('countryCode', cc.code); setShowCC(false); }}
                    className="flex items-center gap-2 px-4 py-2.5 w-full text-left text-sm text-white hover:bg-white/10 transition-colors whitespace-nowrap">
                    <span>{cc.flag}</span> <span>{cc.code}</span> <span className="text-white/50">{cc.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <Input
            className="flex-1"
            type="tel"
            value={data.parentPhone}
            onChange={e => onChange('parentPhone', e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="9876543210"
          />
        </div>
      </Field>

      <Field label="Parent Email Address" icon={Mail} hint="Email verification link sent here">
        <Input
          type="email"
          value={data.parentEmail}
          onChange={e => onChange('parentEmail', e.target.value)}
          placeholder="parent@example.com"
        />
      </Field>

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 text-red-300 text-sm font-medium">
          ⚠️ {error}
        </motion.div>
      )}

      <div className="flex gap-3">
        <button onClick={onBack}
          className="flex-1 py-4 rounded-2xl border-2 border-white/20 text-white/70 font-bold flex items-center justify-center gap-1 hover:border-white/40 transition-all">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <motion.button
          onClick={onNext}
          disabled={!canProceed || loading}
          whileHover={canProceed ? { scale: 1.02 } : {}}
          whileTap={canProceed ? { scale: 0.98 } : {}}
          className={`flex-[2] py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all
            ${canProceed ? 'bg-gradient-to-r from-primary to-violet-500 text-white shadow-lg' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}>
          {loading ? <><span className="animate-spin">⚙️</span> Sending OTP…</> : <>Create Account <ChevronRight className="w-5 h-5" /></>}
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Step 3: Verification ───────────────────────────────────────────────────

function Step3({
  data, parentId, onOtpChange, onVerify, onResend, onFinish,
  loading, error, phoneVerified, resendCountdown
}: {
  data: any; parentId: number; onOtpChange: (v: string) => void;
  onVerify: () => void; onResend: () => void; onFinish: () => void;
  loading: boolean; error: string; phoneVerified: boolean; resendCountdown: number;
}) {
  return (
    <motion.div key="step3" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
      className="space-y-6">
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">🔐</div>
        <h2 className="text-2xl font-black text-white">Verify Your Account</h2>
        <p className="text-white/50 text-sm mt-1">Two quick steps to secure your account</p>
      </div>

      {/* Phone OTP Section */}
      <div className={`rounded-2xl border-2 p-5 transition-all ${phoneVerified ? 'border-green-500/50 bg-green-500/10' : 'border-primary/40 bg-primary/5'}`}>
        <div className="flex items-center gap-3 mb-4">
          {phoneVerified
            ? <CheckCircle className="w-6 h-6 text-green-400" />
            : <Phone className="w-6 h-6 text-primary" />
          }
          <div>
            <h3 className="text-white font-black">{phoneVerified ? '✅ Phone Verified!' : 'Phone Verification'}</h3>
            <p className="text-white/50 text-xs">
              {phoneVerified ? 'Great! Phone is confirmed.' : `OTP sent to ${data.countryCode} ${data.parentPhone}`}
            </p>
          </div>
        </div>

        {!phoneVerified && (
          <>
            <div className="flex gap-2 mb-3">
              {[0,1,2,3,4,5].map(i => (
                <input key={i} maxLength={1} type="text" inputMode="numeric"
                  value={data.otp[i] || ''}
                  onChange={e => {
                    const chars = data.otp.split('');
                    chars[i] = e.target.value.replace(/[^0-9]/g, '');
                    onOtpChange(chars.join(''));
                    if (e.target.value && i < 5) {
                      (e.target.nextElementSibling as HTMLInputElement)?.focus();
                    }
                  }}
                  className="flex-1 h-12 text-center text-lg font-black bg-white/10 border-2 border-white/20 focus:border-primary rounded-xl text-white outline-none transition-all"
                />
              ))}
            </div>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-red-400 text-sm font-medium mb-3">⚠️ {error}</motion.p>
            )}

            <div className="flex gap-2">
              <motion.button onClick={onVerify} disabled={data.otp.length < 6 || loading}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className={`flex-1 py-3 rounded-xl font-black text-sm transition-all
                  ${data.otp.length === 6 ? 'bg-primary text-white' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}>
                {loading ? '⏳ Verifying…' : 'Verify OTP'}
              </motion.button>
              <button onClick={onResend} disabled={resendCountdown > 0}
                className="px-4 py-3 rounded-xl border border-white/20 text-white/60 text-sm font-bold flex items-center gap-1 hover:border-primary/40 transition-all disabled:opacity-40">
                <RefreshCw className="w-3.5 h-3.5" />
                {resendCountdown > 0 ? `${resendCountdown}s` : 'Resend'}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Email verification notice */}
      <div className="rounded-2xl border-2 border-amber-500/40 bg-amber-500/10 p-5">
        <div className="flex items-center gap-3">
          <Mail className="w-6 h-6 text-amber-400" />
          <div>
            <h3 className="text-white font-black">📧 Email Verification Sent</h3>
            <p className="text-white/50 text-xs mt-0.5">
              Check <strong className="text-white">{data.parentEmail}</strong> for a verification link.
              <br />Account is active — email can be verified later.
            </p>
          </div>
        </div>
      </div>

      {phoneVerified && (
        <motion.button
          onClick={onFinish}
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="w-full py-5 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black text-xl shadow-lg shadow-green-500/30 flex items-center justify-center gap-2">
          🎮 Start Your Quest! <ChevronRight className="w-6 h-6" />
        </motion.button>
      )}
    </motion.div>
  );
}

// ─── MAIN SIGNUP PAGE ───────────────────────────────────────────────────────

export function Signup() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [parentId, setParentId] = useState<number>(0);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  const [form, setForm] = useState({
    // Student
    fullName: '',
    studentName: '',
    age: '',
    gradeGroup: null as number | null,
    grade: 3,
    avatar: '🦅',
    // Parent
    parentName: '',
    countryCode: '+91',
    parentPhone: '',
    parentEmail: '',
    // Verification
    otp: '',
  });

  const update = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }));

  const startResendTimer = () => {
    setResendCountdown(30);
    const t = setInterval(() => {
      setResendCountdown(c => {
        if (c <= 1) { clearInterval(t); return 0; }
        return c - 1;
      });
    }, 1000);
  };

  const handleStep2Next = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: form.studentName || form.fullName.split(' ')[0],
          fullName: form.fullName,
          age: form.age,
          grade: form.grade,
          avatar: form.avatar,
          parentName: form.parentName,
          parentPhone: form.countryCode + form.parentPhone,
          parentEmail: form.parentEmail,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');

      // Store student info in localStorage (continue existing flow)
      const heroName = form.studentName || form.fullName.split(' ')[0];
      localStorage.setItem('focusquest_active_user', heroName);
      localStorage.setItem('focusquest_user_id', String(data.userId));
      localStorage.setItem('focusquest_parent_id', String(data.parentId));

      setParentId(data.parentId);
      startResendTimer();
      setStep(3);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parentId, otp: form.otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'OTP verification failed');
      setPhoneVerified(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    try {
      await fetch(`${API}/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parentId }),
      });
      startResendTimer();
    } catch {
      setError('Failed to resend OTP');
    }
  };

  const handleFinish = () => {
    // Redirect to setup to complete profile (grade, subjects, etc.)
    sessionStorage.setItem('pending_new_user', form.studentName || form.fullName.split(' ')[0]);
    setLocation('/setup');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <AnimatedBackground />

      {/* Floating emojis */}
      {['🎮','⭐','🏆','📚','🚀','💎','🎯','🌟'].map((e, i) => (
        <motion.div key={i} className="fixed text-2xl pointer-events-none z-0 select-none"
          style={{ left: `${(i * 12 + 5) % 90}%`, top: `${(i * 13 + 10) % 80}%` }}
          animate={{ y: [0, -18, 0], rotate: [0, 10, -10, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 3 + i * 0.4, delay: i * 0.3, repeat: Infinity, ease: 'easeInOut' }}>
          {e}
        </motion.div>
      ))}

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <img src="/background/bg_logo-removebg-preview.png" alt="FocusQuest"
            className="h-20 w-auto mx-auto mb-3 object-contain drop-shadow-[0_0_20px_rgba(46,196,255,0.4)]" />
          <p className="text-white/60 text-sm font-semibold">Create your free account</p>
        </div>

        <div className="bg-white/8 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl"
          style={{ boxShadow: '0 30px 70px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)' }}>

          <StepBar step={step} />

          <AnimatePresence mode="wait">
            {step === 1 && (
              <Step1 data={form} onChange={update} onNext={() => setStep(2)} />
            )}
            {step === 2 && (
              <Step2
                data={form} onChange={update}
                onNext={handleStep2Next} onBack={() => setStep(1)}
                loading={loading} error={error}
              />
            )}
            {step === 3 && (
              <Step3
                data={form} parentId={parentId}
                onOtpChange={v => update('otp', v)}
                onVerify={handleVerifyOTP}
                onResend={handleResendOTP}
                onFinish={handleFinish}
                loading={loading} error={error}
                phoneVerified={phoneVerified}
                resendCountdown={resendCountdown}
              />
            )}
          </AnimatePresence>

          {/* Footer link */}
          <p className="text-center text-white/40 text-xs mt-6">
            Already have an account?{' '}
            <button onClick={() => setLocation('/login')} className="text-primary hover:underline font-semibold">
              Sign in
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
