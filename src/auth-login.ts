import { supabase } from "./supabase";

export function mainLogin() {
    type htmlElement = Element;
    type alertType = "alert-danger" | "alert-success";
    type htmlInput = HTMLInputElement;
    type page = "gestor.html" | "colaborador.html" | "denied.html";

    const inputEmail = document.querySelector("#input-email") as htmlInput;
    const inputPassword = document.querySelector("#input-password") as htmlInput;
    const btnLogin = document.querySelector("#btn-login") as Element;

    const adminlist: string[] = ['matheus.castro@v8.tech'];
    const collablist: string[] = ['henrique.rosa@v8.tech'];

    btnLogin.addEventListener("click", () => {
        const email = inputEmail.value.toLowerCase();
        const password = inputPassword.value.toLowerCase();

        showLoading()
        setTimeout(() => authLogin(email, password), 1000);
    })

    // mostra o alerta de sucesso ou erro
    function showAlert(alertType: alertType) {
        const alert = document.querySelector(`.${alertType}`) as htmlElement;
    
        alert.classList.toggle('d-none')

        // faz o alerta sumir
        setTimeout(() => alert.classList.toggle('d-none'), 1500)
    }

    //mostra o loading "entrando..."
    function showLoading(){
        const divLoadingIcon = btnLogin.firstElementChild as htmlElement;
        const p = btnLogin.lastElementChild as htmlElement;
        divLoadingIcon.classList.toggle('d-none');
        p.textContent = 'Entrando...';

        // faz o loading "parar"
        setTimeout(() => {
            divLoadingIcon.classList.toggle('d-none');
            p.textContent = 'Entrar'
        }, 1500)
    }

    function validateAdmin(emailLogin: string) {
        return adminlist.find(item => item === emailLogin)
    }

    function validateCollab(emailLogin: string) {
        return collablist.find(item => item === emailLogin)
    }

    function redirectPage(page: page){
        setTimeout(() => window.location.href = `./${page}`, 500)
    }

    async function authLogin(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
    
        if(error){
            return showAlert("alert-danger");
        }
    
        if(data) {

            const emailLogin = data.user.email as string
            const isAdmin = validateAdmin(emailLogin);
            const isCollab = validateCollab(emailLogin);

            if(isAdmin) {
                showAlert("alert-success");
                return redirectPage("gestor.html");
            }

            if(isCollab) {
                showAlert("alert-success");
                return redirectPage("colaborador.html")
            }
    
            return redirectPage("denied.html")
        }
    }
}