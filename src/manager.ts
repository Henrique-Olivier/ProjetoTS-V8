import { getCategories } from "./getCategorie";
import { getProducts } from "./getProducts";
import { showCategories } from "./showCategories";
import { showEmptyState } from "./showEmptyState";
import { showProducts } from "./showProducts";

const supabaseURL: string = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY;

type htmlInput = HTMLInputElement;
type htmlElement = HTMLElement;
type alertType = "alert-warning" | "alert-success";

const insertProducts: htmlElement = document.querySelector("#insert-products")!;
const btnNewProduct: htmlElement = document.querySelector("#btn-new-product")!;
const btnAddProduct: htmlElement = document.querySelector("#btn-add-product")!;
const inputProductName: htmlInput = document.querySelector("#input-name")!;
const textProductResume: htmlInput = document.querySelector("#text-resume")!;
const selectProductCategory: HTMLSelectElement = document.querySelector("#select-category")!;
const inputProductPrice: htmlInput = document.querySelector("#input-price")!;
const alertModal: htmlElement = document.querySelector("#alert-modal")!;
const modalHeader: htmlElement = document.querySelector(".modal-header")!;
const btnModalClose = modalHeader.lastElementChild as HTMLButtonElement;
const modalBody: htmlElement = document.querySelector(".modal-body")!;
const modalFooter: htmlElement = document.querySelector(".modal-footer")!;

btnNewProduct.addEventListener("click", addModal);

function clearModal() {
    alertModal.classList.add('d-none');
    inputProductName.value = '';
    textProductResume.value = '';
    selectProductCategory.value = '';
    inputProductPrice.value = '';
}

function addModal(){
    clearModal();
    modalHeader.firstElementChild!.textContent = 'Adicionar Produto';
    console.log(modalFooter)
    modalFooter.lastElementChild!.lastElementChild!.textContent = 'Salvar Produto'
    modalFooter.lastElementChild!.id = "btn-add-product";
}

btnAddProduct.addEventListener("click", validateProduct);

inputProductPrice.addEventListener("input", event => {
    const target = event.target as HTMLInputElement;

    let value = target.value.replace(/\D/g, '');

    value = (parseFloat(value) / 100).toFixed(2).replace('.', ',');
    value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

    target.value = 'R$ ' + value;
})

const categories = await getCategories();

if (categories !== null ) {
    showCategories(categories, selectProductCategory);
}

async function listProducts() {
    const produtos = await getProducts();

    if (produtos !== null ) {
        showProducts(produtos, insertProducts, true);
        getListBtnEdit();
        getListBtnRemove();
    } else {
        showEmptyState(insertProducts, "Nenhum produto encontrado para esse filtro.");
    }
}
listProducts()

