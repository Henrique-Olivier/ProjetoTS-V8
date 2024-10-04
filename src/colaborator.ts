import { getCategories } from "./getCategorie";
import { showCategories } from "./showCategories";

const categories = await getCategories();
const selectCategories  = document.querySelector("#select-categories");

if (categories !== null && selectCategories !== null) {

    showCategories(categories, selectCategories);
}


