


import { useState } from 'react'

function PasswordInput({ value, onChange, placeholder = "Password", showStrength = false }) {
  const [showPassword, setShowPassword] = useState(false)
  const [strength, setStrength] = useState({ score: 0, text: '', color: '' })

  // Calculate password strength
  const calculateStrength = (password) => {
    if (!password) {
      setStrength({ score: 0, text: '', color: '' })
      return
    }

    let score = 0
    
    // Length check
    if (password.length >= 8) score++
    if (password.length >= 12) score++
    
    // Contains lowercase
    if (/[a-z]/.test(password)) score++
    
    // Contains uppercase
    if (/[A-Z]/.test(password)) score++
    
    // Contains numbers
    if (/[0-9]/.test(password)) score++
    
    // Contains special characters
    if (/[^a-zA-Z0-9]/.test(password)) score++
    
    // Determine strength text and color
    let text = ''
    let color = ''
    
    if (score <= 2) {
      text = 'Weak'
      color = 'bg-red-500'
    } else if (score <= 4) {
      text = 'Fair'
      color = 'bg-yellow-500'
    } else if (score <= 6) {
      text = 'Good'
      color = 'bg-blue-500'
    } else {
      text = 'Strong'
      color = 'bg-green-500'
    }
    
    setStrength({ score: Math.min(score, 8), text, color })
  }

  const handleChange = (e) => {
    onChange(e)
    if (showStrength) {
      calculateStrength(e.target.value)
    }
  }

  return (
    <div className="mb-4">
        <div className="relative">
            <input
                type={showPassword ? 'text' : 'password'}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                dark:bg-gray-700 dark:border-gray-600 dark:text-white pr-10"
                required
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
            {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
        </div>
      
      {/* Password length indicator */}
      {value && (
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Length: {value.length} characters
          {value.length < 6 && value.length > 0 && (
            <span className="text-red-500 ml-2">(Minimum 6 characters)</span>
          )}
        </div>
      )}
      
        {/* Password strength meter */}
        {showStrength && value && (
            <div className="mt-2">
                <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div 
                        className={`h-full ${strength.color} transition-all duration-300`}
                        style={{ width: `${(strength.score / 8) * 100}%` }}
                    />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {strength.text}
                    </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {strength.score <= 2 && "Add uppercase, numbers, or special characters for a stronger password"}
                    {strength.score >= 6 && "Great! Your password is strong"}
                </p>
            </div>
        )}
    </div>
  )
}

export default PasswordInput