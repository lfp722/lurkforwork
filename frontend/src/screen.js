

export function removeLoginScreen() {
    const Loginform = document.getElementById("LoginForm");
    const RegisterForm = document.getElementById("RegisterForm");
    Loginform.style.display = "none"
    RegisterForm.style.display = "none"
}