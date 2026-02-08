import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ReusableComponent/Input';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

function AuthPage() {
  const navigate = useNavigate();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    username: '',
    confirmPassword: '',
  });

  const passwordMismatch =
    mode === 'signup' &&
    formData.confirmPassword.length > 0 &&
    formData.password !== formData.confirmPassword;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (mode === 'signup') {
      await signup();
    } else {
      await signin();
    }
  };

  const signup = async () => {
    const res = await fetch('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        fullName: formData.fullName,
        email: formData.email,
        username: formData.username,
        password: formData.password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || 'Signup failed');
      return;
    }

    await signin();
  };

  const signin = async () => {
    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        username: formData.username,
        password: formData.password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || 'Invalid credentials');
      return;
    }

    navigate('/page/new', { replace: true });
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center p-4">
      <motion.form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-[#1c1c1e] rounded-3xl 
                 border border-white/[0.08] shadow-2xl px-8 py-10 flex flex-col gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <motion.div
          className="text-center space-y-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-3xl font-semibold text-white">
            {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-sm text-white/50">
            {mode === 'signin'
              ? 'Sign in to continue to your workspace'
              : 'Sign up to get started with your workspace'}
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          className="flex rounded-xl bg-white/[0.06] p-1 border border-white/[0.06]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <motion.button
            type="button"
            onClick={() => setMode('signin')}
            className={`flex-1 py-2.5 text-sm rounded-lg transition-all font-medium relative
              ${mode === 'signin' ? 'text-white' : 'text-white/50 hover:text-white/70'}`}
            whileTap={{ scale: 0.98 }}
          >
            {mode === 'signin' && (
              <motion.div
                className="absolute inset-0 bg-white/[0.12] rounded-lg"
                layoutId="activeTab"
                transition={{ type: 'spring', stiffness: 400, damping: 40 }}
              />
            )}
            <span className="relative z-10">Sign In</span>
          </motion.button>

          <motion.button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 py-2.5 text-sm rounded-lg transition-all font-medium relative
              ${mode === 'signup' ? 'text-white' : 'text-white/50 hover:text-white/70'}`}
            whileTap={{ scale: 0.98 }}
          >
            {mode === 'signup' && (
              <motion.div
                className="absolute inset-0 bg-white/[0.12] rounded-lg"
                layoutId="activeTab"
                transition={{ type: 'spring', stiffness: 400, damping: 40 }}
              />
            )}
            <span className="relative z-10">Sign Up</span>
          </motion.button>
        </motion.div>

        {/* Form Fields */}
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            className="flex flex-col gap-4"
            initial={{ opacity: 0, x: mode === 'signup' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: mode === 'signup' ? -20 : 20 }}
            transition={{ duration: 0.2 }}
          >
            {mode === 'signup' && (
              <Input
                name="fullName"
                label="Full Name"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                className="bg-white/[0.06] border-white/[0.08] text-white placeholder-white/30
                         focus:border-white/20 focus:bg-white/[0.08]"
              />
            )}

            <Input
              name="username"
              label="Username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              className="bg-white/[0.06] border-white/[0.08] text-white placeholder-white/30
                       focus:border-white/20 focus:bg-white/[0.08]"
            />

            {mode === 'signup' && (
              <Input
                name="email"
                label="Email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                className="bg-white/[0.06] border-white/[0.08] text-white placeholder-white/30
                         focus:border-white/20 focus:bg-white/[0.08]"
              />
            )}

            {/* Password */}
            <div className="relative">
              <Input
                name="password"
                type={showPassword ? 'text' : 'password'}
                label="Password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="bg-white/[0.06] border-white/[0.08] text-white placeholder-white/30
                         focus:border-white/20 focus:bg-white/[0.08] pr-12"
              />
              <motion.button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-[42px] text-white/40 hover:text-white/70"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {showPassword ? (
                  <AiFillEyeInvisible size={20} />
                ) : (
                  <AiFillEye size={20} />
                )}
              </motion.button>
            </div>

            {/* Confirm Password */}
            {mode === 'signup' && (
              <div className="relative">
                <Input
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  label="Confirm Password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="bg-white/[0.06] border-white/[0.08] text-white placeholder-white/30
                           focus:border-white/20 focus:bg-white/[0.08] pr-12"
                />
                <motion.button
                  type="button"
                  onClick={() => setShowConfirmPassword((p) => !p)}
                  className="absolute right-3 top-[42px] text-white/40 hover:text-white/70"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showConfirmPassword ? (
                    <AiFillEyeInvisible size={20} />
                  ) : (
                    <AiFillEye size={20} />
                  )}
                </motion.button>

                <AnimatePresence>
                  {passwordMismatch && (
                    <motion.p
                      className="text-xs text-red-400 mt-1.5"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                    >
                      Passwords do not match
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={passwordMismatch}
          className="w-full rounded-xl bg-white text-black py-3 text-sm font-semibold
                   hover:bg-white/90 transition-colors
                   disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: passwordMismatch ? 1 : 1.02 }}
          whileTap={{ scale: passwordMismatch ? 1 : 0.98 }}
        >
          {mode === 'signin' ? 'Sign In' : 'Create Account'}
        </motion.button>

        {/* Footer */}
        <motion.p
          className="text-xs text-center text-white/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {mode === 'signin'
            ? "Don't have an account? Sign up instead."
            : 'Already have an account? Sign in instead.'}
        </motion.p>
      </motion.form>
    </div>
  );
}

export default AuthPage;
