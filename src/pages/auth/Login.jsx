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
      setValue('password', 'Password123!', { shouldValidate: true });
    } else {
      setValue('email', 'recruiter@jobportal.com', { shouldValidate: true });
      setValue('password', 'Password123!', { shouldValidate: true });
    }
  };

  return (
    <div className="h-[calc(100dvh-4rem)] max-h-[calc(100dvh-4rem)] flex items-center justify-center p-4 overflow-hidden bg-slate-50 animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-3xl p-5 sm:p-6 shadow-xl shadow-slate-200/50 border border-slate-200 space-y-4 my-auto">
        {/* Compact Header */}
        <div className="text-center space-y-1">
          <div className="w-10 h-10 rounded-2xl bg-emerald-800 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-950/20">
            <Briefcase className="w-5 h-5" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Sign In to VS Job Portal
          </h1>
          <p className="text-xs text-slate-500">
            Access your personalized candidate or recruiter workspace
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setSelectedRole('candidate');
                setAuthError('');
              }}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedRole === 'candidate'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Candidate</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedRole('recruiter');
                setAuthError('');
              }}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedRole === 'recruiter'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Recruiter</span>
            </button>
          </div>

          {/* Inline Quick Demo Fill Bar */}
          <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
            <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-800" />
              Quick Demo Fill:
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickFill('candidate')}
                className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white border border-slate-200 hover:border-emerald-300 text-emerald-800 hover:bg-emerald-50 transition-colors shadow-2xs cursor-pointer"
              >
                Candidate
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('recruiter')}
                className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white border border-slate-200 hover:border-emerald-300 text-emerald-800 hover:bg-emerald-50 transition-colors shadow-2xs cursor-pointer"
              >
                Recruiter
              </button>
            </div>
          </div>
        </div>

        {/* Error Banner */}
        {authError && (
          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-rose-700 text-xs animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span className="truncate">{authError}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {/* Email Address */}
          <div>
            <label
              htmlFor="email"
              className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1"
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
                className={`block w-full pl-9 pr-3 py-2 border rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                  errors.email
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-slate-300 focus:border-emerald-800 focus:ring-emerald-100 bg-white'
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
              <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3" />
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="password"
                className="block text-[11px] font-bold uppercase tracking-wider text-slate-600"
              >
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-[11px] text-emerald-800 hover:text-emerald-950 font-semibold"
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
                placeholder="••••••••"
                className={`block w-full pl-9 pr-9 py-2 border rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                  errors.password
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-slate-300 focus:border-emerald-800 focus:ring-emerald-100 bg-white'
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
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3" />
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center pt-0.5">
            <input
              id="rememberMe"
              type="checkbox"
              className="w-3.5 h-3.5 rounded text-emerald-800 border-slate-300 focus:ring-emerald-800 cursor-pointer"
              {...register('rememberMe')}
            />
            <label
              htmlFor="rememberMe"
              className="ml-2 block text-xs text-slate-600 cursor-pointer select-none"
            >
              Remember me on this device
            </label>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-emerald-950/20 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign in as {selectedRole === 'candidate' ? 'Candidate' : 'Recruiter'}</span>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center text-xs text-slate-500 pt-1">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-bold text-emerald-800 hover:text-emerald-950 hover:underline transition-colors"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;