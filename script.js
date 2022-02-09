const login = (event) => {
    event.preventDefault()

    /* errorLogin() */
    /* sucessLogin(); */

    let login = document.querySelector('input[type="text"]');
    let password = document.querySelector('input[type="password"]');

    console.log(login.value)
    console.log(password.value)

    fetch('https://johann.reader.homologacao.inovamobil.com.br/api/login', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'accept': '*/*',
            'Content-Type' : 'application/json-patch+json'
        },
        body: JSON.stringify({
            iD: login.value,
            chaveAcesso: password.value,
        })
    }).then((response) => {
        if (response.status !== 200) {
            return errorLogin();
        }
        sucessLogin();
    }).catch(() => {
        errorLogin();
    })
}

const sucessLogin = () => {
    document.querySelector('.loginError').classList.remove('visible');
    window.location.replace("./products.html");
}

const errorLogin = () => {
    document.querySelector('.loginError').classList.add('visible');
    botaoLogin.textContent = "Entrar";
}

const onLoadProducts = () => {
    loadTable()
}

const loadTable = () => {

}