function validateProduct() {
    const isNameValid = validateInputName(inputProductName.value);
    const isMinResumeValid = validateMinTextResume(textProductResume.value);
    const isMaxResumeValid = validateMaxTextResume(textProductResume.value);
    const isCategoryValid = validateSelectCategory(selectProductCategory.value);
    const categorySelectId = selectProductCategory.options[selectProductCategory.selectedIndex];
    const categorytId = categorySelectId.getAttribute("value")!;
    const [isPriceValid, price] = validateInputPrice(inputProductPrice.value);

    if(!isNameValid) {
        return showAlert(alertModal, "Digite um nome com mais de 3 caracteres", "alert-warning");
    }

    if(!isMinResumeValid) {
        return showAlert(alertModal, "O resume não deve ficar vazio", "alert-warning")
    }

    if(!isMaxResumeValid) {
        return showAlert(alertModal, "O resume não pode ter mais de 100 caracteres", "alert-warning")
    }

    if(!isCategoryValid) {
        return showAlert(alertModal, "Escolha uma categoria válida", "alert-warning")
    }

    if(!isPriceValid) {
        return showAlert(alertModal, "O preço deve ser maior que 1 real", "alert-warning")
    }

    if(modalFooter.lastElementChild!.id === "btn-add-product") {
        addNewProduct(inputProductName.value, textProductResume.value, categorytId, price);
    } else {
        editProduct(productIdInfo ,inputProductName.value, textProductResume.value, categorytId, price)
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

function validateInputPrice(inputPrice: string): [boolean, number] {
    const price = convertStringPrice(inputPrice);
    return [price > 1, price];
}

function convertStringPrice(priceString: string) {
    const priceWithoutString = Number(priceString.replace(/\D/g, ''));
    const price = (priceWithoutString / 100).toFixed(2);
    return Number(price);
}

function showAlert(element: HTMLElement, message: string, alertType: alertType) {
    element.classList.remove("d-none");
    element.textContent = message;
    if(alertType === "alert-success") {
        element.classList.replace("alert-warning", alertType);
    } else {
        element.classList.replace("alert-success", alertType);
    }
}

type btnType = "btn-add-product" | "btn-edit-product";
function showLoading(disabled: boolean, btnType: btnType){
    const btnModal = document.querySelector(`#${btnType}`)!;
    btnModal.firstElementChild!.classList.toggle("d-none");

    if(btnType === "btn-add-product") {
        btnModal.lastElementChild!.textContent = "Adicionando..."
    } else {
        btnModal.lastElementChild!.textContent = "Editando..."
    }

    if(disabled) {
        btnModal.setAttribute("disabled", "true")
    } else if(btnType === "btn-add-product") {
        btnModal.lastElementChild!.textContent = "Adicionar";
        btnModal.removeAttribute("disabled");
    } else {
        btnModal.lastElementChild!.textContent = "Editar";
        btnModal.removeAttribute("disabled");
    }

}

function addNewProduct(name: string, resume: string, category_id: string, price: number) {
    try {
        showLoading(true, "btn-add-product");
        setTimeout(async () => {
            const res = await fetch(`${supabaseURL}/rest/v1/products`, {
                method: "POST",
                headers: {
                  apikey: supabaseKey,
                  Authorization: `Bearer ${supabaseKey}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    resume,
                    category_id,
                    price
                })
            });
    
            if(res.ok) {
                showLoading(false, "btn-add-product");
                showAlert(alertModal, "Novo Produto Adicionado!", "alert-success");
                listProducts();
                setTimeout(() => btnModalClose.click(), 1000);
            }
        }, 1000)

    } catch (error) {
        showAlert(alertModal, "Erro ao adicionar o produto, tenta novamente mais tarde", "alert-warning")
    }
}

function getListBtnEdit(){
    const listBtnEdit = document.querySelectorAll(".btn-edit-product");
    listBtnEdit.forEach(btnEdit => {
        btnEdit.addEventListener("click", () => {
            editModal(btnEdit);
        })
    });
}

let productIdInfo: string;
function editModal(btnElement: Element){
    clearModal();
    const productInfo = btnElement.parentElement!.parentElement!.children!;
    const productCategoryId = btnElement.parentElement!.parentElement!.getAttribute("id-category")!;

    productIdInfo = btnElement.parentElement!.parentElement!.id;

    modalHeader.firstElementChild!.textContent = 'Editar Produto';

    inputProductName.value = productInfo[0].textContent!;
    textProductResume.value = productInfo[1].textContent!;
    selectProductCategory.value = productCategoryId;
    inputProductPrice.value = productInfo[2].lastElementChild?.textContent!;

    modalFooter.lastElementChild!.lastElementChild!.textContent = 'Editar Produto'
    modalFooter.lastElementChild!.id = "btn-edit-product";
}

function editProduct(idProduct: string, name: string, resume: string, category_id: string, price: number) {
    try {
        showLoading(true, "btn-edit-product");
        setTimeout(async () => {
            const res = await fetch(`${supabaseURL}/rest/v1/products?id=eq.${idProduct}`, {
                method: "PATCH",
                headers: {
                  apikey: supabaseKey,
                  Authorization: `Bearer ${supabaseKey}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    resume,
                    category_id,
                    price
                })
            });

            if(res.ok) {
                showLoading(false, "btn-edit-product");
                showAlert(alertModal, "Produto Editado com sucesso!", "alert-success");
                listProducts();
                setTimeout(() => btnModalClose.click(), 1000);
            }
        }, 1000)

    } catch (error) {
        showAlert(alertModal, "Erro ao editar o produto, tenta novamente mais tarde", "alert-warning")
    }
}

function getListBtnRemove() {
    const listBtnRemove = document.querySelectorAll(".btn-remove-product");
    listBtnRemove.forEach(btnRemove => {
        btnRemove.addEventListener("click", () => {
            editRemoveModal(btnRemove);
        })
    });
}

function editRemoveModal(btnRemove: Element) {
    const productInfo = btnRemove.parentElement!.parentElement!.children!;
    const productId = btnRemove.parentElement!.parentElement!.id;
    modalBody.children[0].classList.toggle("d-none");
    //removeProduct(productId)
}

function removeProduct(productId: string) {
    try {
        showLoading(true, "btn-edit-product");
        setTimeout(async () => {
            const res = await fetch(`${supabaseURL}/rest/v1/products?id=eq.${productId}`, {
                method: "DELETE",
                headers: {
                  apikey: supabaseKey,
                  "Content-Type": "application/json",
                }
            });

            if(res.ok) {
                showLoading(false, "btn-edit-product");
                showAlert(alertModal, "Produto excluído com sucesso!", "alert-success");
                listProducts();
                setTimeout(() => btnModalClose.click(), 1000);
            }
        }, 1000)

    } catch (error) {
        showAlert(alertModal, "Erro ao excluir o produto, tenta novamente mais tarde", "alert-warning")
    }
}