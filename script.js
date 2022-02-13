storage = '' /* inicializando a variável usada para armazenar dados em localstorage */

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
        response.json() /* transforma a resposta em json */
            .then((data) => {
                console.log(data)
                if (data.authenticated === true) {
                    document.querySelector('.loginError').classList.remove('visible')

                    // Criar objeto para ser armazenado no localstorage:
                    let storageObj = {
                        accessToken: data.accessToken,
                        gtin: ''
                    }
                    localStorage.setItem(storage, JSON.stringify(storageObj));

                    // Ler item:
                    /* let myItem = JSON.parse(localStorage.getItem(storage)).accessToken;
                    console.log(myItem) */


                    /* localStorage.setItem(storage.gtin, '0') */
                    /* localStorage.setItem(storage.expirationToken, Date(`${data.expiration}`)) */

                    window.location.replace("./products.html") /* vai para a página de produtos */
                } else {
                    errorLogin()
                }
            })
    }).catch(() => {
        errorLogin()
    })
}

/* Função chamada quando o login dá errado */
const errorLogin = () => {
    document.querySelector('.loginError').classList.add('visible'); /* Adiciona a mensagem de erro de login a classe visible que, por CSS, o deixará visível */
}

/* Função chamada quando a página de produtos é carregada */
const onLoadProducts = () => {
    loadTable()
}

/* Função onClick do botão cadastrar */
const addProduct = () => {
    // Criar objeto para ser armazenado no localstorage:
    let storageObj = {
        accessToken: JSON.parse(localStorage.getItem(storage)).accessToken,
        gtin: ''
    }
    localStorage.setItem(storage, JSON.stringify(storageObj))
    window.location.replace("./productEdit.html") /* vai para a tela de edição de produtos */
}

