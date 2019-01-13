const sliceString = (string, charHead, charTail) => 
    string.slice(
        string.indexOf(charHead) + charHead.length || 0
        , string.indexOf(charTail) || string.length - 1
    )

module.exports = { sliceString }