import childProc from 'child_process'
import fs from 'fs'
import os from 'os'

import BrowserPlugin from './browser-plugin'

// Determine Chrome config location
let dir
if (os.type() === 'Darwin') {
  dir = `${os.homedir()}/Library/Application Support/Google/Chrome/Default/Bookmarks`
}

class ChromePlugin extends BrowserPlugin {

  search (searchTerm) {
    // Yes we can use synchronous code here because the file needs to be loaded before something will happen anyways
    const data = fs.readFileSync(dir, 'utf8')

    var obj = JSON.parse(data)
    const bookmarkItems = obj.roots.bookmark_bar.children

    // Filter all entries
    let filtered = []
    bookmarkItems.forEach(item => {
      if (item.type === 'url' && (item.url.includes(searchTerm) || item.name.includes(searchTerm))) {
        filtered.push({
          name: item.name,
          value: item.url
        })
      }
    })
    return filtered.slice(1)
  }

  open (url) {
    childProc.exec(`open -a "Google Chrome" "${url}"`)
  }
}

export default ChromePlugin
