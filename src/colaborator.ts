import { getCategories } from "./getCategorie";
import { getProducts } from "./getProducts";
import { showCategories } from "./showCategories";
import { showEmptyState } from "./showEmptyState";
import { showProducts } from "./showProducts";

const categories = await getCategories();
const selectCategories: HTMLElement  = document.querySelector("#select-categories")!;
const insertProducts: HTMLElement = document.querySelector("#insert-products")!;
 
if (categories !== null ) {
    showCategories(categories, selectCategories);
}

const produtos = await getProducts();

if (produtos !== null ) {
    showProducts(produtos, insertProducts)
} else {
    showEmptyState();
}

