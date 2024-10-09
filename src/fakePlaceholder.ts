export function showPlaceholderLoading(elemento: HTMLElement) {
    elemento.innerHTML = '';
    for (let index = 0; index < 4; index++) {
        elemento.innerHTML += `
        <div class="col-lg-3">
            <div class="card" aria-hidden="true">
                <div class="placeholder-glow">
                    <img src="https://rowqaxeeqevtmaoxkqfv.supabase.co/storage/v1/object/public/categories/roupas-acessorios.webp" style="filter: contrast(0);" class="card-img-top placeholder" alt="...">
                </div>
                <div class="card-body">
                    <h5 class="card-title placeholder-glow">
                        <span class="placeholder col-6"></span>
                    </h5>
                    <p class="card-text placeholder-glow">
                        <span class="placeholder col-7"></span>
                        <span class="placeholder col-4"></span>
                        <span class="placeholder col-4"></span>
                        <span class="placeholder col-6"></span>
                        <span class="placeholder col-8"></span>
                    </p>
                    <div class="d-flex align-items-center" style="gap: 20px;">
                        <button class="btn btn-primary disabled placeholder text-primary">edit</button>
                        <button class="btn btn-danger disabled placeholder text-danger">remove</button>
                        <span class="placeholder col-2"></span>
                    </div>
                </div>
            </div>
        </div>
        `
    }
}