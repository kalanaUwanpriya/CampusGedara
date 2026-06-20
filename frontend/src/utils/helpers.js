// Utility helper functions

export const formatPrice = (price) => {
    return `Rs. ${new Intl.NumberFormat('en-LK').format(price)}`
}

export const formatDistance = (distance) => {
    if (distance === 'On Campus') return distance
    return distance
}

export const formatTime = (time) => {
    return time
}

export const getPriceSymbol = (priceLevel) => {
    const symbols = {
        'Rs.': 'Budget-friendly',
        'Rs.Rs.': 'Moderate',
        'Rs.Rs.Rs.': 'Premium',
    }
    return symbols[priceLevel] || priceLevel
}

export const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
}

export const getTimelinePosition = (time) => {
    // Convert time string like "00:15" to a percentage for timeline display
    const [hours, minutes] = time.split(':').map(Number)
    const totalMinutes = hours * 60 + minutes
    const maxMinutes = 120 // 2 hours for display
    return Math.min((totalMinutes / maxMinutes) * 100, 100)
}
