axios.defaults.headers.common['Authorization'] = 'C4s3KVw3tBWq6LpVfr4sqg07'
let nome;
const phase = document.querySelector('.phase');

let to = "Todos"
let type = "message"

function send_name() {
    nome = {name: document.querySelector('.input').value}

    const promisse = axios.post('https://mock-api.driven.com.br/api/vm/uol/participants', nome)

    promisse.catch(tratar_erro)
    promisse.then(load_messages)

    document.querySelector('.input_name').style.display = 'none'
    document.querySelector('.load').style.display = 'flex'

    
}

function keep_conection() {
    const reconnect_promisse = axios.post('https://mock-api.driven.com.br/api/vm/uol/status', nome)
    reconnect_promisse.catch(tratar_erro)
}

function tratar_erro(erro){
    window.location.reload()
    alert('Algo deu errado! Favor inserir outro nome ou tente novamente mais tarde!')
}


function send_message() {
    let message = document.querySelector('.text_message').value


    const send_message_here = 
    {
        from: `${nome.name}`,
        to: `${to}`,
        text: `${message}`,
        type: `${type}`
    }


    document.querySelector('.text_message').value = ''
    
    const promisse = axios.post('https://mock-api.driven.com.br/api/vm/uol/messages', send_message_here)
    promisse.then(reload_messages)
    
}

function press_enter(camp) {
    var key = window.event.keyCode;
    if (key === 13) {
        if (camp == 'textarea') {
            send_message()
            document.querySelector('.text_message').value = ''
        } else if ( camp == 'input'){
            send_name()
        }
        
    } else {
        return
    }

}

function appear_participants() {
    const menu = document.querySelector('.menu_participants')
    const appear = document.querySelector('.appear_participants')

    if (document.querySelector('.appear')) {
        setTimeout(remove_appear, 450, menu)

    } else {

        menu.classList.add('appear')

    }

    appear.classList.toggle('slide-in-right')
    appear.classList.toggle('slide-out-right')
}

function remove_appear(menu){
    menu.classList.remove('appear')
}

function transition_remove_pageLogin() {
    document.querySelector('.page_login').classList.add('slide-out-top')
    document.querySelector('.all_menssages').lastElementChild.scrollIntoView()
    setTimeout(remove_pageLogin, 1000)
}

function remove_pageLogin() {
    document.querySelector('.page_login').style.display = 'none'
}

function load_messages(load_messages) {

    

    //armazenar as mensagens em um array
    const message_recived = load_messages.data


    //limpar as mensagens pra imprimir novamente
    const all_messages = document.querySelector('.all_menssages')
    all_messages.innerHTML = ''

    //percorrer esse array item por item
    for (let i = 0; i < message_recived.length; i++){

        //verificar o tipo da mensagem e inserir no HTML de acordo com o tipo de mensagem
        //filtrar por 'status', 'message', 'private_message'
        
        if (message_recived[i].type == 'status') {
            //inserir os dados se a pessoa entrou ou saiu no HTML
            all_messages.innerHTML +=`
            <div class="format_menssage somebody_enter">
                <div data-test="message" class="menssage">
                    <p class="time">(${message_recived[i].time})</p>
                    <p class="name">${message_recived[i].from}</p>
                    ${message_recived[i].text}
                </div>
            </div>
            `


        } else if (message_recived[i].type == 'message') {
            //inserir a menssagem e quem mandou no HTML
            all_messages.innerHTML += `
            <div class="format_menssage">
                <div data-test="message" class="menssage">
                    <span class="time">(${message_recived[i].time})</span>
                    <span class="name">${message_recived[i].from}</span>
                    <span class="para">para</span>
                    <span class="recipient name">${message_recived[i].to}:</span>
                    <p class="text_menssage">${message_recived[i].text}</p>
                </div>
            </div>
            `


        } else {
            //inserir a menssagem privada e quem mandou no HTML
            if (message_recived[i].to == nome.name || message_recived[i].from == nome.name) {
                all_messages.innerHTML += `
                <div class="format_menssage reserve">
                    <div data-test="message" class="menssage">
                        <p class="time">(${message_recived[i].time})</p>
                        <p class="name">${message_recived[i].from}</p>
                        <p class="para">reservadamente para</p>
                        <p class="recipient name">${message_recived[i].to}:</p>
                        <p class="text_menssage">${message_recived[i].text} </p> 
                    </div>
                </div>
                `
            }
            

        }
    }
    
    search_participants()
    setInterval(keep_conection, 5000);
    setInterval(search_participants, 10000)
    setInterval(reload_messages, 3000)
    setTimeout(transition_remove_pageLogin, 5000)
}

