export function showEmptyState(elemento: HTMLElement, message: string): void {
    elemento.innerHTML = `
    <div class="col-lg-12">
        <div class="alert alert-info">${message}</div>
    </div>
    `
} 