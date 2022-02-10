let acessToken = 'teste'
let expirationToken = 'teste2' 

/* Função do onClick do botão de login */
const login = (event) => {
    event.preventDefault()

    let login = document.querySelector('input[type="text"]');
    let password = document.querySelector('input[type="password"]');

    /* Requisição na API */
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
        sucessLogin(response);
    }).catch(() => {
        errorLogin();
    })
}

/* Função chamada quando o login é bem sucedido */
const sucessLogin = (response) => {
    document.querySelector('.loginError').classList.remove('visible');
    
    response.json()
    .then((data) => {
        acessToken = data.accessToken
        expirationToken = data.expiration
    })
    
    window.location.replace("./products.html")
}

/* Função chamada quando o login dá errado */
const errorLogin = () => {
    /* Adiciona a mensagem de erro de login a classe visible que, por CSS, o deixará visível */
    document.querySelector('.loginError').classList.add('visible');
}

/* Função chamada quando a página de produtos é carregada */
const onLoadProducts = () => {
    console.log(acessToken)
    console.log(expirationToken)
    loadTable()
}

/* Função que carrega a tabela de produtos */
const loadTable = () => {
    
}

/* Função do onClick do botão sair */
const leave = () => {
    acessToken = ''
    expirationToken = ''
    
    window.location.replace("./login.html")
}