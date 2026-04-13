import { useState, useEffect, useRef } from 'react'
import { X, Eye, EyeOff, Home, Loader2 } from 'lucide-react'
import { useSeller } from '../../context/SellerContext.jsx'

export default function AuthModal({ isOpen, onClose, defaultTab = 'signin' }) {
  const { signIn, signUp } = useSeller()
  const [tab, setTab] = useState(defaultTab)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const overlayRef = useRef(null)

  // Reset state when modal opens/tab changes
  useEffect(() => {
    if (isOpen) {
      setTab(defaultTab)
      setError('')
      setShowPassword(false)
    }
  }, [isOpen, defaultTab])

  // Close on Escape
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  // Sign In state
  const [signInForm, setSignInForm] = useState({ email: '', password: '' })

  // Sign Up state
  const [signUpForm, setSignUpForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  })

  if (!isOpen) return null

  function handleOverlayClick(e) {
    if (e.target === overlayRef.current) onClose()
  }

  async function handleSignIn(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise((r) => setTimeout(r, 400)) // simulate network
    const result = signIn(signInForm.email, signInForm.password)
    setLoading(false)
    if (result.success) {
      onClose()
    } else {
      setError(result.error)
    }
  }

  async function handleSignUp(e) {
    e.preventDefault()
    setError('')
    if (signUpForm.password !== signUpForm.confirm) {
      setError('Passwords do not match.')
      return
    }
    if (signUpForm.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 400))
    const result = signUp(signUpForm.name, signUpForm.email, signUpForm.password)
    setLoading(false)
    if (result.success) {
      onClose()
    } else {
      setError(result.error)
    }
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative animate-fade-in-up">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Logo */}
        <div className="flex flex-col items-center pt-8 pb-2 px-8">
          <div className="w-11 h-11 bg-navy-800 rounded-xl flex items-center justify-center mb-3">
            <Home size={22} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-navy-900">
            {tab === 'signin' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {tab === 'signin'
              ? 'Sign in to your FSBO Market account'
              : 'Start selling your home on your terms'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex mx-8 mt-6 bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => { setTab('signin'); setError('') }}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              tab === 'signin'
                ? 'bg-white text-navy-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setTab('signup'); setError('') }}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              tab === 'signup'
                ? 'bg-white text-navy-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Create Account
          </button>
        </div>

        <div className="px-8 py-6">
          {/* Error */}
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {error}
            </div>
          )}

          {/* ── SIGN IN FORM ── */}
          {tab === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  autoFocus
                  placeholder="you@example.com"
                  value={signInForm.email}
                  onChange={(e) => setSignInForm({ ...signInForm, email: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={signInForm.password}
                    onChange={(e) => setSignInForm({ ...signInForm, password: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div className="text-right mt-1">
                  <button type="button" className="text-xs text-navy-600 hover:underline">
                    Forgot password?
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-navy-800 text-white font-medium rounded-lg hover:bg-navy-900 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
              <p className="text-center text-xs text-gray-500">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setTab('signup'); setError('') }}
                  className="text-navy-700 font-medium hover:underline"
                >
                  Create one
                </button>
              </p>

              {/* Demo hint */}
              <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                <strong>Demo account:</strong> marcus@example.com / password
              </div>
            </form>
          )}

          {/* ── SIGN UP FORM ── */}
          {tab === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full name
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="Jane Smith"
                  value={signUpForm.name}
                  onChange={(e) => setSignUpForm({ ...signUpForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={signUpForm.email}
                  onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Min. 6 characters"
                    value={signUpForm.password}
                    onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Re-enter password"
                  value={signUpForm.confirm}
                  onChange={(e) => setSignUpForm({ ...signUpForm, confirm: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-accent-500 text-white font-medium rounded-lg hover:bg-accent-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
              <p className="text-center text-xs text-gray-500">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setTab('signin'); setError('') }}
                  className="text-navy-700 font-medium hover:underline"
                >
                  Sign in
                </button>
              </p>
              <p className="text-center text-xs text-gray-400">
                By creating an account you agree to our{' '}
                <span className="text-navy-600 hover:underline cursor-pointer">Terms</span> and{' '}
                <span className="text-navy-600 hover:underline cursor-pointer">Privacy Policy</span>.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
