const u = require("../utilities");

class OptionsDisplay {
  constructor(api, prepareResults) {
    this.api = api;
    this.prepareResults = prepareResults;
  }

  render() {
    const activeStorylet = this.api.getCurrentStorylet();
    let options = {}
    if (activeStorylet) {
      options = activeStorylet.actions;
    } else {
      let activeDomain = this.api.getCurrentDomain();
      for (const storyletId of activeDomain.storylets) {
        const storylet = this.api.getStorylet(storyletId);
        const option = {
          id: storylet.id,
          title: storylet.title,
          text: (storylet.text.split(".")[0] + "..."),
          results: storylet.results
        }
        options[storylet.id] = option;
      }
    }
    let optionsList = u.create({tag:"div", class:["options-list"]})
    for (const option of Object.values(options)) {
      const renderedOption = this.renderOption(option);
      if (renderedOption) {
        optionsList.append(renderedOption)
      }
    }
    return optionsList
  }

  renderOption(option) {
    const optionElement = this.createOption(option);
    const {active, labels} = this.evaluateReqs(option.reqs)

    for (const label of labels) {
      optionElement.querySelector(".option-reqs-container").append(label);
    }

    if (active) { 
      optionElement.setAttribute('tabindex', '0');
      optionElement.addEventListener('click', this.prepareResults.bind(null, option));
    } else {
      // if (option.reqs.hidden) {
      //   optionElement.remove();
      //   return;
      // }
      optionElement.classList.add('option-disabled');
    }

    if (option.challenges) {
      for (const challenge of option.challenges) {
        let playerValue = this.api.getPlayerQuality(challenge.quality);
        let qualityLabel = this.api.getQuality(challenge.quality).name;
        let chance = challenge.difficulty - playerValue;
        if (chance > 6) {
          chance = 0;
        } else if (chance < 2) {
          chance = 100;  
        }
        else {
          chance = Math.round((1/6 * (6 - (chance - 1))) * 100);
        } 
        let challengePhrase = `This is a ${qualityLabel} challenge with difficulty ${challenge.difficulty}.\nYour ${qualityLabel} of ${playerValue} gives you a ${chance}% chance of success.`
        let challengeText = document.createElement("p");
        challengeText.innerText = challengePhrase;
        optionElement.querySelector(".option-challenge-container").append(challengeText);
      }
    } // end if challenge

    return optionElement;
  }

  evaluateReqs(reqs) {
    if (!reqs) return {active: true, labels: []}
    if (reqs.qualities.length < 1) return {active: true, labels: []};
    let reqArray = [];
    let labels = [];
    if (reqs && reqs.qualities.length > 0) {
      for (const req of reqs.qualities) {
        const playerValue = this.api.getPlayerQuality(req.quality);
        const qualityData = this.api.getQuality(req.quality);
        const min = Number(req.min) || -Infinity;
        const max = Number(req.max) || Infinity;
        const passed = (playerValue >= min && playerValue <= max)
        reqArray.push(passed);
        if (qualityData.hidden !== true) {
          let label = "";
          if (min !== -Infinity) { 
            label += min.toString();
            label += " ≤ ";
          }
          label += qualityData.name;
          if (max !== Infinity) {
            label += " ≤ "
            label += max.toString();
          }
          const newLabel = this.createOptionReq({label, passed});
          labels.push(newLabel);
        }
      }
    }
    let active = false;
    if (reqArray.length > 0 && reqArray.every(passed => passed)) {
        active = true;
      }
    return {active, labels};
  }

  createOption(optionData) {
    let option = document.createElement("div");
    option.classList.add('option');
  
    let title = document.createElement("h1");
    title.innerText = optionData.title;
    option.appendChild(title);
    
    let text = document.createElement("p");
    text.innerText = optionData.text;
    option.appendChild(text);
  
    let challengeContainer = document.createElement('div');
    challengeContainer.classList.add("option-challenge-container");
    option.appendChild(challengeContainer);
  
    let reqsContainer = document.createElement('div');
    reqsContainer.classList.add("option-reqs-container");
    option.appendChild(reqsContainer);
  
    return option;
  }
  
  createOptionReq(reqData) {
    const req = document.createElement('div');
    req.classList.add('option-req');
  
    const label = document.createElement('h1');
    label.innerText = reqData.label;
    req.appendChild(label);
  
    if (!reqData.passed) {
      req.classList.add('req-disabled');
    }
  
    return req;
  }

}
    
    
    
    
//     let reqArray = [];
//     if (option.reqs && option.reqs.qualities.length > 0) {
//       for (let req of option.reqs.qualities) {
//         const quality = this.api.getQuality(req.quality);
//         const playerValue = this.api.getPlayerQuality(req.quality) || 0;
//         let min = Number(req.min) || -Infinity;
//         let max = Number(req.max) || Infinity;
//         reqArray.push((playerValue >= min && playerValue <= max))
//       }
//       let disabled = false;
//       if (reqArray.length > 0 && !reqArray.every(passed => passed)) {
//         disabled = true;
//       }
//     }
    
//     const newOption = u.create({tag:"div", classes:["option"]});
//     const newOptionTitle = u.create({tag:"h1", content: option.title})
//     newOption.append(newOptionTitle);

//     const newOptionTitle = document.createElement("h1");
//     newOptionTitle.innerText = option.title;
    
    
//     const newOptionText = document.createElement("p");
//     newOptionText.innerText = option.text;
//     newOption.appendChild(newOptionText);

//     if (disabled) { 
//       newOption.classList.add('option-disabled');
//     } else {
//       newOption.setAttribute('tabindex', '0');
//   }

//     if (activeDomain.actions && activeDomain.actions.length > 0) {
//       for (let actionId of activeDomain.actions) {
//         const action = story.actions[actionId];
        
        
  
        
          
//           newAction.addEventListener('click', (event) => {
//             u.removeChildren(conclusionContainer);
            
//             for (let change of action.results.changes) {
//               switch (change.type) {
//                 case 'set':
//                   state.actions.set(change.quality, change.value);
//                   break;
//                 case 'adjust':
//                   state.actions.adjust(change.quality, change.value);
//                   break;
//                 default:
//                   console.error('No valid change type found.');
//               }
//               renderQuality(change.quality, state.qualities[change.quality]);
  
//               if (action.results.conclusion) {
//                 u.removeChildren(conclusionContainer);
//                 const conclusion = action.results.conclusion;
//                 const newConclusion = document.createElement("div");
//                 const newConclusionTitle = document.createElement("h1");
//                 const newConclusionText = document.createElement("p");
  
//                 newConclusionTitle.innerText = conclusion.title;
//                 newConclusionText.innerText = conclusion.text;
  
//                 newConclusion.appendChild(newConclusionTitle);
//                 newConclusion.appendChild(newConclusionText);
  
//                 conclusionContainer.appendChild(newConclusion);
  
//               }
//             }
//             renderDomain();
            
//           }) // end click event
//         } // end if disabled
//         actionsContainer.append(newAction);
//   }
// }

module.exports = OptionsDisplay;