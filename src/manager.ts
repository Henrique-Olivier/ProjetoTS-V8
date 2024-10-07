import { getProducts } from "./getProducts";
import { showEmptyState } from "./showEmptyState";
import { showProducts } from "./showProducts";

const insertProducts: HTMLElement = document.querySelector("#insert-products")!;

const produtos = await getProducts();

if (produtos !== null ) {
    showProducts(produtos, insertProducts, true)
} else {
    showEmptyState();
}

