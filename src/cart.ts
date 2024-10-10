import { getProducts } from "./utils";

const products = await getProducts()!;

export function verifyExistisCart() {
  const cart = localStorage.getItem("UserCart");

  if (cart) {
    showProducts();
    updateCartQuantity();
  } else {
    localStorage.setItem("UserCart", JSON.stringify([]));
  }
}

export function addProduct(productId: string) {
  const cart = localStorage.getItem("UserCart")!;
  const ParsedCart = JSON.parse(cart);
  if (ParsedCart.length > 4) {
    showAlert("max");
  } else {
    ParsedCart.push(productId);
    localStorage.setItem("UserCart", JSON.stringify(ParsedCart));
  }

  showProducts();
}

function updateCartQuantity() {
  const cart = localStorage.getItem("UserCart")!;
  const addQtdProducts = document.querySelector("#qtdProducts")!;
  addQtdProducts.innerHTML = `${JSON.parse(cart).length}`;
}

export function showProducts() {
  const cart = localStorage.getItem("UserCart")!;
  const parsedCart = JSON.parse(cart);
  const resumeCart = document.querySelector("#cart-resume")!;
  const addProductHTML: HTMLElement = document.querySelector("#cart-products")!;
  const addTotal = document.querySelector("#total-value")!;

  if (parsedCart.length == 0) {
    resumeCart?.classList.add("d-none");
    addProductHTML.innerHTML = `
            <div class="col-lg-12">
        <div class="alert alert-info">Você ainda não tem itens no carrinho!</div>
    </div>`;
    updateCartQuantity();
    return;
  }

  resumeCart?.classList.remove("d-none");

  const productQuantities: { [key: string]: number } = {};

  parsedCart.forEach((item: string) => {
    if (productQuantities[item]) {
      productQuantities[item]++;
    } else {
      productQuantities[item] = 1;
    }
  });

  addProductHTML.innerHTML = "";

  let totalPrice = 0;

  Object.keys(productQuantities).forEach((itemId) => {
    const findedProduct = products?.find((product) => product.id == itemId);
    if (findedProduct) {
      totalPrice += findedProduct.price * productQuantities[itemId];
      addProductHTML.innerHTML += `
            <div class="d-flex justify-content-between align-items-center mb-2" idProduto='${
              findedProduct.id
            }'>
                <span>${findedProduct.name}</span>
                <div class="d-flex align-items-center">
                    <button class="btn btn-link" id='remove-button'>-</button>
                    <span>${
                      productQuantities[itemId]
                    }</span> <!-- Mostra a quantidade -->
                    <button class="btn btn-link" id='plus-one-button'>+</button>
                </div>
                <span>${findedProduct.price.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}</span>
                <button class="btn btn-danger" id='remove-all'>Remove</button>
            </div>
            `;
    }
  });

  addTotal.innerHTML = (totalPrice + 45).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  localStorage.setItem("totalCart", (totalPrice + 45).toString());

  addBtnFunctionality();
  updateCartQuantity();
}

function removeOneProduct(categorieId: string) {
  const cart = localStorage.getItem("UserCart")!;
  const parsedCart = JSON.parse(cart);

  const indexToExclude = parsedCart.indexOf(categorieId);

  parsedCart.splice(indexToExclude, 1);

  localStorage.setItem("UserCart", JSON.stringify(parsedCart));

  showProducts();
}

function removeAll(categorieId: string) {
  const cart = localStorage.getItem("UserCart")!;
  const parsedCart = JSON.parse(cart);

  const newCart = parsedCart.filter((item: string) => item !== categorieId);
  localStorage.setItem("UserCart", JSON.stringify(newCart));
  showProducts();
}

function showAlert(type: string) {
  const successAlert = document.querySelector("#success-alert")!;
  const errorAlert = document.querySelector("#error-alert")!;
  const maxAlert = document.querySelector("#max-alert")!;

  if (type == "success") {
    successAlert.classList.replace("d-none", "d-block");
    setTimeout(() => {
      successAlert.classList.replace("d-block", "d-none");
    }, 7000);
  }
  if (type == "error") {
    errorAlert.classList.replace("d-none", "d-block");
    setTimeout(() => {
      errorAlert.classList.replace("d-block", "d-none");
    }, 10000);
  }
  if (type == "max") {
    maxAlert.classList.replace("d-none", "d-block");
    setTimeout(() => {
      maxAlert.classList.replace("d-block", "d-none");
    }, 5000);
  }
}

function clearCart() {
  localStorage.setItem("UserCart", JSON.stringify([]));
  localStorage.setItem("totalCart", "");
  showProducts();
}

const btnClear = document.querySelector("#clear-cart")!;
btnClear.addEventListener("click", clearCart);

function addBtnFunctionality() {
  const removeBtns = document.querySelectorAll("#remove-button");
  removeBtns.forEach((btn) => {
    btn.addEventListener("click", (e: any) => {
      removeOneProduct(
        e.target.parentElement.parentElement.getAttribute("idProduto")
      );
    });
  });

  const plusOneBtn = document.querySelectorAll("#plus-one-button");
  plusOneBtn.forEach((btn) => {
    btn.addEventListener("click", (e: any) => {
      addProduct(
        e.target.parentElement.parentElement.getAttribute("idProduto")
      );
    });
  });

  const removeAllBtn = document.querySelectorAll("#remove-all");
  removeAllBtn.forEach((btn) => {
    btn.addEventListener("click", (e: any) => {
      removeAll(e.target.parentElement.getAttribute("idProduto"));
    });
  });
}

async function sentOrder() {
  const products = JSON.parse(localStorage.getItem("UserCart")!);
  const total_value = Number(localStorage.getItem("totalCart"));
  const userInformatios = JSON.parse(
    localStorage.getItem("sb-rowqaxeeqevtmaoxkqfv-auth-token")!
  );
  const user_id = userInformatios.user.id;
  const supabaseURL: string = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY;

  try {
    const res = await fetch(supabaseURL + "rest/v1/orders", {
      method: "POST",
      headers: {
        apiKey: supabaseKey,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        products,
        total_value,
        user_id,
      }),
    });

    if (!res.ok) {
      throw new Error(`Erro ao registrar pedido: ${res.status}`);
    }

    clearCart()
    showAlert("success");
  } catch (error) {
    console.error(error);
    showAlert("error");
  }
}

const btnSent = document.querySelector("#sent-order")!;

function showLoading() {
  btnSent.innerHTML = `
  <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
  <span role="status">Processando pedido...</span>
`;
  btnSent.setAttribute("disabled", "");
}

function endLoading() {
  btnSent.innerHTML = `Fechar pedido`;
  btnSent.removeAttribute("disabled");
}

btnSent.addEventListener("click", () => {
  showLoading();
  sentOrder()
  setTimeout(endLoading, 1000);
});
