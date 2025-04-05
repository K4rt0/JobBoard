export const formatSalary = (min: number, max: number) => {
    return `$${min.toLocaleString()} - $${min.toLocaleString()}`
}

export const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays}d ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
    return `${Math.floor(diffDays / 30)}m ago`
}

export const formatDeadline = (dateString: string | number) => {
    try {
        const date = new Date(dateString)
        const now = new Date()
        if (isNaN(date.getTime())) throw new Error('Invalid date')

        if (date < now) return 'Expired'

        const diffTime = Math.abs(date.getTime() - now.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays === 0) return 'Today'
        if (diffDays === 1) return 'Tomorrow'
        if (diffDays < 7) return `${diffDays}d left`
        if (diffDays < 30) return `${Math.floor(diffDays / 7)}w left`
        return date.toLocaleDateString()
    } catch (e) {
        return 'N/A'
    }
}

export const formatDateUS = (timestamp: number | null): string => {
    if (!timestamp) return 'N/A'
    return new Date(timestamp).toLocaleDateString('en-US')
}