/* Função que carrega a tabela de produtos */
const loadTable = () => {
    tbody = document.querySelector('tbody')

    tbody.innerHTML = '' /* limpa a tabela */

    /* Requisição na API pegando todos os produtos */
    fetch('https://johann.reader.homologacao.inovamobil.com.br/api/produtos', {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem(storage)).accessToken}`
        }
    }).then((response) => {
        response.json()
            .then((data) => {

                /* forEach para percorrer todos os produtos recebidos na requisição */
                data.forEach(product => {
                    let tr = document.createElement('tr')
                    let gtin
                    for (let i in product) {
                        let td = document.createElement('td')
                        if (i === 'base64') {  /* verifica se está no campo de imagem */
                            td.innerHTML = `<img class=tableImage src=${product[i]}></img>` /* cria uma tag image com a base64 da consulta como src */
                        } else {
                            if (i === 'codigoBarras') { /* verifica se está no campo de código de barras */
                                gtin = product[i] /* salva o código de barras em uma variável */
                            }
                            td.innerHTML = product[i]
                        }
                        tr.appendChild(td) /* adiciona o campo na linha */
                    }
                    let td = document.createElement('td')
                    td.innerHTML = actionButtons(gtin) /* chama a função que cria os botões de ação com o código de barras do produto atual como parâmetro */
                    tr.appendChild(td) /* adiciona o campo na linha */
                    tbody.appendChild(tr) /* adiciona a linha no corpo da tabela */
                });
            })
    })
}

/* Função que cria os botões de ação da tabela */
const actionButtons = (gtin) => {
    return (
        `<button class="actionButton" title="Visualizar" onclick="viewProduct(${gtin})"> 
            <i class="fa fa-eye"></i>
        </button>
        <button class="actionButton" title="Editar" onclick="editProduct(${gtin})">
            <i class="fa fa-pencil"></i>
        </button>
        <button class="actionButton" title="Deletar" onclick="deleteProduct(${gtin})">
            <i class="fa fa-trash"></i>
        </button>`
    )
}

/* onClick do botão visualizar produto - código de barras passado como parâmetro */
const viewProduct = (gtin) => {
    // Criar objeto para ser armazenado no localstorage:
    let storageObj = {
        accessToken: JSON.parse(localStorage.getItem(storage)).accessToken,
        gtin: gtin
    }

    localStorage.setItem(storage, JSON.stringify(storageObj)); /* Altera o localStorage */

    window.location.replace("./productView.html") /* vai para a página de visualização de produtos */
}

/* onClick do botão editar produto - código de barras passado como parâmetro */
const editProduct = (gtin) => {
    // Criar objeto para ser armazenado no localstorage:
    let storageObj = {
        accessToken: JSON.parse(localStorage.getItem(storage)).accessToken,
        gtin: gtin
    }

    localStorage.setItem(storage, JSON.stringify(storageObj)); /* Altera o localStorage */

    window.location.replace("./productEdit.html") /* vai para a tela de edição de produtos */
}

/* onClick do botão deletar produto - código de barras passado como parâmetro */
const deleteProduct = async (gtin) => {
    /* Requisição na API pegando todos os produtos */
    await fetch(`https://johann.reader.homologacao.inovamobil.com.br/api/produtos/${gtin}`, {
        method: 'DELETE',
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem(storage)).accessToken}`
        }
    }).then((response) => {

    }).catch(() => {
        alert('Falha ao excluir!')
    })

    loadTable()
}

/* Função do onClick do botão sair */
const leave = () => {
    localStorage.clear()

    window.location.replace("./login.html")
}

const onLoadEdit = () => {
    let gtin = JSON.parse(localStorage.getItem(storage)).gtin

    if (gtin) {
        document.getElementById('editTitle').innerHTML = 'Editar Produto' /* Altera o título */
        document.getElementById('gtinEdit').disabled = true /* Desabilita o campo de código de barras */

        /* Requisição na API */
        fetch(`https://johann.reader.homologacao.inovamobil.com.br/api/produtos/${gtin}`, {
            method: 'GET',
            headers: {
                'accept': '',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem(storage)).accessToken}`
            }
        }).then((response) => {
            response.json()
                .then((data) => {
                    document.getElementById('gtinEdit').value = data.codigoBarras
                    document.getElementById('nameEdit').value = data.nome
                    document.getElementById('priceEdit').value = data.preco
                    document.getElementById('imgEdit').src = data.base64
                })
        })
    } else {
        document.getElementById('editTitle').innerHTML = 'Novo Produto' /* Altera o título */
        document.getElementById('gtinEdit').disabled = false /* Habilita o campo de código de barras */
    }
}

/* Função do onClick do botão salvar */
const saveProduct = () => {
    let gtin = JSON.parse(localStorage.getItem(storage)).gtin /* Pega o código de barras do produto a ser editado */

    /* Verifica se tem um código de barras salvo na memória - se tem faz edição, se não faz inclusão */
    if (gtin) {
        let file = document.getElementById('imageInput').files[0]; /* Pega a imagem do input */

        /* Converter a imagem para base64 */
        getBase64(file).then(
            (file64) => { /* promisse retorna a imagem em base 64 */
                /* Criando o body da requisição */
                let body = `{"codigoBarras": "${document.getElementById('gtinEdit').value}", "nome": "${document.getElementById('nameEdit').value}", "preco": ${document.getElementById('priceEdit').value}, "base64": "${file64}"}`

                /* Requisição na API */
                fetch('https://johann.reader.homologacao.inovamobil.com.br/api/produtos/', {
                    method: 'PUT',
                    headers: {
                        'accept': 'application/json',
                        'Content-Type': 'application/json-patch+json',
                        'Authorization': `Bearer ${JSON.parse(localStorage.getItem(storage)).accessToken}`
                    },
                    body: body
                }).then((response) => {
                    if (response.status = 200) {
                        response.json()
                            .then((data) => {
                                if (data.sucesso) {
                                    alert('deu certo')
                                    /* window.location.replace("./products.html") */ /* vai para a página de produtos */
                                } else {
                                    alert(`Erro ao salvar! ${data.inconsistencias[0]}`)
                                }
                            })
                    } else {
                        alert('Erro ao salvar!')
                    }
                }).catch(() => {
                    alert('Erro ao salvar!')
                })
            }
        )
    } else {
        let file = document.getElementById('imageInput').files[0] /* Pega a imagem do input */

        /* Converter a imagem para base64 */
        getBase64(file).then(
            (file64) => { /* promisse retorna a imagem em base 64 */
                /* Criando o body da requisição */
                let body = `{"codigoBarras": "${document.getElementById('gtinEdit').value}", "nome": "${document.getElementById('nameEdit').value}", "preco": ${document.getElementById('priceEdit').value}, "base64": "${file64}"}`
        
                /* Requisição POST na API para cadastrar novo produto*/
                fetch(`https://johann.reader.homologacao.inovamobil.com.br/api/produtos/`, {
                    method: 'POST',
                    headers: {
                        'accept': 'application/json',
                        'Content-Type': 'application/json-patch+json',
                        'Authorization': `Bearer ${JSON.parse(localStorage.getItem(storage)).accessToken}`
                    },
                    body: body
                }).then((response) => {
                    if (response.status = 200) {
                        response.json()
                            .then((data) => {
                                if (data.sucesso) {
                                    window.location.replace("./products.html") /* vai para a página de produtos */
                                } else {
                                    alert(`Erro ao salvar! ${data.inconsistencias[0]}`)
                                }
                            })
                    } else {
                        alert('Erro ao salvar!')
                    }
                }).catch(() => {
                    alert('Erro ao salvar!')
                })
            }
        )
    }
}

/* Função que converte a imagem em base 64 - RETORNA UMA PROMISSE */
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

/* Função onClick do botão cancelar */
const backProducts = () => {
    /* localStorage.setItem(storage.gtin, '') */ /* limpa o código de barras da memória */
    window.location.replace("./products.html") /* vai para a página de produtos */
}

const onLoadView = () => {
    let gtin = JSON.parse(localStorage.getItem(storage)).gtin

    /* Requisição na API para pegar o produto a ser visualizado*/
    fetch(`https://johann.reader.homologacao.inovamobil.com.br/api/produtos/${gtin}`, {
        method: 'GET',
        headers: {
            'accept': '*/*',
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem(storage)).accessToken}`
        }
    }).then((response) => {
        response.json()
            .then((data) => {
                document.getElementById('gtinView').innerHTML = data.codigoBarras
                document.getElementById('nameView').innerHTML = data.nome
                document.getElementById('priceView').innerHTML = data.preco
                document.getElementById('imgView').src = data.base64
            })
    })
}