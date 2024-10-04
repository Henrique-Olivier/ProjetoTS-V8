import { getCategories } from "./getCategorie";
import { showCategories } from "./showCategories";

const categories = await getCategories();
const selectCategories = document.querySelector("#select-categories");

showCategories(categories, selectCategories);
