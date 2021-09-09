const CreateForm = require("./CreateForm");

class ChallengeForm extends CreateForm {
  constructor(state, challenge) {
    super(state);
    this.id = challenge.id;
    this.quality = challenge.quality || Object.values(this.state.getQualities())[0];
    this.difficulty = challenge.difficulty || "med";
    this.target = challenge.target || 1
    this.modifier = challenge.modifier || "none";
  }

  render() {
    let challenge = document.createElement("div");
    challenge.classList.add("challenge", "flex-row", "form-section");

    let qualityDiv = document.createElement("div");
    qualityDiv.classList.add("input-group");
    challenge.append(qualityDiv);

    const {select: qualitySelect, label: qualityLabel} = this.createSelect(
      "Quality",
      "qualities",
      "",
      this.id
    )
    qualitySelect.value = this.quality;
    const option = document.createElement("option");
    option.value = "luck";
    option.text = "System: Luck";
    qualitySelect.add(option);
    qualitySelect.addEventListener("change", this.captureField.bind(this, "quality"));

    qualityDiv.append(qualityLabel, qualitySelect);
    
    let modifierDiv = document.createElement("div");
    modifierDiv.classList.add("input-group");
    challenge.append(modifierDiv);

    const {select: modifierSelect, label: modifierLabel} = this.createSelect(
      "Modifier",
      "qualities",
      "modifier",
      this.id
    )
    modifierSelect.value = this.modifier;
    modifierSelect.addEventListener("change", this.captureField.bind(this, "modifier"));

    modifierDiv.append(modifierLabel, modifierSelect);

    const diffDiv = document.createElement("div");
    diffDiv.classList.add("input-group");
    challenge.append(diffDiv);

    const difficultyLabel = document.createElement("label");
    difficultyLabel.innerText = "Difficulty";
    difficultyLabel.htmlFor = `difficulty-select-challenge-${this.id}`;

    const difficultySelect = document.createElement("select");
    difficultySelect.id = `difficulty-select-challenge-${this.id}`;
    for (const [label, value] of [["Easy", "easy"],["Medium", "med"],["Hard", "hard"]]) {
      const option = document.createElement("option");
      option.value = value;
      option.text = label;
      difficultySelect.add(option);
    }
    difficultySelect.value = this.difficulty;
    difficultySelect.addEventListener("change", this.captureField.bind(this, "difficulty"));
    diffDiv.append(difficultyLabel, difficultySelect)


    let targetDiv = document.createElement("div");
    targetDiv.classList.add("input-group");
    challenge.append(targetDiv);

    let {input: target, label: targetLabel} = this.createInput(
      "number", 
      "challenge", 
      "target", 
      this.target, 
      `${this.id}`
    );
    target.addEventListener("input", this.captureField.bind(this, "target"));
    targetDiv.append(targetLabel, target);

    return challenge;
  }

  returnData() {
    return {
      id: this.id,
      quality: this.quality,
      modifier: this.modifier,
      difficulty: this.difficulty,
      target: this.target,
    }
  }
}

module.exports = ChallengeForm;