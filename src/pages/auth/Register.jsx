import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  Building2,
  Globe,
  Briefcase,
  AlertCircle,
  Loader2,
  UserCheck,
} from 'lucide-react';

export const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('candidate');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      role: 'candidate',
      title: '',
      companyName: '',
      companyWebsite: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false,
    },
    mode: 'onTouched',
  });

  const passwordValue = watch('password');

  const onSubmit = async (data) => {
    setAuthError('');
    setIsSubmitting(true);
    try {
      const res = await registerUser({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        role: role,
        title: role === 'candidate' ? data.title : '',
        companyName: role === 'recruiter' ? data.companyName : '',
        companyWebsite: role === 'recruiter' ? data.companyWebsite : '',
        password: data.password,
      });

      if (res.success) {
        const targetPath =
          role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard';
        navigate(targetPath, { replace: true });
      } else {
        setAuthError(res.error || 'Registration failed');
      }
    } catch {
      setAuthError('An unexpected error occurred during registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 mb-4">
            <Briefcase className="w-7 h-7" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Create Your Account
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Join thousands of professionals and employers on JobPortal.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white py-8 px-6 sm:px-8 shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-100">
          {/* Role Selection Interactive Cards */}
          <div className="mb-6">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              I want to register as:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Candidate Option */}
              <div
                onClick={() => setRole('candidate')}
                className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-start gap-3 ${
                  role === 'candidate'
                    ? 'border-indigo-600 bg-indigo-50/40 shadow-sm ring-1 ring-indigo-600/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    role === 'candidate'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Candidate</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Looking for job openings & career growth
                  </p>
                </div>
              </div>

              {/* Recruiter Option */}
              <div
                onClick={() => setRole('recruiter')}
                className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-start gap-3 ${
                  role === 'recruiter'
                    ? 'border-indigo-600 bg-indigo-50/40 shadow-sm ring-1 ring-indigo-600/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    role === 'recruiter'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Recruiter</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Hiring talent & managing company listings
                  </p>
                </div>
              </div>
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
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="fullName"
                  type="text"
                  placeholder={role === 'candidate' ? 'Jane Doe' : 'Sarah Miller'}
                  className={`block w-full pl-10 pr-3 py-2.5 border rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.fullName
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20'
                      : 'border-slate-300 focus:border-indigo-600 focus:ring-indigo-100 bg-white'
                  }`}
                  {...register('fullName', {
                    required: 'Full name is required',
                    minLength: {
                      value: 2,
                      message: 'Full name must be at least 2 characters',
                    },
                  })}
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email and Phone Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Email */}
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
                        message: 'Enter a valid email address',
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

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className={`block w-full pl-10 pr-3 py-2.5 border rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.phone
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20'
                        : 'border-slate-300 focus:border-indigo-600 focus:ring-indigo-100 bg-white'
                    }`}
                    {...register('phone', {
                      required: 'Phone number is required',
                      minLength: {
                        value: 7,
                        message: 'Phone number must be at least 7 digits',
                      },
                    })}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            {/* Dynamic Fields Based on Role */}
            {role === 'candidate' ? (
              <div>
                <label
                  htmlFor="title"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1"
                >
                  Desired Job Title / Specialization
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <input
                    id="title"
                    type="text"
                    placeholder="e.g. Frontend Developer, UI Designer"
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-indigo-600 focus:ring-indigo-100 bg-white transition-all"
                    {...register('title')}
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="companyName"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1"
                  >
                    Company Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <input
                      id="companyName"
                      type="text"
                      placeholder="e.g. Acme Innovations Inc."
                      className={`block w-full pl-10 pr-3 py-2.5 border rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                        errors.companyName
                          ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20'
                          : 'border-slate-300 focus:border-indigo-600 focus:ring-indigo-100 bg-white'
                      }`}
                      {...register('companyName', {
                        required: 'Company name is required for recruiters',
                      })}
                    />
                  </div>
                  {errors.companyName && (
                    <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.companyName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="companyWebsite"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1"
                  >
                    Company Website (Optional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Globe className="w-4 h-4" />
                    </div>
                    <input
                      id="companyWebsite"
                      type="url"
                      placeholder="https://company.example.com"
                      className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-indigo-600 focus:ring-indigo-100 bg-white transition-all"
                      {...register('companyWebsite')}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Password and Confirm Password Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Min 6 characters"
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
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
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

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Repeat password"
                    className={`block w-full pl-10 pr-10 py-2.5 border rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.confirmPassword
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20'
                        : 'border-slate-300 focus:border-indigo-600 focus:ring-indigo-100 bg-white'
                    }`}
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (value) =>
                        value === passwordValue || 'Passwords do not match',
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="agreeTerms"
                    type="checkbox"
                    className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                    {...register('agreeTerms', {
                      required: 'You must accept the terms to continue',
                    })}
                  />
                </div>
                <div className="ml-3 text-xs text-slate-600">
                  <label htmlFor="agreeTerms">
                    I agree to the{' '}
                    <span className="text-indigo-600 hover:underline cursor-pointer">
                      Terms of Service
                    </span>{' '}
                    and{' '}
                    <span className="text-indigo-600 hover:underline cursor-pointer">
                      Privacy Policy
                    </span>
                    .
                  </label>
                </div>
              </div>
              {errors.agreeTerms && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.agreeTerms.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-3 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-indigo-200 hover:shadow-indigo-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                `Register as ${role === 'candidate' ? 'Candidate' : 'Recruiter'}`
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-6 text-center text-xs text-slate-600">
            Already registered on JobPortal?{' '}
            <Link
              to="/login"
              className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Sign In here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
