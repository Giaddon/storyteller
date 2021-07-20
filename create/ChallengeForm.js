const CreateForm = require("./CreateForm");

class ChallengeForm extends CreateForm {
  constructor(api, challenge) {
    super(api);
    this.id = challenge.id;
    this.quality = challenge.quality || Object.values(this.getQualities())[0];
    this.difficulty = challenge.difficulty || 1;
  }

  render() {
    let challenge = document.createElement("div");
    challenge.classList.add("challenge", "flex-row", "form-section");

    let qualityDiv = document.createElement("div");
    qualityDiv.classList.add("input-group");
    challenge.append(qualityDiv);

    let qualityLabel = document.createElement("label");
    qualityLabel.innerText = "Quality";
    qualityLabel.htmlFor = `challenge-${this.id}-quality`;
    qualityDiv.append(qualityLabel);

    let qualitySelect = document.createElement("select");
    qualitySelect.id = `challenge-${this.id}-quality`;
    for (const quality of Object.values(this.getQualities())) {
      let option = document.createElement("option");
      option.value = quality.id;
      option.text = quality.name;
      qualitySelect.add(option);
    }
    qualitySelect.value = this.quality;
    qualitySelect.addEventListener("change", this.captureField.bind(this, "quality"));
    qualityDiv.append(qualitySelect);

    let diffDiv = document.createElement("div");
    diffDiv.classList.add("input-group");
    challenge.append(diffDiv);

    let {input: diff, label: diffLabel} = this.createInput(
      "number", 
      "challenge", 
      "difficulty", 
      this.difficulty, 
      `${this.id}`
    );
    diff.addEventListener("input", this.captureField.bind(this, "difficulty"));
    diffDiv.append(diffLabel);
    diffDiv.append(diff);

    return challenge;
  }

  returnData() {
    return {
      id: this.id,
      quality: this.quality,
      difficulty: this.difficulty,
    }
  }
}

module.exports = ChallengeForm;