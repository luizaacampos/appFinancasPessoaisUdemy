class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano,
        this.mes = mes,
        this.dia = dia,
        this.tipo = tipo,
        this.descricao = descricao,
        this.valor = valor
    }

    validarDados() {
        for (let i in this) {
            if (this[i] == undefined || this[i] == '' || this[i] == null) {
                return false
            } 
        }
        return true
    }
}

class Bd {

    constructor() {
        let id = localStorage.getItem('id')

        if (id === null) {
            localStorage.setItem('id', 0)
        } 
    }

    getNextId() {
        let nextId = localStorage.getItem('id') 
        return parseInt(nextId) + 1
    }

    gravar(d) {
        let id = this.getNextId()

        localStorage.setItem(id, JSON.stringify(d))
        localStorage.setItem('id', id)
    }

    recuperarTodosRegistros() {
        let despesas = Array()
        let id = localStorage.getItem('id')

        //recuperar todas as despesas cadastradas
        for(let i = 1; i <= id; i++) {

            //recuperar a despesa
            let despesa = JSON.parse(localStorage.getItem(i))

            //existe a possibilidade de haver indicesremovidos
            //aí pulamos o indice
            if(despesa === null) {
                continue
            }

            despesa.id = i
            despesas.push(despesa)
        }

        return despesas
    }

    pesquisar(despesa) {
        
        let despesasFiltradas = []

        despesasFiltradas = this.recuperarTodosRegistros()

        //console.log(despesa)

        //console.log(despesasFiltradas)

        //ano
        if (despesa.ano != '') {
            //console.log('Filtro de ano')
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }

        //mes
        if (despesa.mes != '') {
            //console.log('Filtro de mes')
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }

        //dia
        if (despesa.dia != '') {
            //console.log('Filtro de dia')
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }

        //tipo
        if (despesa.tipo != '') {
            //console.log('Filtro de tipo')
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }

        //descricao
        if (despesa.descricao != '') {
            //console.log('Filtro de descricao')
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }

        //valor
        if (despesa.valor!= '') {
            //console.log('Filtro de valor')
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }

        return despesasFiltradas
    }

    remover(id) {

        document.getElementById('modal_titulo2').innerHTML = 'Registro excluído!'
        document.getElementById('modal_titulo_div2').className = 'modal-header text-success'
        document.getElementById('modal_conteudo2').innerHTML = 'Registro Excluído com sucesso'
        let btn = document.getElementById('modal_btn2')
        btn.className = 'btn btn-success'
        btn.innerHTML = 'Ok'
        btn.onclick = function() {
            window.location.reload()
        }

        
         $('#modalApagaDespesa').modal('show')

         localStorage.removeItem(id)
    }
}

let bd = new Bd()

function cadastrarDespesa() {

    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(
        ano.value, 
        mes.value, 
        dia.value, 
        tipo.value, 
        descricao.value, 
        valor.value
        )

        if(despesa.validarDados()) {
            bd.gravar(despesa)

            document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso!'
            document.getElementById('modal_titulo_div').className = 'modal-header text-success'
            document.getElementById('modal_conteudo').innerHTML = 'Despesa cadastrada com sucesso'
            document.getElementById('modal_btn').className = 'btn btn-success'
            document.getElementById('modal_btn').innerHTML = 'Voltar'

            //sucesso
            $('#modalRegistraDespesa').modal('show')
            ano.value = ''
            mes.value = ''
            dia.value = ''
            tipo.value = ''
            descricao.value = ''
            valor.value = ''

        } else {

            document.getElementById('modal_titulo').innerHTML = 'Erro na inclusão do registro!'
            document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
            document.getElementById('modal_conteudo').innerHTML = 'Verifique se todos os campos foram inseridos corretamente'
            document.getElementById('modal_btn').className = 'btn btn-danger'
            document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir'
            //erro
            $('#modalRegistraDespesa').modal('show')

        }
}

function carregaListaDespesas(despesas = Array(), filtro = false) {

    if (despesas.length == 0 && filtro == false) {
        despesas = bd.recuperarTodosRegistros()
    }

    //selecionando elemento tbody da tabela
    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''

    //percorrer array despesas listando de forma dinamica
    despesas.forEach(function(d) {
        
        //criando tr
        let linha = listaDespesas.insertRow()

        //criando td
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
        //ajustar tipo
        switch(d.tipo) {
            case '1': d.tipo = 'Alimentação'
                break
            case '2': d.tipo = 'Educação'
                break
            case '3': d.tipo = 'Lazer'
                break
            case '4': d.tipo = 'Saúde'
                break
            case '5': d.tipo = 'Transporte'
                break
        }
        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor

        //criar botão de excluir
        let btn = document.createElement('button')
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `id_despesa_${d.id}`
        btn.onclick = function() {
            //remover a despesa
            let id = this.id.replace('id_despesa_', '')

            bd.remover(id)   
        }

        linha.insertCell(4).append(btn)

        //console.log(d)
    })
}

function pesquisarDespesa() {
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)
    
    let despesas = bd.pesquisar(despesa)

    carregaListaDespesas(despesas, true)
    }