const http = require('http')
const fs = require('fs')
const Promise = require('promise')
const request = require('request')
const rp = require('request-promise')
const cheerio = require('cheerio')
const crawlPicCount = 5

const requestUrl = 'http://huaban.com/favorite/beauty/'
/*
    首次请求用 http://huaban.com/favorite/beauty/
    之后使用 http://huaban.com/favorite/beauty/?max=${下个队列的首个pin_id}&wfl=1&limit=${一次要抓取的数量}
*/

const options = {
    uri: `http://huaban.com/favorite/beauty/`,
    transform: function (body) {
        return cheerio.load(body)
    }
}

const sliceString = (string, charHead, charTail) => 
    string.slice(
        string.indexOf(charHead) + charHead.length || 0
        , string.indexOf(charTail) || string.length - 1
    )

const getPicIdQueueInfo = responseJSON => {
    return {
        firstId: responseJSON[0].pin_id,
        lastId: responseJSON.getLast().pin_id,
        count: responseJSON.length,
        picUrls: responseJSON
            .map(picInfo => `http://img.hb.aicdn.com/${picInfo.file.key}_/fw/480`)
    }
}

rp(options)
    .then($ => {
        //process html to picUrls
        let { data } = $('script').contents()[7]
        let responseJSON = JSON.parse(sliceString(data, 'app.page["pins"] = ', ';\napp.page["ads"]'))
        let { firstId, lastId, count, picUrls } = getPicIdQueueInfo(responseJSON)
    })
    .catch(err => {
        //Crawling failed or Cheerio choked
    })

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

/*
    getHtml(url) will be removed
*/

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

/*
    wirteFile() will be rewrited
*/

 async function writeFile(uri, filename) {    
    request.head(uri, (err, res, body) => {
        if (err) {
                
        }
    })
    console.log('\n-----STRAT DOWNLOAD-----\n')
    console.log('-FILENAME: ' + filename + '\n')
    await request(uri).pipe(fs.createWriteStream('./image/' + filename))
    console.log('-----ENDED DOWNLOAD-----\n')   
}

async function writeFile (filename) {

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

// checkPathPermissions('./image')
// getData()
