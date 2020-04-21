/******************************/
/****** GLOBAL VARIABLE *******/
/******************************/

/* CONTACTS AND THEIR HISTORY () - would be better with classes and object! */
var michele_history = [
    ['Ciao, come stai?', '06.20', false],
    ['Ciao, come stai?', '14.21', true],
    ['Ciao, come stai?', '21.41', false],
]

var fabio_history = [
    ['Ciao, sono Fabio!', '06.20', true],
    ['Ciao, ci sentiamo per le 2?', '12.51', false],
    ['Ciao, facciamo per le 3', '15.31', true],
]

var samuele_history = [
    ['Ciao, Samuele, come stai?', '04.10', false],
    ['Ciao, come stai?', '14.24', true],
    ['Bene, tu?', '20.31', false],
]

var alessandro_B_history = [
    ['Ciao, sono Ale B, da quanto tempo?', '06.20', true],
    ['Ciao, come stai?', '14.21', false],
    ['Ti devo parlare', '21.41', true],
]

var alessandro_L_history = [
    ['Ciao, sono Ale L, perché non mi rispondi?', '06.20', true],
    ['Ciao, ci sei?', '14.11', true],
    ['Ciao, come stai?', '23.41', false],
]

var claudia_history = [
    ['Ciao, sono Claudia, questo è il mio nuovo numero!', '06.20', true],
    ['Ciao, ok, salvato, come stai?', '16.34', false],
    ['Ciao, bene, tu?', '21.41', true],
]


var davide_history = [
    ['Ciao, sono Davide', '00.15', true],
    ['Ciao, come stai?', '13.21', false],
    ['Bene, tu?', '19.23', true],
]

var federico_history = [
    ['Ciao Federico, mi puoi chiamare?', '10.10', false],
    ['Ciao, ok, a che ora?', '11.21', true],
    ['Ciao, stasera vero le 19.00', '11.41', false],
]

const contacts = [
    ['Michele', michele_history], 
    ['Fabio', fabio_history], 
    ['Samuele', samuele_history], 
    ['Alessandro B.', alessandro_B_history], 
    ['Alessandro L.', alessandro_L_history], 
    ['Claudia', claudia_history], 
    ['Davide', davide_history], 
    ['Federico', federico_history]
]



const bot_messages = ['Ehi!', 'Come va?', 'Andiamo a bere?', 'Come stai?', 'Da quanto tempo!', 'Com\'è il tempo?', 'Hai visto la partita?', 'Hai sentito Caio?']

const contact_header = $('#content-title')
const chat_btn = $('#chat-btn')
const chat_history = $('#content-history')
const chat_input = $('#chat-input')
const search_input = $('#sidebar-input')
const contact_list = $('.contact-list')

const template_mes = $('.template.message .mess-row')

var currentContact = 0 //on page load



/************************/
/****** FUNCTIONS *******/
/************************/
function add_history(text, time, bot=false) {
    var str_time = (time.getHours() + '.' + time.getMinutes()).replace(/\b([\d])\b/, '0$&')
    contacts[currentContact][1].push([text, str_time, bot])
}


function print_message(n=-1) {
    // //
    if (isNaN(n)) throw 'Parameter "' + n + '" is not a number.'

    var mess = template_mes.clone()

    var item_history = (contacts[currentContact][1]).slice(n)[0]

    mess.find('.mess-content').text(item_history[0])
    mess.find('.mess-time').text(item_history[1])
    item_history[2] ? mess.addClass('received') : mess.addClass('user')

    mess.appendTo(chat_history)

    chat_history.animate({scrollTop: chat_history.prop("scrollHeight")}, 1000)
}  


function mess_by_bot() {
    var content = bot_messages[Math.random() * bot_messages.length | 0]

    add_history(content, new Date, true)

    //bot_timerId = setTimeout(() => print_Message()
    setTimeout(() => print_message(), 1000)
}


function mess_send_by_User() {
    var new_content = chat_input.val().trim()
    if (new_content) {
        add_history(new_content, new Date)
        print_message()
        //clearTimeout(bot_timerId)   //If user sends multiple messages within two seconds, the bot will answer only once.
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
        setTimeout(() => {if (!search_input.is(':focus')) chat_input.focus()}, 5)           
    }
}


function switch_currentContact(n=0) {
    currentContact = n

    contact_list.children().removeClass('active')
    contact_list.children('[data-idContact="' + n + '"]').addClass('active')

    contact_header.children('h1').text((contacts[currentContact][0]))

    chat_history.html('')
    for (i = 0; i < (contacts[currentContact][1]).length; i++) {
        print_message(i)
    }
}


function activate_searchInput() {
    contact_list.children().show()

    for ([index, contact] of contacts.entries()) {
        if (!contact[0].toLocaleLowerCase().includes(search_input.val().trim().toLocaleLowerCase())) {
            contact_list.children('[data-idContact="' + index + '"]').hide()
        }
    }
}


/*********************/
/****** SCRIPT *******/
/*********************/

// ACTIVATING CONTACT SELECTION
switch_currentContact()

contact_list.children().click(function() {
    switch_currentContact($(this).attr('data-idContact'))
})


// ACTIVATING CHAT INTERACTION
chat_input.focus(enabling_chatBtn).blur(forceFocus_on_ChatInput)

chat_input.blur(() => {
    chat_btn.children('i').removeClass('fa-paper-plane').addClass('fa-microphone')
    chat_btn.unbind()
})

$(document).keyup((function (e) { 
    if (e.which == 13 || e.keyCode == 13) mess_send_by_User()
    }
)) 


// ACTIVATING SEARCH INPUT
search_input.on('input', activate_searchInput)