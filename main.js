const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow () {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// myWindow.webContents.on('context-menu', (event, params) => {
//   const menu = new electron.Menu()

//   // Add each spelling suggestion
//   for (const suggestion of params.dictionarySuggestions) {
//     menu.append(new electron.MenuItem({
//       label: suggestion,
//       click: () => mainWindow.webContents.replaceMisspelling(suggestion)
//     }))
//   }

//   // Allow users to add the misspelled word to the dictionary
//   if (params.misspelledWord) {
//     menu.append(
//       new MenuItem({
//         label: 'Add to dictionary',
//         click: () => mainWindow.webContents.session.addWordToSpellCheckerDictionary(params.misspelledWord)
//       })
//     )
//   }

//   menu.popup()
// })