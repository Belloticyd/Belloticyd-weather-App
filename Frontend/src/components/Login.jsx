import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import PasswordInput from './PasswordInput'

function Login({ onSwitchToRegister }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, isAuthenticated } = useAuth()

  // If already authenticated, close modal
  useEffect(() => {
    if (isAuthenticated) {
      // The modal will close via AuthModal's useEffect
    }
  }, [isAuthenticated])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    console.log('Submitting login for:', email)
    const result = await login(email, password)
    console.log('Login result:', result)
    
    if (result.success) {
      console.log('Login successful, modal will close')
      // Modal will close automatically via AuthModal's useEffect
    } else {
      setError(result.error)
    }
    
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
        Login to Your Account
      </h2>
      
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                       dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>
        
        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          showStrength={false}
        />
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 
                     disabled:opacity-50 transition-colors"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
        Don't have an account?{' '}
        <button
          onClick={onSwitchToRegister}
          className="text-blue-500 hover:underline"
        >
          Register
        </button>
      </p>
    </div>
  )
}

export default Login