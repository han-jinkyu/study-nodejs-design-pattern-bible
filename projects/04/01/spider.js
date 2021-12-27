import fs from 'fs'
import mkdirp from 'mkdirp'
import path from 'path'
import superagent from 'superagent'
import { urlToFilename } from './utils.js'

export function spider(url, cb) {
    const filename = urlToFilename(url)
    fs.access(filename, err => {
        if (err && err.code === 'ENOENT') {
            console.log(`Downloading ${url} into ${filename}`)
            superagent.get(url).end((err, res) => {
                if (err) {
                    cb(err)
                } else {
                    mkdirp(path.dirname(filename), err => {
                        if (err) {
                            cb(err)
                        } else {
                            fs.writeFile(filename, res.text, err => {
                                if (err) {
                                    cb(err)
                                } else {
                                    cb(null, filename, true)
                                }
                            })
                        }
                    })
                }
            })
        } else {
            cb(null, filename, false)
        }
    })
}
