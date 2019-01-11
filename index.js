const http = require('http')
const fs = require('fs')
const Promise = require('promise')
const request = require('request')

const requestUrl = 'http://huaban.com/favorite/beauty/?jf5ga5b7&max=1567407240&limit=100&wfl=1'

const pathAccessible = path => {
    let accessible = false
    try {
        fs.accessSync(path, fs.constants.R_OK | fs.constants.W_OK)
        accessible = true
    } catch (err) {
        console.error(`Access Directory ${path} Failed`)
    }
    return accessible
}

const pathExists = path => fs.existsSync(path)

const checkPathPermissions = path => {
    if (pathExists(path) && pathAccessible(path)) {
        return
    } 
    if (!pathExists(path) && pathAccessible('.')) {
        fs.mkdirSync(path)
        return
    }
    if (!pathAccessible('.') || !pathAccessible(path)) {
        process.exit(1)
    }
}

function getHtml(url) {
    return new Promise((resolve, reject) => {
        http.get(url, res => {
            let html = ''
            res.setEncoding('utf-8')
            res.on('data', chunk => {
                html += chunk
            })
            res.on('end', () => {
                resolve(html)
            })
        }).on('error', e => {
            reject(e)
        })
    })
}

 async function writeFile(uri, filename) {    
    request.head(uri, (err, res, body) => {
        if (err) {
                
        }
    })
    await console.log('\n-----STRAT DOWNLOAD-----\n')
    await console.log('-FILENAME: ' + filename + '\n')
    await request(uri).pipe(fs.createWriteStream('./image/' + filename))
    await console.log('-----ENDED DOWNLOAD-----\n')   
}

async function getData () {
    let html = await getHtml(requestUrl)
    let arr = html.match(/"key":"(\w+-\w+)",\s"type":"image\/jpeg"/g).concat()
    arr.forEach(ele => {
        let uri = 'http://img.hb.aicdn.com/' + ele.match(/(\w+-\w+)/)[1]
        let filename = ele.match(/(\w+-\w+)/)[1] + '.jpeg'
        writeFile(uri, filename)
    })
}

checkPathPermissions('./image')
getData()
