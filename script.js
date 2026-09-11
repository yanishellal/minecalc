const tonnageForm = document.querySelector("#tonnage-form");
const resetButton = document.querySelector("#reset-button");
const resultValue = document.querySelector("#result-value");
const volumeValue = document.querySelector("#volume-value");
const formMessage = document.querySelector("#form-message");
const historyStorageKey = "minecalc-history";
const historyList = document.querySelector("#history-list");
const historyEmpty = document.querySelector("#history-empty");
const clearHistoryButton = document.querySelector("#clear-history-button");
const exportHistoryButton = document.querySelector("#export-history-button");
const themeButton = document.querySelector("#theme-button");
const themeStorageKey = "minecalc-theme";
const menuButton = document.querySelector("#menu-button");
const mainNavigation = document.querySelector("#main-navigation");

tonnageForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const length = Number(document.querySelector("#length").value);
  const width = Number(document.querySelector("#width").value);
  const height = Number(document.querySelector("#height").value);
  const density = Number(document.querySelector("#density").value);

  if (
    !Number.isFinite(length) ||
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    !Number.isFinite(density) ||
    length <= 0 ||
    width <= 0 ||
    height <= 0 ||
    density <= 0
  ) {
    formMessage.textContent =
      "Entre uniquement des valeurs supérieures à zéro.";
    return;
  }

  const volume = length * width * height;
  const tonnage = volume * density;

  volumeValue.textContent = `${formatNumber(volume)} m³`;
  resultValue.textContent = `${formatNumber(tonnage)} tonnes`;
  formMessage.textContent = "";
  saveCalculation("Tonnage", `${formatNumber(tonnage)} tonnes`);
});

resetButton.addEventListener("click", () => {
  tonnageForm.reset();

  resultValue.textContent = "-- tonnes";
  volumeValue.textContent = "-- m³";
  formMessage.textContent = "";
});

function formatNumber(value) {
  return new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 2
  }).format(value);
}

const gradeForm = document.querySelector("#grade-form");
const blockList = document.querySelector("#block-list");
const addBlockButton = document.querySelector("#add-block-button");
const gradeResetButton = document.querySelector("#grade-reset-button");
const gradeResult = document.querySelector("#grade-result");
const totalTonnage = document.querySelector("#total-tonnage");
const gradeMessage = document.querySelector("#grade-message");

let blockNumber = 1;

addBlockButton.addEventListener("click", () => {
  blockNumber += 1;

  const blockRow = document.createElement("div");

  blockRow.className = "block-row";

  blockRow.innerHTML = `
    <div class="form-group">
      <label for="tonnage-${blockNumber}">
        Bloc ${blockNumber} - Tonnage <span>(t)</span>
      </label>

      <input
        id="tonnage-${blockNumber}"
        class="block-tonnage"
        type="number"
        min="0"
        step="any"
        placeholder="Ex. 1000"
        required
      >
    </div>

    <div class="form-group">
      <label for="grade-${blockNumber}">
        Bloc ${blockNumber} - Teneur <span>(%)</span>
      </label>

      <input
        id="grade-${blockNumber}"
        class="block-grade"
        type="number"
        min="0"
        max="100"
        step="any"
        placeholder="Ex. 2.5"
        required
      >
    </div>
  `;

  blockList.appendChild(blockRow);
});

gradeForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const tonnageInputs = document.querySelectorAll(".block-tonnage");
  const gradeInputs = document.querySelectorAll(".block-grade");

  let total = 0;
  let weightedGrade = 0;

  for (let index = 0; index < tonnageInputs.length; index += 1) {
    const tonnage = Number(tonnageInputs[index].value);
    const grade = Number(gradeInputs[index].value);

    if (
      !Number.isFinite(tonnage) ||
      !Number.isFinite(grade) ||
      tonnage <= 0 ||
      grade < 0 ||
      grade > 100
    ) {
      gradeMessage.textContent =
        "Vérifie les tonnages et les teneurs de tous les blocs.";
      return;
    }

    total += tonnage;
    weightedGrade += tonnage * grade;
  }

  const averageGrade = weightedGrade / total;

  gradeResult.textContent = `${formatNumber(averageGrade)} %`;
  totalTonnage.textContent = `${formatNumber(total)} t`;
  gradeMessage.textContent = "";
  saveCalculation("Teneur moyenne", `${formatNumber(averageGrade)} %`);
});

