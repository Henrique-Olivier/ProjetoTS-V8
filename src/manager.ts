import { getCategories } from "./getCategorie";
import { getProducts } from "./getProducts";
import { showCategories } from "./showCategories";
import { showEmptyState } from "./showEmptyState";
import { showProducts } from "./showProducts";

type htmlInput = HTMLInputElement;
type htmlElement = HTMLElement;

const insertProducts: htmlElement = document.querySelector("#insert-products")!;
const btnAddProduct: htmlElement = document.querySelector("#btn-add-product")!;
const inputProductName: htmlInput = document.querySelector("#input-name")!;
const textProductResume: htmlInput = document.querySelector("#text-resume")!;
const selectProductCategory: htmlInput = document.querySelector("#select-category")!;
const alertModal: htmlElement = document.querySelector("#alert-modal")!;

btnAddProduct.addEventListener("click", newProduct);

const categories = await getCategories();

if (categories !== null ) {
    showCategories(categories, selectProductCategory);
}

const produtos = await getProducts();

if (produtos !== null ) {
    showProducts(produtos, insertProducts, true)
} else {
    showEmptyState();
}

function newProduct() {
    const isNameValid = validateInputName(inputProductName.value);
    const isMinResumeValid = validateMinTextResume(textProductResume.value);
    const isMaxResumeValid = validateMinTextResume(textProductResume.value);
    const isCategoryValid = validateSelectCategory(selectProductCategory.value);

    if(!isNameValid) {
        return showAlert(alertModal, "Digite um nome com mais de 3 caracteres");
    }

    if(!isMinResumeValid) {
        return showAlert(alertModal, "O resume não deve ficar vazio")
    }

    if(!isMaxResumeValid) {
        return showAlert(alertModal, "O resume não pode ter mais de 100 caracteres")
    }

    if(!isCategoryValid) {
        return showAlert(alertModal, "Escolha uma categoria válida")
    }
}

function validateInputName(inputName: string) {
    return inputName.length > 3;
}

function validateMinTextResume(textResume: string) {
    return textResume.length > 0;
}

function validateMaxTextResume(textResume: string) {
    return textResume.length <= 100;
}

function validateSelectCategory(selectCategory: string) {
    return selectCategory !== "Todas"
}

function showAlert(element: HTMLElement, message: string) {
    element.classList.remove("d-none")
    element.textContent = message;
}