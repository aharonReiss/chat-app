const users = []

const addUser = ( { id, username, room } ) => {
    //console.log(username)
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
    
    if(!username || !room) {
        return {error: 'user name an room are required'}
    }

    const existingUser = users.find((user) => {
        return user.username === username && user.room === room
    })

    if(existingUser) {
        return {error: 'username is in use'}
    }

    const user = {id,username,room}
    users.push(user)
    return {user}

}

const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })
    if(index != -1) {
        return users.splice(index,1)[0]
    }
}

const getUserById = (id) => {
   return(users.find((user) => user.id === id))
}

const getUsersInRoom = (room) => {
    return users.filter((user) => user.id === id)
}

module.exports = {
    addUser,
    removeUser,
    getUserById,
    getUsersInRoom
}

