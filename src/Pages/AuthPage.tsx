import { useState } from 'react';
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

  // 🔑 FORM SUBMIT HANDLER
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (mode === 'signup') {
      await signup();
    } else {
      await signin();
    }
  };

  console.log('handle submit was fired', handleSubmit);

  // SIGNUP → AUTO SIGNIN → EDITOR
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

    //AUTO LOGIN AFTER SIGNUP
    await signin();
  };

  //SIGNIN → EDITOR
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

    //Cookie is set by backend
    navigate('/page/new', { replace: true });
  };

  return (
    <div className="min-h-screen w-full bg-neutral-100 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-[420px] bg-white rounded-2xl shadow-xl px-8 py-10 flex flex-col gap-6"
      >
        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-semibold text-neutral-900">
            {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-sm text-neutral-500">
            {mode === 'signin'
              ? 'Sign in to continue to your account'
              : 'Sign up to get started with your account'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex rounded-lg bg-neutral-100 p-1">
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`flex-1 py-2 text-sm rounded-md transition
              ${
                mode === 'signin'
                  ? 'bg-white shadow text-neutral-900'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 text-sm rounded-md transition
              ${
                mode === 'signup'
                  ? 'bg-white shadow text-neutral-900'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-4">
          {mode === 'signup' && (
            <Input
              name="fullName"
              label="Full Name"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
            />
          )}

          <Input
            name="username"
            label="Username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
          />

          {mode === 'signup' && (
            <Input
              name="email"
              label="Email"
              placeholder="john@gmail.com"
              value={formData.email}
              onChange={handleChange}
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
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-[42px] text-neutral-400 hover:text-neutral-700"
            >
              {showPassword ? (
                <AiFillEyeInvisible size={18} />
              ) : (
                <AiFillEye size={18} />
              )}
            </button>
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
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((p) => !p)}
                className="absolute right-3 top-[42px] text-neutral-400 hover:text-neutral-700"
              >
                {showConfirmPassword ? (
                  <AiFillEyeInvisible size={18} />
                ) : (
                  <AiFillEye size={18} />
                )}
              </button>

              {passwordMismatch && (
                <p className="text-xs text-red-500 mt-1">
                  Passwords do not match
                </p>
              )}
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={passwordMismatch}
          className="w-full rounded-lg bg-black text-white py-2.5 text-sm font-medium
            hover:bg-neutral-800 transition
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {mode === 'signin' ? 'Sign In' : 'Create Account'}
        </button>

        {/* Footer */}
        <p className="text-xs text-center text-neutral-500">
          {mode === 'signin'
            ? "Don't have an account? Sign up instead."
            : 'Already have an account? Sign in instead.'}
        </p>
      </form>
    </div>
  );
}

export default AuthPage;
