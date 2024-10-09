import { CategorieType } from "./model/categories.ts";
import { ProductType } from "./model/products";

const supabaseURL: string = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY;

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

export async function getCategories(): Promise<CategorieType[] | null> {
  try {
    const res = await fetch(`${supabaseURL}/rest/v1/categories`, {
      method: "GET",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Erro na resposta da API: ${res.status}`);
    }

    const data: CategorieType[] = await res.json();
    return data;
  } catch (error) {
    console.error(`Falha ao buscar informações da tabela categories:` + error);
    return null;
  }
}



export async function getProducts(): Promise<ProductType[] | null> {
  try {
    const res = await fetch(`${supabaseURL}/rest/v1/products`, {
      method: "GET",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Erro na resposta da API: ${res.status}`);
    }

    const data: ProductType[] = await res.json();
    return data;
  } catch (error) {
    console.error(`Falha ao buscar informações da tabela categories:` + error);
    return null;
  }
}


export function showCategories (categories: CategorieType[], elemento: HTMLElement): void {

    const template = ` 
        <option value = ''>Todas</option>
        ${categories.map(categorie => {
            return `
            <option value = '${categorie.id}'>${categorie.name}</option>
            `
        })}
    ` 
    elemento.innerHTML = template;
}

export function showEmptyState(elemento: HTMLElement, message: string): void {
    elemento.innerHTML = `
    <div class="col-lg-12">
        <div class="alert alert-info">${message}</div>
    </div>
    `
} 



function showButtons(isManager: boolean) {
  if(isManager) {
    return `
    <button class="btn btn-primary btn-edit-product" data-bs-toggle="modal" data-bs-target="#exampleModal">Edit</button>
    <button class="btn btn-danger btn-remove-product" data-bs-toggle="modal" data-bs-target="#exampleModal">Remove</button>
    `
  };

  return '<button class="btn btn-primary" id="add-button" >Add</button>';
}

export function showProducts(products: ProductType[], elemento: HTMLElement, isManager: boolean = false) {
  elemento.innerHTML = ''
  products.forEach((product) => {
    elemento.innerHTML += `
            <div class="col-lg-3">
                <div class="card">
                    <img src="${findImgByCategory(product.category_id)}" class="card-img-top" alt="...">
                    <div id="${product.id}" id-category="${product.category_id}" class="card-body">
                      <h5 class="card-title">${product.name}</h5>
                      <p class="card-text">${product.resume}</p>
                      <div  productId='${product.id}' class="d-flex align-items-center" style="gap: 20px;">
                        ${showButtons(isManager)}
                        <span>${product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                      </div>
                     
                    </div>
                  </div>
            </div>
            `;
  });
}

const categories = await getCategories();

function findImgByCategory(id: string) {
    const findCategory = categories?.find(categorie => categorie.id == id )

    console.log(findCategory)
    return findCategory?.image_url
}

export function productsFilter(input: HTMLInputElement ,products: ProductType[], categorieId: HTMLSelectElement): ProductType[] {
    let filteredProducts: ProductType[] = products
    
    let toSearch =  removeAccents(input.value);
    console.log(toSearch)


    if(toSearch) {
        const normalizedSearch = removeAccents(toSearch.toLowerCase())

        filteredProducts = products.filter( product => {
            const normalizedProductName = removeAccents(product.name.toLowerCase())
            return normalizedProductName.includes(normalizedSearch)
        })
    }

    if(categorieId.value) {
        filteredProducts = filteredProducts.filter(product => {
            return product.category_id === categorieId.value
        }) 
    }
    
    return filteredProducts;
}

function removeAccents(string: String): string {
    return string.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}
