import { useCallback, useEffect, useMemo, useState } from 'react'

const INTERESTS_KEY = 'campusgedara_interests'
const HISTORY_KEY = 'campusgedara_history'

const safeJsonParse = (value) => {
    try {
        return JSON.parse(value)
    } catch {
        return null
    }
}

const readInterests = () => {
    if (typeof window === 'undefined') return []
    const raw = window.localStorage.getItem(INTERESTS_KEY)
    if (!raw) return []
    const parsed = safeJsonParse(raw)
    return Array.isArray(parsed) ? parsed : []
}

const normalizeInterests = (interests) =>
    Array.isArray(interests) ? interests.filter(Boolean) : []

const readHistory = () => {
    if (typeof window === 'undefined') return []
    const raw = window.localStorage.getItem(HISTORY_KEY)
    if (!raw) return []
    const parsed = safeJsonParse(raw)
    return Array.isArray(parsed) ? parsed : []
}

const writeHistory = (historyArr) => {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(historyArr))
    window.dispatchEvent(new Event('campusgedara:historyUpdated'))
}

export const useRecommendations = () => {
    const [interests, setInterests] = useState(() => normalizeInterests(readInterests()))
    const [history, setHistory] = useState(() => readHistory())

    useEffect(() => {
        const handler = () => setInterests(normalizeInterests(readInterests()))
        const histHandler = () => setHistory(readHistory())
        
        window.addEventListener('campusgedara:interestsUpdated', handler)
        window.addEventListener('campusgedara:historyUpdated', histHandler)
        window.addEventListener('storage', handler)
        window.addEventListener('storage', histHandler)
        return () => {
            window.removeEventListener('campusgedara:interestsUpdated', handler)
            window.removeEventListener('campusgedara:historyUpdated', histHandler)
            window.removeEventListener('storage', handler)
            window.removeEventListener('storage', histHandler)
        }
    }, [])

    const trackInteraction = useCallback((item, type) => {
        if (!item || !type) return
        
        const currentHist = readHistory()
        const newHistItem = { type, itemId: item.name || item.id, timestamp: Date.now() }
        
        if (type === 'registered' || type === 'joined') {
            const alreadyExists = currentHist.some(h => h.itemId === newHistItem.itemId && h.type === type)
            if (!alreadyExists) {
                writeHistory([...currentHist, newHistItem])
            }
        }

        if (type !== 'joined' && type !== 'registered') return

        const nextInterest = item.category
        if (!nextInterest) return

        const currentInt = normalizeInterests(readInterests())
        const updated = currentInt.includes(nextInterest) ? currentInt : [...currentInt, nextInterest]
        window.localStorage.setItem(INTERESTS_KEY, JSON.stringify(updated))
        window.dispatchEvent(new Event('campusgedara:interestsUpdated'))
    }, [])

    const getRecommendations = useCallback(
        (items, count) => {
            const qInterests = normalizeInterests(interests)
            const scored = (items || []).map((item) => {
                let score = 0

                if (qInterests.length > 0) {
                    if (qInterests.includes(item.category)) score += 12
                    if (Array.isArray(item.values)) {
                        const valuesLower = item.values.map((v) => String(v).toLowerCase())
                        const interestsLower = qInterests.map((i) => String(i).toLowerCase())
                        const overlap = interestsLower.some((i) => valuesLower.some((v) => v.includes(i)))
                        if (overlap) score += 4
                    }
                } else {
                    score += 3
                }

                // Generalized popularity score if present
                score += (typeof item.members === 'number' ? Math.min(200, item.members) / 30 : 0)
                score += typeof item.id === 'string' ? (item.id.charCodeAt(0) % 5) * 0.01 : 0

                return { item, score }
            })

            scored.sort((a, b) => b.score - a.score || (b.item.members || 0) - (a.item.members || 0))

            const safeCount = Math.max(0, Number(count) || 0)
            return scored.slice(0, safeCount).map((s) => s.item)
        },
        [interests]
    )

    // Convenient for InterestsModal to read current interests.
    const api = useMemo(() => ({ getRecommendations, trackInteraction, interests, setInterests, history }), [getRecommendations, trackInteraction, interests, history])

    return api
}

