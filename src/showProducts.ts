import { getCategories } from "./getCategorie.ts";
import { Product } from "./model/products.ts";
const categories = await getCategories();

export function showProducts(products: Product[], elemento: HTMLElement) {
  products.forEach((product) => {
    elemento.innerHTML += `
            <div class="col-lg-3">
                <div class="card">
                    <img src="${findImgByCategory(product.category_id)}" class="card-img-top" alt="...">
                    <div class="card-body">
                      <h5 class="card-title">${product.name}</h5>
                      <p class="card-text">${product.resume}</p>
                      <div class="d-flex align-items-center" style="gap: 20px;">
                        <button class="btn btn-primary">Add</button>
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
