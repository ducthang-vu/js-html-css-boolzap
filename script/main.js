$(document).ready(function () {
    console.log('main.js is working')
    console.log($)


    /************/
    /* FUNCTIONS
    /************/

    function send_Message(text, bot=false) {
        var mess = template_mes.clone()

        bot ? mess.addClass('bot') : mess.addClass('user')

        mess.find('.mess-content').text(text)
        mess.find('.mess-time').text('prova')
        mess.appendTo(chat_history)
        chat_history.scrollTop(chat_history.height()) 
    }   


    function mess_by_bot() {
        var content = bot_messages[Math.random() * bot_messages.length | 0]
        bot_timerId = setTimeout(() => send_Message(content, true), 2000)
    }


    function mess_send_by_User() {
        var new_content = chat_input.val().trim()
        if (new_content) {
            send_Message(new_content)
            clearTimeout(bot_timerId)   //If user sends multiple messages within two seconds, the bot will answer only once.
            mess_by_bot()
        }

        chat_input.val('') 
        chat_input.blur()
    }

    
    function enabling_chatBtn() {
        chat_btn.children('i').removeClass('fa-microphone').addClass('fa-paper-plane')
        chat_btn.click(mess_send_by_User)
        console.log('enbaling called')
    }


    function forceFocus_on_ChatInput() {
        if (chat_input.val().trim()) {
            setTimeout(() => chat_input.focus(), 100)
        }
    }




    /***********/
    /* SCRIPT
    /***********/

    const bot_messages = ['Ehi!', 'Come va?', 'Andiamo a bere?', 'Come stai?', 'Da quanto tempo!']

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


    // Loading previous messages
    // ToDO: MAKE FUNCTION: This sould be activated every time a user switch chat to another contact
    for (item of michele_history) {
        send_Message(item[0], item[1])
    }

    // chat_input alwasy keeps focus, unless input is empty
    chat_input.blur(forceFocus_on_ChatInput)


    chat_input.focus(enabling_chatBtn)

    chat_input.blur(function() {
        chat_btn.children('i').removeClass('fa-paper-plane').addClass('fa-microphone')
        chat_btn.unbind()
    })


    $(document).keyup((function (e) { 
        if (e.which == 13 || e.keyCode == 13) mess_send_by_User()
        }
    )) 
    
});