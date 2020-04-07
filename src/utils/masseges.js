const generateMasseges = (username,text) => {
    return {
        username,
        text,
        createAt : new Date().getTime()
    }
}
const generateLocationMessages = (url) => {
    return {
        url,
        createAt : new Date().getTime()
    }
}

module.exports = {
    generateMasseges,
    generateLocationMessages
}