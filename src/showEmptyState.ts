export function showEmptyState(): void {
    const alert = document.querySelector('#alert-emptyState')
    alert?.classList.replace('d-none', 'd-block')
} 