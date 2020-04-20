$(document).ready(function () {
    console.log('main.js is working')
    console.log($)


    /************/
    /* FUNCTIONS
    /************/

    function print_Message(text, time, bot=false) {
        var mess = template_mes.clone()

        bot ? mess.addClass('received') : mess.addClass('user')

        mess.find('.mess-content').text(text)
        mess.find('.mess-time').text(time)
        mess.appendTo(chat_history)
        chat_history.scrollTop(chat_history.prop('scrollHeight')) 
    }   


    function getMinutes_Seconds() {
        now = new Date()
        return (now.getHours() + '.' + now.getMinutes()).replace(/\b([\d])\b/, '0$&')
    }


    function mess_by_bot() {
        var content = bot_messages[Math.random() * bot_messages.length | 0]
        bot_timerId = setTimeout(() => print_Message(content, getMinutes_Seconds(), true), 2000)
    }


    function mess_send_by_User() {
        var new_content = chat_input.val().trim()
        if (new_content) {
            print_Message(new_content, getMinutes_Seconds())
            clearTimeout(bot_timerId)   //If user sends multiple messages within two seconds, the bot will answer only once.
            mess_by_bot()
        }

        chat_input.val('') 
        chat_input.blur()
    }

    
    function enabling_chatBtn() {
        chat_btn.children('i').removeClass('fa-microphone').addClass('fa-paper-plane')
        chat_btn.click(mess_send_by_User)
    }


    function forceFocus_on_ChatInput() {
        if (chat_input.val().trim()) {
            setTimeout(() => {
                if (!search_input.is(':focus')) chat_input.focus()  
            },
            50)           
        }
    }


    /***********/
    /* SCRIPT
    /***********/

    const bot_messages = ['Ehi!', 'Come va?', 'Andiamo a bere?', 'Come stai?', 'Da quanto tempo!', 'Com\'è il tempo?', 'Hai visto la partita?', 'Hai sentito Caio?']

    const michele_history = [
        ['Ciao, come stai?', '06.20', false],
        ['Ciao, come stai?', '14.21', true],
        ['Ciao, come stai?', '21.41', false],
    ]

    const chat_btn = $('#chat-btn')
    const chat_history = $('#content-history')
    const chat_input = $('#chat-input')
    const search_input = $('#sidebar-input')

    const template_mes = $('.template.message .mess-row')

    var bot_timerId


    // Loading previous messages
    // ToDO: MAKE FUNCTION: This should be activated every time a user switch chat to another contact
    for (item of michele_history) {
        print_Message(item[0], item[1], item[2])
    }

    // chat_input alwasy keeps focus, unless input is empty
    chat_input.blur(forceFocus_on_ChatInput)


    chat_input.focus(enabling_chatBtn)

    chat_input.blur(() => {
        chat_btn.children('i').removeClass('fa-paper-plane').addClass('fa-microphone')
        chat_btn.unbind()
    })


    $(document).keyup((function (e) { 
        if (e.which == 13 || e.keyCode == 13) mess_send_by_User()
        }
    )) 
    
});


