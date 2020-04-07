const socket = io() 


//Elements

const $formMassege = document.querySelector('#form-massege')
const $messageInput = $formMassege.querySelector('input')
const $messageButton = $formMassege.querySelector('button')
const $shareLocation = document.querySelector('#shareLocation')
const $messages = document.querySelector('#messages')

//Temlates

const temp = document.querySelector('#template').innerHTML
const locationTemp = document.querySelector('#location-template').innerHTML

//options

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.on('countUpdated', (count) => {
    console.log('count updated!!', count)
})

socket.on('locationMessage' , (location) => {
    console.log(location)
    const html = Mustache.render(locationTemp, {
        url: location.url,
        createAt : moment(location.createAt).format('h:mm')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})


$formMassege.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageButton.setAttribute('disabled','disabled')

    const message = e.target.elements.message.value
    socket.emit('sendMassege', message, (massege) => {
        $messageButton.removeAttribute('disabled')
        $messageInput.value = ''
        $messageInput.focus()

        console.log(massege)

    })
})

$shareLocation.addEventListener('click', () => {
    if(!navigator.geolocation) {
        return alert('geolocation not support in your brouser')
    }
    navigator.geolocation.getCurrentPosition((position) => {
        $shareLocation.setAttribute('disabled','disabled')

        const lat = position.coords.latitude
        const lot = position.coords.longitude
        socket.emit('sharePosition' , lat, lot, () => {
            console.log('location shared!')
            $shareLocation.removeAttribute('disabled')
        })
    })
})
// document.querySelector('#plus1').addEventListener('click' , () => {
//     console.log('cliked')
//     socket.emit('plus1')
// })

socket.on('massege' ,(message) => {
    //console.log(message)
    const html = Mustache.render(temp, {
        username: message.username,
        message: message.text,
        createAt: moment(message.createAt).format('h:mm')
        
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.emit('join', { username , room }, (error) => {
    
})