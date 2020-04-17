$(document).ready(function () {
    console.log('main.js is working')
    console.log($)


    /***********/
    /* FUNCTION
    /***********/

    function send_Message(text, bot=false) {
        var mess = template_mes.clone()
        if (bot) {
            mess.addClass('bot')
        }
        else {
            mess.addClass('user')
        }

        mess.find('.mess-content').text(text)
        mess.find('.mess-time').text('prova')
        mess.appendTo(chat_history)
        chat_history.scrollTop(chat_history.height()) 
    }   


    function mess_by_bot() {
        var content = bot_messages[Math.random() * 3 | 0]
        bot_timerId = setTimeout(() => send_Message(content, true), 2000)
    }


    function mess_send_by_User() {
        var new_content = chat_input.val().trim()
        if (new_content) send_Message(new_content)
        chat_input.val('') 
        chat_input.blur()
        clearTimeout(bot_timerId)
        mess_by_bot()
    }





    function switch_chatBtn() {
        chat_btn.children('i').toggleClass('fa-microphone fa-paper-plane')
    }
    

    /***********/
    /* SCRIPT
    /***********/

    const bot_messages = ['Ehi!', 'Come va?', 'Andiamo a bere?', 'Come stai?']

    const michele_history = [
        ['Ciao, come stai?', false],
        ['Ciao, come stai?', true],
        ['Ciao, come stai?', false],
    ]

    const chat_btn = $('#chat-btn')
    const chat_history = $('#content-history')
    const chat_input = $('#chat-input')

    const template_mes = $('.template.message .mess-row')

    var bot_timerId


    for (item of michele_history) {
        send_Message(item[0], item[1])
    }

    chat_input.focus(switch_chatBtn)
    chat_input.focusout(switch_chatBtn)


    $(document).keyup((function (e) { 
        if (e.which == 13 || e.keyCode == 13) mess_send_by_User()
        }
    )) 
    
    chat_btn.click(() => {
        mess_send_by_User()
    })    
});