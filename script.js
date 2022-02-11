<<<<<<< HEAD
/* Objeto que controla o token e o expiration */
let token = {
    accessToken: '',
    expirationToken: new Date()
}
=======
let acessToken = 'teste'
let expirationToken = 'teste2' 
>>>>>>> dc9eb12950804870ecd555f9e5f2fe0d25537a55

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
            'Content-Type': 'application/json-patch+json'
        },
        body: JSON.stringify({
            iD: login.value, /* usuário */
            chaveAcesso: password.value, /* senha */
        })
    }).then((response) => {
        if (response.status !== 200) {
            return errorLogin();
        }
<<<<<<< HEAD
        response.json()
            .then((data) => {
                console.log(data)
                if (data.authenticated === true) {
                    document.querySelector('.loginError').classList.remove('visible')

                    localStorage.setItem(token.accessToken, `${data.accessToken}`)
                    /* localStorage.setItem(expirationToken, Date(`${data.expiration}`)) */

                    window.location.replace("./products.html")
                } else {
                    errorLogin()
                }
            })
=======
        sucessLogin(response);
>>>>>>> dc9eb12950804870ecd555f9e5f2fe0d25537a55
    }).catch(() => {
        errorLogin()
    })
}

<<<<<<< HEAD
=======
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

>>>>>>> dc9eb12950804870ecd555f9e5f2fe0d25537a55
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
<<<<<<< HEAD
    /* Requisição na API pegando todos os produtos */
    fetch('https://johann.reader.homologacao.inovamobil.com.br/api/produtos', {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem(token.accessToken)}`
        }
    }).then((response) => {
        response.json()
            .then((data) => {
                tbody = document.querySelector('tbody')

                /* forEach para percorrer todos os produtos recebidos na requisição */
                data.forEach(product => {
                    let tr = document.createElement('tr')
                    let gtin
                    for (let i in product) {
                        let td = document.createElement('td')
                        if (i === 'base64') {
                            td.innerHTML = ''
                        } else {
                            if (i === 'codigoBarras') {
                                gtin = product[i]
                            }
                            td.innerHTML = product[i]
                        }
                        tr.appendChild(td)
                    }
                    let td = document.createElement('td')
                    td.innerHTML = actionButtons(gtin)
                    tr.appendChild(td)
                    tbody.appendChild(tr)
                });
            })
    })
}

/* Função que cria os botões de ação da tabela */
const actionButtons = (gtin) => {
    return (
        `${gtin}`
    )
}

/* Função do onClick do botão sair */
const leave = () => {
    localStorage.setItem(token.accessToken, '')
    /* localStorage.setItem(expirationToken, new Date()) */

=======
    
}

/* Função do onClick do botão sair */
const leave = () => {
    acessToken = ''
    expirationToken = ''
    
>>>>>>> dc9eb12950804870ecd555f9e5f2fe0d25537a55
    window.location.replace("./login.html")
}