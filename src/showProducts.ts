import { getCategories } from "./getCategorie.ts";
import { Product } from "./model/products.ts";
const categories = await getCategories();

function showButtons(isManager: boolean) {
  if(isManager) {
    return `
    <button class="btn btn-primary btn-edit-product" data-bs-toggle="modal" data-bs-target="#exampleModal">Edit</button>
    <button class="btn btn-danger">Remove</button>
    `
  };

  return '<button class="btn btn-primary">Add</button>';
}

export function showProducts(products: Product[], elemento: HTMLElement, isManager: boolean = false) {
  elemento.innerHTML = ''
  products.forEach((product) => {
    elemento.innerHTML += `
            <div class="col-lg-3">
                <div class="card">
                    <img src="${findImgByCategory(product.category_id)}" class="card-img-top" alt="...">
                    <div id="${product.id}" id-category="${product.category_id}" class="card-body">
                      <h5 class="card-title">${product.name}</h5>
                      <p class="card-text">${product.resume}</p>
                      <div class="d-flex align-items-center" style="gap: 20px;">
                        ${showButtons(isManager)}
                        <span>${product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                      </div>
                     
                    </div>
                  </div>
            </div>
            `;
  });
}

function findImgByCategory(id: string) {
    const findCategory = categories?.find(categorie => categorie.id == id )
    return findCategory?.url
}
