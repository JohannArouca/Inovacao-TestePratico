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
                if (data.authenticated === true) {
                    document.querySelector('.loginError').classList.remove('visible')

                    // Criar objeto para ser armazenado no localstorage:
                    let storageObj = {
                        accessToken: data.accessToken,
                        expirationToken: data.expiration,
                        gtin: ''
                    }
                    localStorage.setItem(storage, JSON.stringify(storageObj));

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
    if (new Date((JSON.parse(localStorage.getItem(storage)).expirationToken)) < (new Date())) { /* Verifica se o token está expirado */
        leave()
    } else { /* se o token não estiver expirado */
        loadTable()
    }
}

/* Função onClick do botão cadastrar */
const addProduct = () => {
    if (new Date((JSON.parse(localStorage.getItem(storage)).expirationToken)) < (new Date())) { /* Verifica se o token está expirado */
        leave()
    } else { /* se o token não estiver expirado */
        // Criar objeto para ser armazenado no localstorage:
        let storageObj = {
            accessToken: JSON.parse(localStorage.getItem(storage)).accessToken,
            expirationToken: JSON.parse(localStorage.getItem(storage)).expirationToken,
            gtin: ''
        }
        localStorage.setItem(storage, JSON.stringify(storageObj))
        window.location.replace("./productEdit.html") /* vai para a tela de edição de produtos */
    }

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
        if(response.status === 401) { /* Verifica se a resposta do servidor é 401 - Unauthorized */
            leave()
        } else {
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
                                td.innerHTML = product[i] /* adiciona o conteúdo no campo */
                            }
                            tr.appendChild(td) /* adiciona o campo na linha */
                        }
                        let td = document.createElement('td')
                        td.innerHTML = actionButtons(gtin) /* chama a função que cria os botões de ação com o código de barras do produto atual como parâmetro */
                        tr.appendChild(td) /* adiciona o campo na linha */
                        tbody.appendChild(tr) /* adiciona a linha no corpo da tabela */
                    });
                })
        }

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

/* Função que filtra a tabela quando um valor é digitado no input */
const filterProducts = () => {
    const columns = [
        { name: 'Código de barras', index: 0, isFilter: true },
        { name: 'Nome', index: 1, isFilter: true },
        { name: 'Preço', index: 2, isFilter: true },
        { name: 'Imagem', index: 3, isFilter: false },
        { name: 'Ações', index: 4, isFilter: false }
    ]
    const filterColumns = columns.filter(c => c.isFilter).map(c => c.index)
    const trs = document.querySelectorAll(`#tableProducts tr:not(#tableHeader)`)
    const filter = document.querySelector('#filterInput').value
    const regex = new RegExp(escape(filter), 'i')
    const isFoundInTds = td => regex.test(td.innerHTML)
    const isFound = childrenArr => childrenArr.some(isFoundInTds)
    const setTrStyleDisplay = ({ style, children }) => {
        style.display = isFound([
            ...filterColumns.map(c => children[c]) // <-- filter Columns
        ]) ? '' : 'none'
    }

    trs.forEach(setTrStyleDisplay)
}

/* onClick do botão visualizar produto - código de barras passado como parâmetro */
const viewProduct = (gtin) => {
    if (new Date((JSON.parse(localStorage.getItem(storage)).expirationToken)) < (new Date())) { /* Verifica se o token está expirado */
        leave()
    } else { /* se o token não estiver expirado */
        // Criar objeto para ser armazenado no localstorage:
        let storageObj = {
            accessToken: JSON.parse(localStorage.getItem(storage)).accessToken,
            expirationToken: JSON.parse(localStorage.getItem(storage)).expirationToken,
            gtin: gtin
        }

        localStorage.setItem(storage, JSON.stringify(storageObj)); /* Altera o localStorage */

        window.location.replace("./productView.html") /* vai para a página de visualização de produtos */
    }
}

/* onClick do botão editar produto - código de barras passado como parâmetro */
const editProduct = (gtin) => {
    if (new Date((JSON.parse(localStorage.getItem(storage)).expirationToken)) < (new Date())) { /* Verifica se o token está expirado */
        leave()
    } else { /* se o token não estiver expirado */
        // Criar objeto para ser armazenado no localstorage:
        let storageObj = {
            accessToken: JSON.parse(localStorage.getItem(storage)).accessToken,
            expirationToken: JSON.parse(localStorage.getItem(storage)).expirationToken,
            gtin: gtin
        }

        localStorage.setItem(storage, JSON.stringify(storageObj)); /* Altera o localStorage */

        window.location.replace("./productEdit.html") /* vai para a tela de edição de produtos */
    }
}

