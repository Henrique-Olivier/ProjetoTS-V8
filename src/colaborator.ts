import { showPlaceholderLoading } from "./fakePlaceholder";
import { addProduct, verifyExistisCart } from "./cart";
import { productsFilter } from "./filter";
import { getCategories } from "./getCategorie";
import { getProducts } from "./getProducts";
import { showCategories } from "./showCategories";
import { showEmptyState } from "./showEmptyState";
import { showProducts } from "./showProducts";

const collablist: string[] = ['henrique.rosa@v8.tech'];
    
const localStorageItem = localStorage.getItem('sb-rowqaxeeqevtmaoxkqfv-auth-token');
if(localStorageItem == null) {
  window.location.href = './login.html';
}

const userInfo = JSON.parse(localStorageItem!);

const isCollab = collablist.find(collab => collab === userInfo.user.email);
if(isCollab == undefined) {
    window.location.href = './gestor.html';
}

const categories = await getCategories();
const selectCategories: HTMLElement = document.querySelector("#select-categories")!;
const insertProducts: HTMLElement = document.querySelector("#insert-products")!;
const searchInput: HTMLInputElement = document.querySelector("#input-search")!;
const btnCart: HTMLElement = document.querySelector("#cart-button")!;

showPlaceholderLoading(insertProducts);

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