gradeResetButton.addEventListener("click", () => {
  gradeForm.reset();

  blockList.innerHTML = `
    <div class="block-row">
      <div class="form-group">
        <label for="tonnage-1">
          Bloc 1 - Tonnage <span>(t)</span>
        </label>

        <input
          id="tonnage-1"
          class="block-tonnage"
          type="number"
          min="0"
          step="any"
          placeholder="Ex. 1000"
          required
        >
      </div>

      <div class="form-group">
        <label for="grade-1">
          Bloc 1 - Teneur <span>(%)</span>
        </label>

        <input
          id="grade-1"
          class="block-grade"
          type="number"
          min="0"
          max="100"
          step="any"
          placeholder="Ex. 2.5"
          required
        >
      </div>
    </div>
  `;

  blockNumber = 1;
  gradeResult.textContent = "-- %";
  totalTonnage.textContent = "-- t";
  gradeMessage.textContent = "";
});

const recoveryForm = document.querySelector("#recovery-form");
const recoveryResetButton = document.querySelector("#recovery-reset-button");
const recoveredMetal = document.querySelector("#recovered-metal");
const containedMetal = document.querySelector("#contained-metal");
const recoveryMessage = document.querySelector("#recovery-message");

recoveryForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const tonnage = Number(document.querySelector("#recovery-tonnage").value);
  const grade = Number(document.querySelector("#recovery-grade").value);
  const recoveryRate = Number(document.querySelector("#recovery-rate").value);

  if (
    !Number.isFinite(tonnage) ||
    !Number.isFinite(grade) ||
    !Number.isFinite(recoveryRate) ||
    tonnage <= 0 ||
    grade < 0 ||
    grade > 100 ||
    recoveryRate < 0 ||
    recoveryRate > 100
  ) {
    recoveryMessage.textContent =
      "Entre un tonnage positif et des pourcentages compris entre 0 et 100.";
    return;
  }

  const contained = tonnage * (grade / 100);
  const recovered = contained * (recoveryRate / 100);

  containedMetal.textContent = `${formatNumber(contained)} tonnes`;
  recoveredMetal.textContent = `${formatNumber(recovered)} tonnes`;
  recoveryMessage.textContent = "";
  saveCalculation("Récupération", `${formatNumber(recovered)} tonnes récupérées`);
});

recoveryResetButton.addEventListener("click", () => {
  recoveryForm.reset();
  containedMetal.textContent = "-- tonnes";
  recoveredMetal.textContent = "-- tonnes";
  recoveryMessage.textContent = "";
});

const strippingForm = document.querySelector("#stripping-form");
const strippingResetButton = document.querySelector("#stripping-reset-button");
const strippingResult = document.querySelector("#stripping-result");
const strippingInterpretation = document.querySelector("#stripping-interpretation");
const strippingMessage = document.querySelector("#stripping-message");

strippingForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const wasteTonnage = Number(document.querySelector("#waste-tonnage").value);
  const oreTonnage = Number(document.querySelector("#ore-tonnage").value);

  if (
    !Number.isFinite(wasteTonnage) ||
    !Number.isFinite(oreTonnage) ||
    wasteTonnage < 0 ||
    oreTonnage <= 0
  ) {
    strippingMessage.textContent =
      "Le stérile doit être positif ou nul et le minerai doit être supérieur à zéro.";
    return;
  }

  const ratio = wasteTonnage / oreTonnage;

  strippingResult.textContent = `${formatNumber(ratio)} : 1`;
  strippingInterpretation.textContent =
    `${formatNumber(ratio)} t de stérile pour 1 t de minerai`;
  strippingMessage.textContent = "";
  saveCalculation("Rapport de découverture", `${formatNumber(ratio)} : 1`);
});

strippingResetButton.addEventListener("click", () => {
  strippingForm.reset();
  strippingResult.textContent = "--";
  strippingInterpretation.textContent = "--";
  strippingMessage.textContent = "";
});

const productivityForm = document.querySelector("#productivity-form");
const productivityResetButton = document.querySelector("#productivity-reset-button");
const productivityResult = document.querySelector("#productivity-result");
const productivityQuantityResult = document.querySelector("#productivity-quantity-result");
const productivityMessage = document.querySelector("#productivity-message");

productivityForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const quantity = Number(document.querySelector("#production-quantity").value);
  const time = Number(document.querySelector("#working-time").value);

  if (
    !Number.isFinite(quantity) ||
    !Number.isFinite(time) ||
    quantity <= 0 ||
    time <= 0
  ) {
    productivityMessage.textContent =
      "La quantité et le temps doivent être supérieurs à zéro.";
    return;
  }

  const productivity = quantity / time;

  productivityResult.textContent = `${formatNumber(productivity)} t/h`;
  productivityQuantityResult.textContent = `${formatNumber(quantity)} t`;
  productivityMessage.textContent = "";
  saveCalculation("Productivité", `${formatNumber(productivity)} t/h`);
});

productivityResetButton.addEventListener("click", () => {
  productivityForm.reset();
  productivityResult.textContent = "-- t/h";
  productivityQuantityResult.textContent = "-- t";
  productivityMessage.textContent = "";
});

const dilutionForm = document.querySelector("#dilution-form");
const dilutionResetButton = document.querySelector("#dilution-reset-button");
const dilutionResult = document.querySelector("#dilution-result");
const dilutionTotalTonnage = document.querySelector("#dilution-total-tonnage");
const dilutionRateResult = document.querySelector("#dilution-rate-result");
const dilutionMessage = document.querySelector("#dilution-message");

dilutionForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const oreTonnage = Number(document.querySelector("#dilution-ore-tonnage").value);
  const oreGrade = Number(document.querySelector("#dilution-ore-grade").value);
  const wasteTonnage = Number(document.querySelector("#dilution-waste-tonnage").value);

  if (
    !Number.isFinite(oreTonnage) ||
    !Number.isFinite(oreGrade) ||
    !Number.isFinite(wasteTonnage) ||
    oreTonnage <= 0 ||
    oreGrade < 0 ||
    oreGrade > 100 ||
    wasteTonnage < 0
  ) {
    dilutionMessage.textContent =
      "Le minerai doit être positif, la teneur comprise entre 0 et 100 %, et le stérile positif ou nul.";
    return;
  }

  const totalTonnage = oreTonnage + wasteTonnage;
  const finalGrade = (oreTonnage * oreGrade) / totalTonnage;
  const dilutionRate = (wasteTonnage / totalTonnage) * 100;

  dilutionResult.textContent = `${formatNumber(finalGrade)} %`;
  dilutionTotalTonnage.textContent = `${formatNumber(totalTonnage)} t`;
  dilutionRateResult.textContent = `${formatNumber(dilutionRate)} %`;
  dilutionMessage.textContent = "";
  saveCalculation("Dilution", `${formatNumber(finalGrade)} %`);
});

dilutionResetButton.addEventListener("click", () => {
  dilutionForm.reset();
  dilutionResult.textContent = "-- %";
  dilutionTotalTonnage.textContent = "-- t";
  dilutionRateResult.textContent = "-- %";
  dilutionMessage.textContent = "";
});

const costForm = document.querySelector("#cost-form");
const costResetButton = document.querySelector("#cost-reset-button");
const costResult = document.querySelector("#cost-result");
const costTotalResult = document.querySelector("#cost-total-result");
const costMessage = document.querySelector("#cost-message");

costForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const totalCost = Number(document.querySelector("#cost-total").value);
  const production = Number(document.querySelector("#cost-production").value);

  if (
    !Number.isFinite(totalCost) ||
    !Number.isFinite(production) ||
    totalCost < 0 ||
    production <= 0
  ) {
    costMessage.textContent =
      "Le coût doit être positif ou nul et la production doit être supérieure à zéro.";
    return;
  }

  const unitCost = totalCost / production;
  costResult.textContent = `${formatNumber(unitCost)} DA/t`;
  costTotalResult.textContent = `${formatNumber(totalCost)} DA`;
  costMessage.textContent = "";
  saveCalculation("Coût de production", `${formatNumber(unitCost)} DA/t`);
});

costResetButton.addEventListener("click", () => {
  costForm.reset();
  costResult.textContent = "-- DA/t";
  costTotalResult.textContent = "-- DA";
  costMessage.textContent = "";
});

const loaderForm = document.querySelector("#loader-form");
const loaderResetButton = document.querySelector("#loader-reset-button");
const loaderResult = document.querySelector("#loader-result");
const loaderCycleVolume = document.querySelector("#loader-cycle-volume");
const loaderMessage = document.querySelector("#loader-message");

loaderForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const bucketVolume = Number(document.querySelector("#bucket-volume").value);
  const fillRate = Number(document.querySelector("#bucket-fill").value);
  const cycles = Number(document.querySelector("#bucket-cycles").value);
  const density = Number(document.querySelector("#bucket-density").value);

  if (
    !Number.isFinite(bucketVolume) ||
    !Number.isFinite(fillRate) ||
    !Number.isFinite(cycles) ||
    !Number.isFinite(density) ||
    bucketVolume <= 0 ||
    fillRate < 0 ||
    fillRate > 100 ||
    cycles <= 0 ||
    density <= 0
  ) {
    loaderMessage.textContent =
      "Vérifie le volume, le taux entre 0 et 100 %, les cycles et la densité.";
    return;
  }

  const volumePerCycle = bucketVolume * (fillRate / 100);
  const production = volumePerCycle * cycles * density;

  loaderResult.textContent = `${formatNumber(production)} t/h`;
  loaderCycleVolume.textContent = `${formatNumber(volumePerCycle)} m³`;
  loaderMessage.textContent = "";
  saveCalculation("Débit de l'engin", `${formatNumber(production)} t/h`);
});

loaderResetButton.addEventListener("click", () => {
  loaderForm.reset();
  loaderResult.textContent = "-- t/h";
  loaderCycleVolume.textContent = "-- m³";
  loaderMessage.textContent = "";
});

const quizForm = document.querySelector("#quiz-form");
const quizResetButton = document.querySelector("#quiz-reset-button");
const quizResult = document.querySelector("#quiz-result");
const correctAnswers = {
  "question-1": "a",
  "question-2": "a",
  "question-3": "a"
};

quizForm.addEventListener("submit", (event) => {
  event.preventDefault();

  let score = 0;

  Object.entries(correctAnswers).forEach(([question, answer]) => {
    const selectedAnswer = quizForm.querySelector(
      `input[name="${question}"]:checked`
    );

    if (selectedAnswer && selectedAnswer.value === answer) {
      score += 1;
    }
  });

  if (score === 3) {
    quizResult.textContent = "Excellent ! Score : 3/3.";
  } else if (score === 2) {
    quizResult.textContent = "Très bien ! Score : 2/3. Relis une formule et réessaie.";
  } else {
    quizResult.textContent = `Score : ${score}/3. Consulte la section Formules puis recommence.`;
  }
});

quizResetButton.addEventListener("click", () => {
  quizForm.reset();
  quizResult.textContent = "";
});

const conversionUnits = {
  mass: {
    units: {
      kg: { label: "Kilogramme (kg)", factor: 1 },
      tonne: { label: "Tonne (t)", factor: 1000 }
    },
    defaultFrom: "tonne",
    defaultTo: "kg"
  },
  volume: {
    units: {
      liter: { label: "Litre (L)", factor: 1 },
      cubicMeter: { label: "Mètre cube (m³)", factor: 1000 }
    },
    defaultFrom: "cubicMeter",
    defaultTo: "liter"
  },
  length: {
    units: {
      meter: { label: "Mètre (m)", factor: 1 },
      kilometer: { label: "Kilomètre (km)", factor: 1000 }
    },
    defaultFrom: "kilometer",
    defaultTo: "meter"
  },
  pressure: {
    units: {
      pascal: { label: "Pascal (Pa)", factor: 1 },
      megapascal: { label: "Mégapascal (MPa)", factor: 1000000 }
    },
    defaultFrom: "megapascal",
    defaultTo: "pascal"
  }
};

const conversionCategory = document.querySelector("#conversion-category");
const conversionValue = document.querySelector("#conversion-value");
const fromUnit = document.querySelector("#from-unit");
const toUnit = document.querySelector("#to-unit");
const convertButton = document.querySelector("#convert-button");
const conversionResult = document.querySelector("#conversion-result");
const conversionMessage = document.querySelector("#conversion-message");

function updateConversionUnits() {
  const category = conversionUnits[conversionCategory.value];
  fromUnit.innerHTML = "";
  toUnit.innerHTML = "";

  Object.entries(category.units).forEach(([unitKey, unit]) => {
    fromUnit.add(new Option(unit.label, unitKey));
    toUnit.add(new Option(unit.label, unitKey));
  });

  fromUnit.value = category.defaultFrom;
  toUnit.value = category.defaultTo;
  conversionResult.textContent = "--";
  conversionMessage.textContent = "";
}

