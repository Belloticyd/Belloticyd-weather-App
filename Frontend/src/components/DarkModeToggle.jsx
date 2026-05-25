
// Below code is the react libraries to imported from react
import React from 'react'
import { useState, useEffect } from 'react'

const DarkModeToggle = () => {
    const[isDark, setIsDark] = useState(() => {

        // Below code is used to check localStorage or system preference
        const saved = localStorage.getItem("darkMode")

        // Below code is used to set the condition
        if (saved !== null) {
            return saved === "true"
        }

        // Otherwise, check system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches
    })

    // Below code is the use of useEffect to change from light mode to dark mode vis-via
    // Start of useEffect
    useEffect(() => {

        // Below code is used to check if it is dark or light
        if (isDark) {

            // Add 'dark' class to HTML element (enables Tailwind dark mode)
            document.documentElement.classList.add("dark")
            localStorage.setItem('darkMode', 'true')

        } else {

            // remove 'dark' class to HTML element (enables Tailwind dark mode)
            document.documentElement.classList.remove("dark")
            localStorage.setItem('darkMode', 'false')
        }

    }, [isDark])
    // End of useEffect

  return (
        <button
            onClick={() => setIsDark(!isDark)}
            className="fixed top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 
            hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-pointer"
            aria-label="Toggle dark mode"
        >
         {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
  )
}

export default DarkModeToggle
