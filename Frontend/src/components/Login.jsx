
// Below code is the imported libraries
import { useState } from 'react'

// Below code is the user defined UseContest
import { useAuthContext }  from '../contest/AuthContext'

function Login({ onSwitchToRegister }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuthContext()

    // Below code is used to create HandleSubmit function
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const result = await login(email, password)
        
        if (result.success) {

        // Close modal or redirect
        window.location.reload() // Refresh to show logged-in state
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

            {/* Below code is used to handle Error */}
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
                
                <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                        dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                    />
                </div>
            
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