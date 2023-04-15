//const name = prompt('Insira seu nome abaixo:')

axios.defaults.headers.common['Authorization'] = 'C4s3KVw3tBWq6LpVfr4sqg07'


setInterval(reload_messages, 3000)


function appear_participants() {
    const menu = document.querySelector('.menu_participants')
    menu.classList.toggle('appear')
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
                <div class="menssage">
                    <p class="time">${message_recived[i].time}</p>
                    <p class="name">${message_recived[i].from}</p>${message_recived[i].text}
                </div>
            </div>
            `


        } else if (message_recived[i].type == 'message') {
            //inserir a menssagem e quem mandou no HTML
            all_messages.innerHTML += `
            <div class="format_menssage">
                <div class="menssage">
                    <span class="time">${message_recived[i].time}</span>
                    <span class="name">${message_recived[i].from}</span>
                    <span class="para">para</span>
                    <span class="recipient name">${message_recived[i].to}:</span>
                    <p class="text_menssage">${message_recived[i].text}</p>
                </div>
            </div>
            `


        } else {
            //inserir a menssagem privada e quem mandou no HTML
            all_messages.innerHTML += `
            <div class="format_menssage reserve">
                <div class="menssage">
                    <p class="time">${message_recived[i].time}</p>
                    <p class="name">${message_recived[i].from}</p>
                    <p class="para">reservadamente para</p>
                    <p class="recipient name">${message_recived[i].to}:</p>
                    <p class="text_menssage">${message_recived[i].text} </p> 
                </div>
            </div>
            `

        }
    }
    
    console.log(message_recived)
}

function reload_messages() {
    const promise_load_messages = axios.get('https://mock-api.driven.com.br/api/vm/uol/messages')
    promise_load_messages.then(load_messages)
    
}

