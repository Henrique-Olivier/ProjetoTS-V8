import { productsFilter } from "./filter";
import { getCategories } from "./getCategorie";
import { getProducts } from "./getProducts";
import { showCategories } from "./showCategories";
import { showEmptyState } from "./showEmptyState";
import { showProducts } from "./showProducts";

const categories = await getCategories();
const selectCategories: HTMLElement = document.querySelector("#select-categories")!;
const insertProducts: HTMLElement = document.querySelector("#insert-products")!;
const searchInput: HTMLInputElement = document.querySelector("#input-search")!;

if (categories !== null) {
  showCategories(categories, selectCategories);
}


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