function reload_messages() {
    
    const promise_load_messages = axios.get('https://mock-api.driven.com.br/api/vm/uol/messages')
    promise_load_messages.then(load_messages)
    
}

function print_participants_on_screen(participants) {
    
    const online_participants = document.querySelector('.online_participants')
    const check = document.querySelector('.online_participants .appear_check')

    let user_quit;

    for (let i = 0; i < participants.data.length; i++) {
        if (to == participants.data[i].name){
            user_quit = false
            break
        } else {
            user_quit = true
        }
    }

    if (user_quit === true){
        to = "Todos"
        document.querySelector('.unlock .check').classList.add('appear_check')
        document.querySelector('.lock .check').classList.remove('appear_check')
        phase.innerText = ''
    }

    if (check && to != 'Todos') {
        online_participants.innerHTML = `
        <div class="select">
            <div data-test="all" onclick="set_to(this,'Todos')" class="participant_online">
                <div class="who">
                    <img src="./Assets/people.svg">
                    <p>Todos</p>
                </div>
                <div class="check">
                    <img data-test="check" src="./Assets/checkmark-outline.svg">
                </div>
            </div>
        </div>
        `
    } else {
        online_participants.innerHTML = `
        <div class="select">
            <div data-test="all" onclick="set_to(this,'Todos')" class="participant_online hover_sla">
                <div class="who">
                    <img src="./Assets/people.svg">
                    <p>Todos</p>
                </div>
                <div class="check appear_check">
                    <img data-test="check" src="./Assets/checkmark-outline.svg">
                </div>
            </div>
        </div>
        `
    }


    for (let i = 0; i < participants.data.length; i++) {
        if (participants.data[i].name == to) {
            online_participants.innerHTML += `
            <div class="select">
                <div data-test="participant" onclick="set_to(this, '${to}')" class="participant_online">
                    <div class="who">
                        <img src="./Assets/person-circle.svg">
                        <p>${to}</p>
                    </div>
                    <div class="check appear_check">
                        <img data-test="check" src="./Assets/checkmark-outline.svg">
                    </div>
                </div>
            </div>
            `
        } else {
            online_participants.innerHTML += `
            <div class="select">
                <div data-test="participant" onclick="set_to(this, '${participants.data[i].name}')" class="participant_online">
                    <div class="who">
                        <img src="./Assets/person-circle.svg">
                        <p>${participants.data[i].name}</p>
                    </div>
                    <div class="check">
                        <img data-test="check" src="./Assets/checkmark-outline.svg">
                    </div>
                </div>
            </div>
            `
        }
    }

}

function search_participants() {
    const participants = axios.get('https://mock-api.driven.com.br/api/vm/uol/participants')
    participants.then(print_participants_on_screen)
}


function set_to(buttom, who) {
    to = who
    //verificar onde está o 'check' marcado
    const check = document.querySelector('.online_participants .appear_check')
    const buttom_check = buttom.querySelector('.check')

    if (check) {
        //retirar da posiçao marcada
        check.classList.remove('appear_check')

        //colocar o 'check' no botao atual
        buttom_check.classList.add('appear_check')
    } else {
        buttom_check.classList.add('appear_check')
    }
    
    if (to == 'Todos') {
        type = 'message'

        document.querySelector('.unlock .check').classList.add('appear_check')
        document.querySelector('.lock .check').classList.remove('appear_check')

    }


    
    
    if(to == 'Todos'){
        phase.innerText = ''

    } else {

        if (type == 'private_message'){
            phase.innerText = `Enviando para ${to} (Reservadamente)`

        } else {
            phase.innerText = `Enviando para ${to} (Público)`

        }
        
    }
    
}

function set_visibility(buttom, visibility) {
    type = visibility

    if (to == 'Todos') {
        type = 'message'

        document.querySelector('.unlock .check').classList.add('appear_check')
        document.querySelector('.lock .check').classList.remove('appear_check')

    } else {
        //verificar onde está o 'check' marcado
        const check = document.querySelector('.choose_visibility .appear_check')
        const buttom_check = buttom.querySelector('.check')

        if (check) {
            //retirar da posiçao marcada
            check.classList.remove('appear_check')

            //colocar o 'check' no botao atual
            buttom_check.classList.add('appear_check')
        } else {
            buttom_check.classList.add('appear_check')
        }


        const phase = document.querySelector('.phase')
        
        if(to == 'Todos'){
            phase.innerText = ''
            
        } else {

            if (type == 'private_message'){
                phase.innerText = `Enviando para ${to} (Reservadamente)`

            } else {
                phase.innerText = `Enviando para ${to} (Público)`

            }
            
        }
    }

    
}

