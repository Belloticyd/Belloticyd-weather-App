

import { useState } from 'react'
import Login from './Login'
import Register from './Register'

function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true)

  if (!isOpen) return null

  return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="relative w-full max-w-md">
                <button
                onClick={onClose}
                className="absolute -top-10 right-0 text-white text-2xl hover:text-gray-300"
                >
                ✕
                </button>
                
                {isLogin ? (
                <Login onSwitchToRegister={() => setIsLogin(false)} />
                ) : (
                <Register onSwitchToLogin={() => setIsLogin(true)} />
                )}
            </div>
        </div>
    )
}

export default AuthModal