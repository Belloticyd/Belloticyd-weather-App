

// Google Analytics
export const initGA = () => {
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=G-YOUR_GA_ID`
    document.head.appendChild(script)

    window.dataLayer = window.dataLayer || []
    function gtag() { window.dataLayer.push(arguments) }
    gtag('js', new Date())
    gtag('config', 'G-YOUR_GA_ID')
}

export const trackEvent = (action, category, label) => {
    if (window.gtag) {
        window.gtag('event', action, {
            event_category: category,
            event_label: label
        })
    }
}

