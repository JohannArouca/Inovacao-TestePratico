const login = () => {
    
    let login = document.querySelector('input[type="text"]');
    let password = document.querySelector('input[type="password"]');

    console.log(login.value)
    console.log(password.value)

    fetch('https://johann.reader.homologacao.inovamobil.com.br/api/login', {
        method: 'POST',
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
    console.log('foi')
    window.location.replace("./products.html");
}

const errorLogin = () => {
    console.log('deu ruim')
}