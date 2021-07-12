function startGame(gameName) {
  const activeProfile = getActiveProfile();
  const gameLocation = path.join(gamesFolder, gameName);
  const activeProfileFolder = path.join(profilesFolder, activeProfile);
  
  const gameTitle = gameName.split('.')[0];
  const saveFileLocation = path.join(activeProfileFolder, `${gameTitle}-save.json`)
  let saveFile;
  try {
    saveFile = fs.readFileSync(saveFileLocation)
  } catch(error) {
    console.error(error.message);
  }
  let confirmation;
  if (saveFile) {
    console.log(JSON.parse(saveFile));
  } else {
    confirmation = window.confirm('No save file found. Start a new game?')
    if (confirmation) await fs.writeFile(saveFileLocation, '{"data":{}}');
  }
  let gameContent = await fs.readFile(gameLocation, {encoding: 'utf-8'});

}