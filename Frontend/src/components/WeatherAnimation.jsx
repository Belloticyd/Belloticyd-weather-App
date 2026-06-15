


import { motion } from 'framer-motion'

function WeatherAnimation({ condition }) {
    const animations = {
        Clear: {
            icon: '☀️',
            bg: 'from-yellow-400 to-orange-500',
            animation: {
                rotate: [0, 360],
                transition: { duration: 20, repeat: Infinity, ease: "linear" }
            }
        },
        Clouds: {
            icon: '☁️',
            bg: 'from-gray-400 to-gray-600',
            animation: {
                x: [-20, 20, -20],
                transition: { duration: 10, repeat: Infinity }
            }
        },
        Rain: {
            icon: '🌧️',
            bg: 'from-blue-400 to-gray-600',
            animation: {
                y: [0, 10, 0],
                transition: { duration: 1, repeat: Infinity }
            }
        },
        Snow: {
            icon: '❄️',
            bg: 'from-blue-200 to-blue-400',
            animation: {
                rotate: [0, 360],
                transition: { duration: 5, repeat: Infinity }
            }
        },
        Thunderstorm: {
            icon: '⛈️',
            bg: 'from-purple-600 to-gray-800',
            animation: {
                scale: [1, 1.2, 1],
                transition: { duration: 0.5, repeat: Infinity }
            }
        }
    }

    const weather = animations[condition] || animations.Clear

    return (
        <motion.div
            animate={weather.animation}
            className="text-8xl"
        >
            {weather.icon}
        </motion.div>
    )
}

export default WeatherAnimation