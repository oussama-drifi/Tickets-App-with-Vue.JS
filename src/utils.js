export function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('us-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}