function convertUnits() {
  const value = Number(conversionValue.value);
  const category = conversionUnits[conversionCategory.value];
  const source = category.units[fromUnit.value];
  const target = category.units[toUnit.value];

  if (!Number.isFinite(value)) {
    conversionMessage.textContent = "Entre une valeur numérique valide.";
    conversionResult.textContent = "--";
    return;
  }

  const result = (value * source.factor) / target.factor;
  conversionResult.textContent = `${formatNumber(value)} ${fromUnit.options[fromUnit.selectedIndex].text.split(" ")[0]} = ${formatNumber(result)} ${toUnit.options[toUnit.selectedIndex].text.split(" ")[0]}`;
  conversionMessage.textContent = "";
  saveCalculation(
    "Conversion",
    `${formatNumber(result)} ${toUnit.options[toUnit.selectedIndex].text.split(" ")[0]}`
  );
}

conversionCategory.addEventListener("change", updateConversionUnits);
convertButton.addEventListener("click", convertUnits);
conversionValue.addEventListener("input", () => {
  conversionMessage.textContent = "";
});

updateConversionUnits();

function saveCalculation(name, result) {
  const history = getHistory();

  history.unshift({
    name,
    result,
    date: new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "short",
      timeStyle: "short"
    }).format(new Date())
  });

  localStorage.setItem(historyStorageKey, JSON.stringify(history.slice(0, 10)));
  displayHistory();
}

function updateThemeButton() {
  const isDarkMode = document.body.classList.contains("dark-mode");
  themeButton.textContent = isDarkMode ? "Mode clair" : "Mode sombre";
  themeButton.setAttribute(
    "aria-label",
    isDarkMode ? "Activer le mode clair" : "Activer le mode sombre"
  );
}

if (localStorage.getItem(themeStorageKey) === "dark") {
  document.body.classList.add("dark-mode");
}

themeButton.addEventListener("click", () => {
  const isDarkMode = document.body.classList.toggle("dark-mode");
  localStorage.setItem(themeStorageKey, isDarkMode ? "dark" : "light");
  updateThemeButton();
});

updateThemeButton();

menuButton.addEventListener("click", () => {
  const isOpen = mainNavigation.classList.toggle("is-open");
  menuButton.textContent = isOpen ? "Fermer" : "Menu";
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute(
    "aria-label",
    isOpen ? "Fermer le menu" : "Ouvrir le menu"
  );
});

mainNavigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNavigation.classList.remove("is-open");
    menuButton.textContent = "Menu";
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Ouvrir le menu");
  });
});

const contactForm = document.querySelector("#contact-form");
const contactFormMessage = document.querySelector("#contact-form-message");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.querySelector("#contact-name").value.trim();
  const email = document.querySelector("#contact-email").value.trim();
  const subjectValue = document.querySelector("#contact-subject").value;
  const message = document.querySelector("#contact-message").value.trim();

  if (!name || !email || !message) {
    contactFormMessage.textContent = "Complète tous les champs avant de continuer.";
    return;
  }

  const subject = encodeURIComponent(`${subjectValue} - ${name}`);
  const body = encodeURIComponent(
    `Nom : ${name}\nE-mail : ${email}\n\nMessage :\n${message}`
  );

  window.location.href =
    `mailto:yanishellal26@gmail.com?subject=${subject}&body=${body}`;
  contactFormMessage.textContent = "Ouverture de ton application e-mail...";
});

function getHistory() {
  const storedHistory = localStorage.getItem(historyStorageKey);

  if (!storedHistory) {
    return [];
  }

  try {
    const history = JSON.parse(storedHistory);
    return Array.isArray(history) ? history : [];
  } catch {
    console.error("Impossible de lire l'historique enregistré.");
    return [];
  }
}

function displayHistory() {
  const history = getHistory();
  historyList.innerHTML = "";
  historyEmpty.hidden = history.length > 0;

  history.forEach((calculation) => {
    const item = document.createElement("div");
    item.className = "history-item";
    item.innerHTML = `
      <div>
        <p><strong>${calculation.name}</strong></p>
        <small>${calculation.date}</small>
      </div>
      <strong>${calculation.result}</strong>
    `;
    historyList.appendChild(item);
  });
}

clearHistoryButton.addEventListener("click", () => {
  localStorage.removeItem(historyStorageKey);
  displayHistory();
});

exportHistoryButton.addEventListener("click", () => {
  const history = getHistory();

  if (history.length === 0) {
    historyEmpty.textContent = "Aucun calcul à exporter pour le moment.";
    return;
  }

  const content = history
    .map((calculation) => `${calculation.date} - ${calculation.name} : ${calculation.result}`)
    .join("\n");
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "minecalc-historique.txt";
  link.click();
  URL.revokeObjectURL(url);
});

displayHistory();