/* onClick do botão deletar produto - código de barras passado como parâmetro */
const deleteProduct = async (gtin) => {
    if (new Date((JSON.parse(localStorage.getItem(storage)).expirationToken)) < (new Date())) { /* Verifica se o token está expirado */
        leave()
    } else { /* se o token não estiver expirado */
        /* Requisição na API pegando todos os produtos */
        await fetch(`https://johann.reader.homologacao.inovamobil.com.br/api/produtos/${gtin}`, {
            method: 'DELETE',
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem(storage)).accessToken}`
            }
        }).then((response) => {
            if(response.status === 401) { /* Verifica se a resposta do servidor é 401 - Unauthorized */
                leave()
            } else {
                response.json()
                    .then((data) => {
                        if (data.sucesso) {
                            alert('Produto excluído!')
                        } else {
                            alert('Falha ao excluir!')
                        }
                    })
            }
        }).catch(() => {
            alert('Falha ao excluir!')
        })

        loadTable()
    }
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
            if(response.status === 401) { /* Verifica se a resposta do servidor é 401 - Unauthorized */
                leave()
            } else {
                response.json()
                    .then((data) => {
                        document.getElementById('gtinEdit').value = data.codigoBarras
                        document.getElementById('nameEdit').value = data.nome
                        document.getElementById('priceEdit').value = data.preco
                        document.getElementById('imgEdit').src = data.base64
                    })
            }
        })
    } else {
        document.getElementById('editTitle').innerHTML = 'Novo Produto' /* Altera o título */
        document.getElementById('gtinEdit').disabled = false /* Habilita o campo de código de barras */
    }
}

/* Função do onClick do botão salvar */
const saveProduct = () => {
    if (new Date((JSON.parse(localStorage.getItem(storage)).expirationToken)) < (new Date())) { /* Verifica se o token está expirado */
        leave()
    } else { /* se o token não estiver expirado */
        let gtin = JSON.parse(localStorage.getItem(storage)).gtin /* Pega o código de barras do produto a ser editado */

        /* Verifica se tem um código de barras salvo na memória - se tem faz edição, se não faz inclusão */
        if (gtin) {
            let file = document.getElementById('imageInput').files[0]; /* Pega a imagem do input */

            if (file) { /* Verifica se um arquivo foi carregado */
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
                            if (response.status === 200) {
                                response.json()
                                    .then((data) => {
                                        if (data.sucesso) {
                                            window.location.replace("./products.html") /* vai para a página de produtos */
                                        } else {
                                            alert(`Erro ao salvar! ${data.inconsistencias[0]}`)
                                        }
                                    })
                            } else {
                                if(response.status === 401) { /* Verifica se a resposta do servidor é 401 - Unauthorized */
                                    leave()
                                } else {
                                    alert('Erro ao salvar!')
                                }
                            }
                        }).catch(() => {
                            alert('Erro ao salvar!')
                        })
                    }
                )
            } else {
                /* Criando o body da requisição */
                let body = `{"codigoBarras": "${document.getElementById('gtinEdit').value}", "nome": "${document.getElementById('nameEdit').value}", "preco": ${document.getElementById('priceEdit').value}}`

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
                    if (response.status === 200) {
                        response.json()
                            .then((data) => {
                                if (data.sucesso) {
                                    window.location.replace("./products.html") /* vai para a página de produtos */
                                } else {
                                    alert(`Erro ao salvar! ${data.inconsistencias[0]}`)
                                }
                            })
                    } else {
                        if(response.status === 401) { /* Verifica se a resposta do servidor é 401 - Unauthorized */
                            leave()
                        } else {
                            alert('Erro ao salvar!')
                        }
                    }
                }).catch(() => {
                    alert('Erro ao salvar!')
                })
            }
        } else {
            let file = document.getElementById('imageInput').files[0] /* Pega a imagem do input */

            if (file) {
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
                            if (response.status === 200) {
                                response.json()
                                    .then((data) => {
                                        if (data.sucesso) {
                                            window.location.replace("./products.html") /* vai para a página de produtos */
                                        } else {
                                            alert(`Erro ao salvar! ${data.inconsistencias[0]}`)
                                        }
                                    })
                            } else {
                                if(response.status === 401) { /* Verifica se a resposta do servidor é 401 - Unauthorized */
                                    leave()
                                } else {
                                    alert('Erro ao salvar!')
                                }
                            }
                        }).catch(() => {
                            alert('Erro ao salvar!')
                        })
                    }
                )
            } else {
                /* Criando o body da requisição */
                let body = `{"codigoBarras": "${document.getElementById('gtinEdit').value}", "nome": "${document.getElementById('nameEdit').value}", "preco": ${document.getElementById('priceEdit').value}}`

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
                    if (response.status === 200) {
                        response.json()
                            .then((data) => {
                                if (data.sucesso) {
                                    window.location.replace("./products.html") /* vai para a página de produtos */
                                } else {
                                    alert(`Erro ao salvar! ${data.inconsistencias[0]}`)
                                }
                            })
                    } else {
                        if(response.status === 401) {
                            leave()
                        } else {
                            alert('Erro ao salvar!')
                        }
                    }
                }).catch(() => {
                    alert('Erro ao salvar!')
                })
            }
        }
    }
}

/* Função que converte a imagem em base 64 - RETORNA UMA PROMISSE */
function getBase64(file) {
    if (file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
}

/* Função onClick do botão cancelar */
const backProducts = () => {
    /* limpa o código de barras da memória */
    let storageObj = {
        accessToken: JSON.parse(localStorage.getItem(storage)).accessToken,
        expirationToken: JSON.parse(localStorage.getItem(storage)).expirationToken,
        gtin: ''
    }
    localStorage.setItem(storage, JSON.stringify(storageObj));

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
        if(response.status === 401) {
            leave()
        } else {
            response.json()
                .then((data) => {
                    document.getElementById('gtinView').innerHTML = data.codigoBarras
                    document.getElementById('nameView').innerHTML = data.nome
                    document.getElementById('priceView').innerHTML = data.preco
                    document.getElementById('imgView').src = data.base64
                })
        }
    })
}