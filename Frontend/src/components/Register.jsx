

// Below code is the imported libraries
import { useState } from 'react'

// Below code is the user defined UseContest
import  {useAuthContext}  from '../contest/AuthContext'

function Register({ onSwitchToLogin }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuthContext()

    // Below code is used to create HandleSubmit function
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        
        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }
        
        if (password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }
        
        setLoading(true)
        
        
        
        try {
            const result = await register(name, email, password);
            if (!result.success) {
                // ❌ Danger: If result.error doesn't exist, this might crash
                setError(result.error); 
            }
        } catch (err) {
            // ❌ Danger: If err.response is undefined, err.response.data will crash the app
            setError(err.response.data.message); 
            
            // 🌱 SAFER WAY:
            setError(err.message || "An unexpected error occurred");
        }
    }
    // End of HandleSubmit function

  return (
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
                Create an Account
            </h2>
            
            {/* Below code is used to handle Error  */}
            {error && (
                <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">
                        Name
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                                dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                    />
                </div>
                
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
                
                <div className="mb-4">
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
                
                <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                        dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                    />
                </div>
                
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 
                    disabled:opacity-50 transition-colors"
                >
                    {loading ? 'Creating account...' : 'Register'}
                </button>
            </form>
            
            <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
                Already have an account?{' '}
                <button
                onClick={onSwitchToLogin}
                className="text-blue-500 hover:underline"
            >
                Login
                </button>
            </p>
        </div>
    )
}

export default Register