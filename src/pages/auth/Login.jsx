import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  Building2,
  Briefcase,
  AlertCircle,
  Loader2,
  Sparkles,
} from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('candidate');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
    mode: 'onTouched',
  });

  const onSubmit = async (data) => {
    setAuthError('');
    setIsSubmitting(true);
    try {
      const res = await login({
        email: data.email,
        password: data.password,
        role: selectedRole,
      });

      if (res.success) {
        const targetPath =
          res.user.role === 'recruiter'
            ? '/recruiter/dashboard'
            : '/candidate/dashboard';
        navigate(location.state?.from?.pathname || targetPath, { replace: true });
      } else {
        setAuthError(res.error || 'Invalid credentials');
      }
    } catch {
      setAuthError('An unexpected error occurred during login.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick-fill helper for instant demo testing
  const handleQuickFill = (role) => {
    setSelectedRole(role);
    setAuthError('');
    if (role === 'candidate') {
      setValue('email', 'candidate@jobportal.com', { shouldValidate: true });
      setValue('password', 'Password123', { shouldValidate: true });
    } else {
      setValue('email', 'recruiter@jobportal.com', { shouldValidate: true });
      setValue('password', 'Password123', { shouldValidate: true });
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 mb-4">
            <Briefcase className="w-7 h-7" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Sign In to JobPortal
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Welcome back! Access your personalized job portal dashboard.
          </p>
        </div>

        {/* Demo Credentials Helper Pill */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-indigo-900 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Quick Demo Fill:
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('candidate')}
              className="text-xs py-1.5 px-2.5 rounded-lg bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-600 hover:text-white font-medium transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer"
            >
              <UserCheck className="w-3 h-3" /> Candidate Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('recruiter')}
              className="text-xs py-1.5 px-2.5 rounded-lg bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-600 hover:text-white font-medium transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer"
            >
              <Building2 className="w-3 h-3" /> Recruiter Demo
            </button>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white py-8 px-6 sm:px-8 shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-100">
          {/* Role Selection Tabs */}
          <div className="mb-6">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Select Your Role
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('candidate');
                  setAuthError('');
                }}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedRole === 'candidate'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                Candidate
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('recruiter');
                  setAuthError('');
                }}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedRole === 'recruiter'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-4 h-4" />
                Recruiter
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {authError && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{authError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  className={`block w-full pl-10 pr-3 py-2.5 border rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.email
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20'
                      : 'border-slate-300 focus:border-indigo-600 focus:ring-indigo-100 bg-white'
                  }`}
                  {...register('email', {
                    required: 'Email address is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Please enter a valid email address',
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className={`block w-full pl-10 pr-10 py-2.5 border rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.password
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20'
                      : 'border-slate-300 focus:border-indigo-600 focus:ring-indigo-100 bg-white'
                  }`}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="rememberMe"
                type="checkbox"
                className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                {...register('rememberMe')}
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 block text-xs text-slate-600 cursor-pointer"
              >
                Remember me on this browser
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-indigo-200 hover:shadow-indigo-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                `Sign in as ${selectedRole === 'candidate' ? 'Candidate' : 'Recruiter'}`
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-6 text-center text-xs text-slate-600">
            Don't have an account yet?{' '}
            <Link
              to="/register"
              className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
