import { getCategories, getProducts, showCategories, showProducts, showEmptyState, showPlaceholderLoading, productsFilter, logout, verifyAccess } from "./utils";
import { addProduct, verifyExistisCart } from "./cart";

verifyAccess("collab");

const categories = await getCategories();
const selectCategories: HTMLElement = document.querySelector("#select-categories")!;
const insertProducts: HTMLElement = document.querySelector("#insert-products")!;
const searchInput: HTMLInputElement = document.querySelector("#input-search")!;
const btnCart: HTMLElement = document.querySelector("#cart-button")!;
const btnLogout = document.querySelector(".btn-link")!;

btnLogout.addEventListener("click", logout);

showPlaceholderLoading(insertProducts, 'colaborator');

verifyExistisCart()

if (categories !== null) {
  showCategories(categories, selectCategories);
}

setTimeout(async () => {

  const products = await getProducts();
  if (products !== null) {
    showProducts(products, insertProducts);
  
    searchInput.addEventListener("keyup", () => {
      const filteredProducts = productsFilter(
        searchInput,
        products,
        selectCategories as HTMLSelectElement
      );
  
      if (filteredProducts.length == 0) {
        showEmptyState(
          insertProducts,
          "Nenhum produto encontrado para esse filtro."
        );
      } else {
        showProducts(filteredProducts, insertProducts);
      }
    });
  
    selectCategories.addEventListener("change", () => {
      const filteredProducts = productsFilter(
        searchInput,
        products,
        selectCategories as HTMLSelectElement
      );
  
      if (filteredProducts.length == 0) {
        showEmptyState(
          insertProducts,
          "Nenhum produto encontrado para esse filtro."
        );
      } else {
        showProducts(filteredProducts, insertProducts);
      }
    });
  
  } else {
    showEmptyState(insertProducts, "Nenhum produto encontrado na base de dados");
  }
  const btnAdd = document.querySelectorAll("#add-button") 
  
  btnAdd.forEach(btn => {
    btn.addEventListener('click' ,(e:any) => {
      addProduct(e.target.parentElement.getAttribute('productId'))
      btnCart.click()
      
    })
  })

}, 1500)