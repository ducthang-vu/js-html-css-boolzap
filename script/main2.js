/******************************/
/****** GLOBAL VARIABLES *******/
/******************************/

/* CONTACTS AND THEIR HISTORY () - would be better with classes and object! */
// Each row contains: message (string), time (string), received (bool), hidden (bool)
var michele_history = [
    ['Ciao, come stai?', '06.20', false, false],
    ['Ciao, come stai?', '14.21', true, false],
    ['Ciao, come stai?', '21.41', false, false],
]

var fabio_history = [
    ['Ciao, sono Fabio!', '06.20', true, false],
    ['Ciao, ci sentiamo per le 2?', '12.51', false, false],
    ['Ciao, facciamo per le 3', '15.31', true, false],
]

var samuele_history = [
    ['Ciao, Samuele, come stai?', '04.10', false, false],
    ['Ciao, come stai?', '14.24', true, false],
    ['Bene, tu?', '20.31', false, false],
]

var alessandro_B_history = [
    ['Ciao, sono Ale B, da quanto tempo?', '06.20', true, false],
    ['Ciao, come stai?', '14.21', false, false],
    ['Ti devo parlare', '21.41', true, false],
]

var alessandro_L_history = [
    ['Ciao, sono Ale L, perché non mi rispondi?', '06.20', true, false],
    ['Ciao, ci sei?', '14.11', true, false],
    ['Ciao, come stai?', '23.41', false, false],
]

var claudia_history = [
    ['Ciao, sono Claudia, questo è il mio nuovo numero!', '06.20', true, false],
    ['Ciao, ok, salvato, come stai?', '16.34', false, false],
    ['Ciao, bene, tu?', '21.41', true, false],
]


var davide_history = [
    ['Ciao, sono Davide', '00.15', true, false],
    ['Ciao, come stai?', '13.21', false, false],
    ['Bene, tu?', '19.23', true, false],
]

var federico_history = [
    ['Ciao Federico, mi puoi chiamare?', '10.10', false, false],
    ['Ciao, ok, a che ora?', '11.21', true, false],
    ['Ciao, stasera vero le 19.00', '11.41', false, false],
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
const delete_button = $('.delete-button')
const last_time_display = $('#last-time-display')
const search_input = $('#sidebar-input')
const contact_list = $('.contact-list')

const template_mes = $('.template.message .mess-row')

var currentContact = 0 //on page load



/************************/
/****** FUNCTIONS *******/
/************************/
function add_history(contact, text, time, bot=false) {
    var str_time = (time.getHours() + '.' + time.getMinutes()).replace(/\b([\d])\b/, '0$&')
    contacts[contact][1].push([text, str_time, bot, false])
}


function getLastTime(contactId) {
    // Getting a string containing the last time a message was sent by the contact
    var received = (contacts[contactId][1]).filter(x => x[2] == true)
    return (received.slice(-1)[0])[1]
}


function print_message(contact, n=-1) {
    //if user change contact after the function is called, printing is aborted
    if (contact != currentContact) return -1 

    if (isNaN(n)) throw 'Parameter "' + n + '" is not a number.'

    var mess = template_mes.clone(true, true)
    

    var item_history = (contacts[currentContact][1]).slice(n)[0]

    if (!item_history[3]) { // check if message is hidden
        mess.attr('data-msg', (contacts[currentContact][1]).indexOf(item_history))

        mess.find('.mess-content').text(item_history[0])
        mess.find('.mess-time').text(item_history[1])
        item_history[2] ? mess.addClass('received') : mess.addClass('user')

        mess.appendTo(chat_history)

        chat_history.animate({scrollTop: chat_history.prop("scrollHeight")}, 1000)
    } else return -1 
}  


function mess_by_bot(contact) {
    var content = bot_messages[Math.random() * bot_messages.length | 0]

    add_history(contact, content, new Date, true)

    //bot_timerId = setTimeout(() => print_Message()
    setTimeout(() => {
            print_message(contact)
            contact_item = contact_list.children('[data-idContact="' + contact + '"]')
            contact_item.find('.right-btn').text(getLastTime(contact))
            last_time_display.text(getLastTime(currentContact))
        }
        , 1000)
}


function mess_send_by_User() {
    var new_content = chat_input.val().trim()
    if (new_content) {
        add_history(currentContact, new_content, new Date)
        print_message(currentContact)
        //clearTimeout(bot_timerId)   //If user sends multiple messages within two seconds, the bot will answer only once.
        mess_by_bot(currentContact)
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


function switchContact(n=0) {
    currentContact = n

    contact_list.children().removeClass('active')
    contact_list.children('[data-idContact="' + n + '"]').addClass('active')

    contact_header.children('h1').text((contacts[currentContact][0]))
    last_time_display.text(getLastTime(currentContact))

    chat_history.html('')
    for (i = 0; i < (contacts[currentContact][1]).length; i++) {
        print_message(currentContact, i)
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


function hide_from_history(code) {
    ((contacts[currentContact][1])[code])[3] = true
}

/*********************/
/****** SCRIPT *******/
/*********************/

// USER ENABLED TO DELETE MESSAGES
delete_button.click(function() {
    var code = $(this).parents('li').attr('data-msg')
    $(this).parents('li').remove() 
    hide_from_history(code)
})

// ACTIVATING CONTACT SELECTION
switchContact()

contact_list.children().click(function() {
    switchContact($(this).attr('data-idContact'))
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


// ACTIVATING MESS-MENU
$('.mess-menu > button').click(function() {
    $(this).parent().children('.options').show()
})
