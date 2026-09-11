const tonnageForm = document.querySelector("#tonnage-form");
const resetButton = document.querySelector("#reset-button");
const resultValue = document.querySelector("#result-value");
const volumeValue = document.querySelector("#volume-value");
const formMessage = document.querySelector("#form-message");
const historyStorageKey = "minecalc-history";
const favoritesStorageKey = "minecalc-favorites";
const notesStorageKey = "minecalc-notes";
const profileStorageKey = "minecalc-profile";
const historyList = document.querySelector("#history-list");
const historyEmpty = document.querySelector("#history-empty");
const clearHistoryButton = document.querySelector("#clear-history-button");
const exportHistoryButton = document.querySelector("#export-history-button");
const printHistoryButton = document.querySelector("#print-history-button");
const themeButton = document.querySelector("#theme-button");
const themeStorageKey = "minecalc-theme";
const menuButton = document.querySelector("#menu-button");
const mainNavigation = document.querySelector("#main-navigation");

function updateThemeButton() {
  const isDarkMode = document.body.classList.contains("dark-mode");
  themeButton.textContent = isDarkMode ? "Mode clair" : "Mode sombre";
  themeButton.setAttribute(
    "aria-label",
    isDarkMode ? "Activer le mode clair" : "Activer le mode sombre"
  );
}

try {
  if (localStorage.getItem(themeStorageKey) === "dark") {
    document.body.classList.add("dark-mode");
  }
} catch {
  console.warn("La préférence de thème ne peut pas être lue.");
}

updateThemeButton();
themeButton.addEventListener("click", () => {
  const isDarkMode = document.body.classList.toggle("dark-mode");

  try {
    localStorage.setItem(themeStorageKey, isDarkMode ? "dark" : "light");
  } catch {
    console.warn("La préférence de thème ne peut pas être enregistrée.");
  }

  updateThemeButton();
});

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

function bindSimpleCalculation(formId, inputIds, resultId, messageId, calculation, historyName, unit) {
  const form = document.querySelector(formId);
  const result = document.querySelector(resultId);
  const message = document.querySelector(messageId);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const values = inputIds.map((id) => Number(document.querySelector(id).value));

    if (values.some((value) => !Number.isFinite(value) || value <= 0)) {
      message.textContent = "Toutes les valeurs doivent être supérieures à zéro.";
      return;
    }

    const calculated = calculation(...values);
    result.textContent = `${formatNumber(calculated)} ${unit}`;
    message.textContent = "";
    saveCalculation(historyName, `${formatNumber(calculated)} ${unit}`);
  });
}

bindSimpleCalculation(
  "#blast-form",
  ["#blast-burden", "#blast-spacing", "#blast-height"],
  "#blast-result",
  "#blast-message",
  (burden, spacing, height) => burden * spacing * height,
  "Volume abattu",
  "m³"
);

bindSimpleCalculation(
  "#cycle-form",
  ["#cycle-loading", "#cycle-haul", "#cycle-dump", "#cycle-return"],
  "#cycle-result",
  "#cycle-message",
  (loading, haul, dump, returnTime) => {
    const cycle = loading + haul + dump + returnTime;
    document.querySelector("#cycle-hour-result").textContent = `${formatNumber(60 / cycle)} /h`;
    return cycle;
  },
  "Temps de cycle",
  "min"
);

bindSimpleCalculation(
  "#revenue-form",
  ["#revenue-tonnage", "#revenue-price"],
  "#revenue-result",
  "#revenue-message",
  (tonnage, price) => tonnage * price,
  "Revenu brut",
  "DA"
);

bindSimpleCalculation(
  "#air-form",
  ["#air-area", "#air-speed"],
  "#air-result",
  "#air-message",
  (area, speed) => area * speed,
  "Débit d'air",
  "m³/s"
);

bindSimpleCalculation(
  "#powder-form",
  ["#powder-mass", "#powder-volume"],
  "#powder-result",
  "#powder-message",
  (mass, volume) => mass / volume,
  "Charge spécifique",
  "kg/m³"
);

const slopeForm = document.querySelector("#slope-form");
const slopeResult = document.querySelector("#slope-result");
const slopePercentResult = document.querySelector("#slope-percent-result");
const slopeMessage = document.querySelector("#slope-message");

slopeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const height = Number(document.querySelector("#slope-height").value);
  const horizontal = Number(document.querySelector("#slope-horizontal").value);

  if (
    !Number.isFinite(height) ||
    !Number.isFinite(horizontal) ||
    height <= 0 ||
    horizontal <= 0
  ) {
    slopeMessage.textContent =
      "La hauteur et la distance horizontale doivent être supérieures à zéro.";
    return;
  }

  const angle = Math.atan(height / horizontal) * (180 / Math.PI);
  const percentage = (height / horizontal) * 100;

  slopeResult.textContent = `${formatNumber(angle)} °`;
  slopePercentResult.textContent = `${formatNumber(percentage)} %`;
  slopeMessage.textContent = "";
  saveCalculation("Angle de pente", `${formatNumber(angle)} °`);
});

bindSimpleCalculation(
  "#contained-form",
  ["#contained-tonnage", "#contained-grade"],
  "#contained-result",
  "#contained-message",
  (tonnage, grade) => tonnage * grade / 100,
  "Métal contenu",
  "t"
);

bindSimpleCalculation(
  "#holes-form",
  ["#holes-length", "#holes-width", "#holes-spacing"],
  "#holes-result",
  "#holes-message",
  (length, width, spacing) => Math.ceil((length * width) / spacing),
  "Trous de forage",
  "trous"
);

bindSimpleCalculation(
  "#fleet-form",
  ["#fleet-trucks", "#fleet-capacity", "#fleet-cycle"],
  "#fleet-result",
  "#fleet-message",
  (trucks, capacity, cycle) => trucks * capacity * 60 / cycle,
  "Capacité de la flotte",
  "t/h"
);

const breakevenForm = document.querySelector("#breakeven-form");
const breakevenResult = document.querySelector("#breakeven-result");
const breakevenMessage = document.querySelector("#breakeven-message");

breakevenForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const fixedCost = Number(document.querySelector("#breakeven-fixed").value);
  const price = Number(document.querySelector("#breakeven-price").value);
  const variableCost = Number(document.querySelector("#breakeven-variable").value);
  const margin = price - variableCost;

  if (
    !Number.isFinite(fixedCost) ||
    !Number.isFinite(price) ||
    !Number.isFinite(variableCost) ||
    fixedCost < 0 ||
    price <= 0 ||
    variableCost < 0 ||
    margin <= 0
  ) {
    breakevenMessage.textContent =
      "Le prix doit être supérieur au coût variable pour calculer un seuil.";
    return;
  }

  const quantity = fixedCost / margin;
  breakevenResult.textContent = `${formatNumber(quantity)} t`;
  breakevenMessage.textContent = "";
  saveCalculation("Seuil de rentabilité", `${formatNumber(quantity)} t`);
});

const dryTonnageForm = document.querySelector("#dry-tonnage-form");
const dryTonnageResult = document.querySelector("#dry-tonnage-result");
const waterTonnageResult = document.querySelector("#water-tonnage-result");
const dryTonnageMessage = document.querySelector("#dry-tonnage-message");

dryTonnageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const wetTonnage = Number(document.querySelector("#wet-tonnage").value);
  const moistureRate = Number(document.querySelector("#moisture-rate").value);

  if (
    !Number.isFinite(wetTonnage) ||
    !Number.isFinite(moistureRate) ||
    wetTonnage <= 0 ||
    moistureRate < 0 ||
    moistureRate > 100
  ) {
    dryTonnageMessage.textContent =
      "Le tonnage doit être supérieur à zéro et l'humidité comprise entre 0 et 100 %.";
    return;
  }

  const dryTonnage = wetTonnage / (1 + moistureRate / 100);
  const waterTonnage = wetTonnage - dryTonnage;

  dryTonnageResult.textContent = `${formatNumber(dryTonnage)} t`;
  waterTonnageResult.textContent = `${formatNumber(waterTonnage)} t`;
  dryTonnageMessage.textContent = "";
  saveCalculation("Tonnage sec", `${formatNumber(dryTonnage)} t`);
});

const yieldForm = document.querySelector("#yield-form");
const yieldResult = document.querySelector("#yield-result");
const yieldLossResult = document.querySelector("#yield-loss-result");
const yieldMessage = document.querySelector("#yield-message");

yieldForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const feed = Number(document.querySelector("#yield-feed").value);
  const product = Number(document.querySelector("#yield-product").value);

  if (
    !Number.isFinite(feed) ||
    !Number.isFinite(product) ||
    feed <= 0 ||
    product < 0 ||
    product > feed
  ) {
    yieldMessage.textContent =
      "Le produit doit être positif ou nul et ne peut pas dépasser l'alimentation.";
    return;
  }

  const massYield = (product / feed) * 100;
  const apparentLoss = 100 - massYield;

  yieldResult.textContent = `${formatNumber(massYield)} %`;
  yieldLossResult.textContent = `${formatNumber(apparentLoss)} %`;
  yieldMessage.textContent = "";
  saveCalculation("Rendement massique", `${formatNumber(massYield)} %`);
});

const concentrateForm = document.querySelector("#concentrate-form");
const concentrateResult = document.querySelector("#concentrate-result");
const concentrateMessage = document.querySelector("#concentrate-message");

concentrateForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const recoveredMetal = Number(document.querySelector("#concentrate-metal").value);
  const concentrateMass = Number(document.querySelector("#concentrate-mass").value);

  if (
    !Number.isFinite(recoveredMetal) ||
    !Number.isFinite(concentrateMass) ||
    recoveredMetal < 0 ||
    concentrateMass <= 0 ||
    recoveredMetal > concentrateMass
  ) {
    concentrateMessage.textContent =
      "Le métal récupéré doit être positif ou nul et inférieur à la masse du concentré.";
    return;
  }

  const concentrateGrade = (recoveredMetal / concentrateMass) * 100;

  concentrateResult.textContent = `${formatNumber(concentrateGrade)} %`;
  concentrateMessage.textContent = "";
  saveCalculation("Teneur du concentré", `${formatNumber(concentrateGrade)} %`);
});

const cutoffForm = document.querySelector("#cutoff-form");
const cutoffResult = document.querySelector("#cutoff-result");
const cutoffMessage = document.querySelector("#cutoff-message");

cutoffForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const cost = Number(document.querySelector("#cutoff-cost").value);
  const metalValue = Number(document.querySelector("#cutoff-price").value);
  const recovery = Number(document.querySelector("#cutoff-recovery").value);

  if (
    !Number.isFinite(cost) ||
    !Number.isFinite(metalValue) ||
    !Number.isFinite(recovery) ||
    cost <= 0 ||
    metalValue <= 0 ||
    recovery <= 0 ||
    recovery > 100
  ) {
    cutoffMessage.textContent =
      "Les coûts et la valeur doivent être positifs, avec une récupération entre 0 et 100 %.";
    return;
  }

  const cutoffGrade = (cost / (metalValue * (recovery / 100))) * 100;

  cutoffResult.textContent = `${formatNumber(cutoffGrade)} %`;
  cutoffMessage.textContent = "";
  saveCalculation("Teneur de coupure", `${formatNumber(cutoffGrade)} %`);
});

const swellFactorForm = document.querySelector("#swell-factor-form");
const swellFactorResult = document.querySelector("#swell-factor-result");
const swellFactorMessage = document.querySelector("#swell-factor-message");

swellFactorForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const looseVolume = Number(document.querySelector("#swell-loose-volume").value);
  const bankVolume = Number(document.querySelector("#swell-bank-volume").value);

  if (
    !Number.isFinite(looseVolume) ||
    !Number.isFinite(bankVolume) ||
    looseVolume <= 0 ||
    bankVolume <= 0 ||
    looseVolume < bankVolume
  ) {
    swellFactorMessage.textContent =
      "Le volume foisonné doit être supérieur ou égal au volume en place.";
    return;
  }

  const swellFactor = ((looseVolume - bankVolume) / bankVolume) * 100;
  swellFactorResult.textContent = `${formatNumber(swellFactor)} %`;
  swellFactorMessage.textContent = "";
  saveCalculation("Facteur de foisonnement", `${formatNumber(swellFactor)} %`);
});

const looseVolumeForm = document.querySelector("#loose-volume-form");
const looseVolumeResult = document.querySelector("#loose-volume-result");
const looseVolumeIncrease = document.querySelector("#loose-volume-increase");
const looseVolumeMessage = document.querySelector("#loose-volume-message");

looseVolumeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const bankVolume = Number(document.querySelector("#loose-bank-volume").value);
  const swellRate = Number(document.querySelector("#loose-swell-rate").value);

  if (
    !Number.isFinite(bankVolume) ||
    !Number.isFinite(swellRate) ||
    bankVolume <= 0 ||
    swellRate < 0
  ) {
    looseVolumeMessage.textContent =
      "Le volume doit être supérieur à zéro et le foisonnement positif ou nul.";
    return;
  }

  const looseVolume = bankVolume * (1 + swellRate / 100);
  const increase = looseVolume - bankVolume;
  looseVolumeResult.textContent = `${formatNumber(looseVolume)} m³`;
  looseVolumeIncrease.textContent = `${formatNumber(increase)} m³`;
  looseVolumeMessage.textContent = "";
  saveCalculation("Volume foisonné", `${formatNumber(looseVolume)} m³`);
});

bindSimpleCalculation(
  "#bulk-density-form",
  ["#bulk-density-mass", "#bulk-density-volume"],
  "#bulk-density-result",
  "#bulk-density-message",
  (mass, volume) => mass / volume,
  "Densité apparente",
  "t/m³"
);

const bucketCountForm = document.querySelector("#bucket-count-form");
const bucketCountResult = document.querySelector("#bucket-count-result");
const bucketCountLoad = document.querySelector("#bucket-count-load");
const bucketCountMessage = document.querySelector("#bucket-count-message");

bucketCountForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const truckCapacity = Number(document.querySelector("#bucket-count-truck").value);
  const bucketVolume = Number(document.querySelector("#bucket-count-volume").value);
  const fillRate = Number(document.querySelector("#bucket-count-fill").value);
  const density = Number(document.querySelector("#bucket-count-density").value);

  if (
    !Number.isFinite(truckCapacity) ||
    !Number.isFinite(bucketVolume) ||
    !Number.isFinite(fillRate) ||
    !Number.isFinite(density) ||
    truckCapacity <= 0 ||
    bucketVolume <= 0 ||
    fillRate <= 0 ||
    fillRate > 100 ||
    density <= 0
  ) {
    bucketCountMessage.textContent =
      "Vérifie la capacité, le volume, le taux de remplissage et la densité.";
    return;
  }

  const loadPerBucket = bucketVolume * (fillRate / 100) * density;
  const bucketCount = Math.ceil(truckCapacity / loadPerBucket);
  bucketCountResult.textContent = `${formatNumber(bucketCount)} godets`;
  bucketCountLoad.textContent = `${formatNumber(loadPerBucket)} t`;
  bucketCountMessage.textContent = "";
  saveCalculation("Nombre de godets", `${formatNumber(bucketCount)} godets`);
});

const loadingDurationForm = document.querySelector("#loading-duration-form");
const loadingDurationResult = document.querySelector("#loading-duration-result");
const loadingDurationBuckets = document.querySelector("#loading-duration-buckets");
const loadingDurationMessage = document.querySelector("#loading-duration-message");

loadingDurationForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const targetTonnage = Number(document.querySelector("#loading-duration-target").value);
  const loadPerBucket = Number(document.querySelector("#loading-duration-bucket").value);
  const cycleTime = Number(document.querySelector("#loading-duration-cycle").value);

  if (
    !Number.isFinite(targetTonnage) ||
    !Number.isFinite(loadPerBucket) ||
    !Number.isFinite(cycleTime) ||
    targetTonnage <= 0 ||
    loadPerBucket <= 0 ||
    cycleTime <= 0
  ) {
    loadingDurationMessage.textContent =
      "Toutes les valeurs doivent être supérieures à zéro.";
    return;
  }

  const bucketCount = Math.ceil(targetTonnage / loadPerBucket);
  const duration = (bucketCount * cycleTime) / 60;
  loadingDurationResult.textContent = `${formatNumber(duration)} min`;
  loadingDurationBuckets.textContent = formatNumber(bucketCount);
  loadingDurationMessage.textContent = "";
  saveCalculation("Durée de chargement", `${formatNumber(duration)} min`);
});

const haulDistanceForm = document.querySelector("#haul-distance-form");
const haulDistanceResult = document.querySelector("#haul-distance-result");
const haulDistanceTotal = document.querySelector("#haul-distance-total");
const haulDistanceMessage = document.querySelector("#haul-distance-message");

haulDistanceForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const shortDistance = Number(document.querySelector("#haul-distance-short").value);
  const shortTonnage = Number(document.querySelector("#haul-distance-short-tonnage").value);
  const longDistance = Number(document.querySelector("#haul-distance-long").value);
  const longTonnage = Number(document.querySelector("#haul-distance-long-tonnage").value);

  if (
    !Number.isFinite(shortDistance) ||
    !Number.isFinite(shortTonnage) ||
    !Number.isFinite(longDistance) ||
    !Number.isFinite(longTonnage) ||
    shortDistance < 0 ||
    longDistance < 0 ||
    shortTonnage <= 0 ||
    longTonnage <= 0
  ) {
    haulDistanceMessage.textContent =
      "Les distances doivent être positives ou nulles et les tonnages supérieurs à zéro.";
    return;
  }

  const totalTonnage = shortTonnage + longTonnage;
  const averageDistance =
    (shortDistance * shortTonnage + longDistance * longTonnage) / totalTonnage;
  haulDistanceResult.textContent = `${formatNumber(averageDistance)} m`;
  haulDistanceTotal.textContent = `${formatNumber(totalTonnage)} t`;
  haulDistanceMessage.textContent = "";
  saveCalculation("Distance moyenne", `${formatNumber(averageDistance)} m`);
});

bindSimpleCalculation(
  "#total-air-form",
  ["#total-air-galleries", "#total-air-flow"],
  "#total-air-result",
  "#total-air-message",
  (galleries, flow) => galleries * flow,
  "Ventilation totale",
  "m³/s"
);

const powerForm = document.querySelector("#power-form");
const powerResult = document.querySelector("#power-result");
const powerEnergyResult = document.querySelector("#power-energy-result");
const powerMessage = document.querySelector("#power-message");

powerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const load = Number(document.querySelector("#power-load").value);
  const height = Number(document.querySelector("#power-height").value);
  const time = Number(document.querySelector("#power-time").value);
  const efficiency = Number(document.querySelector("#power-efficiency").value);

  if (
    !Number.isFinite(load) ||
    !Number.isFinite(height) ||
    !Number.isFinite(time) ||
    !Number.isFinite(efficiency) ||
    load <= 0 ||
    height <= 0 ||
    time <= 0 ||
    efficiency <= 0 ||
    efficiency > 100
  ) {
    powerMessage.textContent =
      "Les charges, le dénivelé et le temps doivent être positifs, avec un rendement entre 0 et 100 %.";
    return;
  }

  const energy = load * 9.81 * height / 1000;
  const power = energy / time / (efficiency / 100);
  powerResult.textContent = `${formatNumber(power)} kW`;
  powerEnergyResult.textContent = `${formatNumber(energy)} kJ`;
  powerMessage.textContent = "";
  saveCalculation("Puissance mécanique", `${formatNumber(power)} kW`);
});

const recoveredGradeForm = document.querySelector("#recovered-grade-form");
const recoveredGradeResult = document.querySelector("#recovered-grade-result");
const recoveredGradePercent = document.querySelector("#recovered-grade-percent");
const recoveredGradeMessage = document.querySelector("#recovered-grade-message");

recoveredGradeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const tonnage = Number(document.querySelector("#recovered-grade-tonnage").value);
  const grade = Number(document.querySelector("#recovered-grade-grade").value);
  const recovery = Number(document.querySelector("#recovered-grade-recovery").value);

  if (
    !Number.isFinite(tonnage) ||
    !Number.isFinite(grade) ||
    !Number.isFinite(recovery) ||
    tonnage <= 0 ||
    grade < 0 ||
    grade > 100 ||
    recovery < 0 ||
    recovery > 100
  ) {
    recoveredGradeMessage.textContent =
      "Le tonnage doit être positif et les pourcentages compris entre 0 et 100.";
    return;
  }

  const containedMetal = tonnage * grade / 100;
  const recoveredMetal = containedMetal * recovery / 100;
  const recoveredPercent = grade * recovery / 100;
  recoveredGradeResult.textContent = `${formatNumber(recoveredMetal)} t`;
  recoveredGradePercent.textContent = `${formatNumber(recoveredPercent)} %`;
  recoveredGradeMessage.textContent = "";
  saveCalculation("Métal récupéré après traitement", `${formatNumber(recoveredMetal)} t`);
});

bindSimpleCalculation(
  "#haul-speed-form",
  ["#haul-speed-distance", "#haul-speed-time"],
  "#haul-speed-result",
  "#haul-speed-message",
  (distance, time) => distance / (time / 60),
  "Vitesse moyenne",
  "km/h"
);

const availabilityForm = document.querySelector("#availability-form");
const availabilityResult = document.querySelector("#availability-result");
const availabilityOperating = document.querySelector("#availability-operating");
const availabilityMessage = document.querySelector("#availability-message");

availabilityForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const plannedTime = Number(document.querySelector("#availability-planned").value);
  const breakdownTime = Number(document.querySelector("#availability-breakdown").value);

  if (
    !Number.isFinite(plannedTime) ||
    !Number.isFinite(breakdownTime) ||
    plannedTime <= 0 ||
    breakdownTime < 0 ||
    breakdownTime > plannedTime
  ) {
    availabilityMessage.textContent =
      "Le temps de panne doit être compris entre zéro et le temps programmé.";
    return;
  }

  const operatingTime = plannedTime - breakdownTime;
  const availability = (operatingTime / plannedTime) * 100;
  availabilityResult.textContent = `${formatNumber(availability)} %`;
  availabilityOperating.textContent = `${formatNumber(operatingTime)} h`;
  availabilityMessage.textContent = "";
  saveCalculation("Disponibilité mécanique", `${formatNumber(availability)} %`);
});

const utilizationForm = document.querySelector("#utilization-form");
const utilizationResult = document.querySelector("#utilization-result");
const utilizationMessage = document.querySelector("#utilization-message");

utilizationForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const operatingTime = Number(document.querySelector("#utilization-operating").value);
  const availableTime = Number(document.querySelector("#utilization-available").value);

  if (
    !Number.isFinite(operatingTime) ||
    !Number.isFinite(availableTime) ||
    operatingTime < 0 ||
    availableTime <= 0 ||
    operatingTime > availableTime
  ) {
    utilizationMessage.textContent =
      "Le temps de fonctionnement doit être compris entre zéro et le temps disponible.";
    return;
  }

  const utilization = (operatingTime / availableTime) * 100;
  utilizationResult.textContent = `${formatNumber(utilization)} %`;
  utilizationMessage.textContent = "";
  saveCalculation("Taux d'utilisation", `${formatNumber(utilization)} %`);
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
const converterSection = conversionCategory.closest(".tool-section");
const calculatorContainer = document.querySelector("#calculateurs .container");

calculatorContainer.appendChild(converterSection);

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
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
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
  const favorites = getFavorites();
  const notes = getNotes();
  historyList.innerHTML = "";
  historyEmpty.hidden = history.length > 0;

  history.forEach((calculation) => {
    const historyId = calculation.id || `${calculation.name}-${calculation.date}`;
    const item = document.createElement("div");
    item.className = "history-item";
    item.innerHTML = `
      <div>
        <p><strong>${calculation.name}</strong></p>
        <small>${calculation.date}</small>
        ${notes[historyId] ? `<small class="history-note-text">${notes[historyId]}</small>` : ""}
      </div>
      <div class="history-result">
        <strong>${calculation.result}</strong>
        <button class="history-note-button" type="button" data-history-id="${historyId}">Note</button>
        <button class="favorite-button${favorites.includes(historyId) ? " is-favorite" : ""}" type="button" data-history-id="${historyId}" aria-label="${favorites.includes(historyId) ? "Retirer des favoris" : "Ajouter aux favoris"}">
          ${favorites.includes(historyId) ? "★" : "☆"}
        </button>
      </div>
    `;
    historyList.appendChild(item);
  });

  renderHistoryChart(history);
  updateDashboard();
}

function getFavorites() {
  const storedFavorites = localStorage.getItem(favoritesStorageKey);

  if (!storedFavorites) {
    return [];
  }

  try {
    const favorites = JSON.parse(storedFavorites);
    return Array.isArray(favorites) ? favorites : [];
  } catch {
    return [];
  }
}

function getNotes() {
  const storedNotes = localStorage.getItem(notesStorageKey);

  if (!storedNotes) {
    return {};
  }

  try {
    const notes = JSON.parse(storedNotes);
    return notes && typeof notes === "object" ? notes : {};
  } catch {
    return {};
  }
}

function renderHistoryChart(history) {
  const chart = document.querySelector("#history-chart");
  const counts = {};

  history.forEach((calculation) => {
    counts[calculation.name] = (counts[calculation.name] || 0) + 1;
  });

  chart.innerHTML = "";

  if (Object.keys(counts).length === 0) {
    chart.innerHTML = '<p class="chart-empty">Les résultats apparaîtront ici après ton premier calcul.</p>';
    return;
  }

  const maxCount = Math.max(...Object.values(counts));

  Object.entries(counts).forEach(([name, count]) => {
    const group = document.createElement("div");
    group.className = "chart-bar-group";
    group.innerHTML = `
      <span class="chart-bar-value">${count}</span>
      <div class="chart-bar" style="height: ${Math.max(12, (count / maxCount) * 130)}px"></div>
      <span class="chart-bar-label">${name}</span>
    `;
    chart.appendChild(group);
  });
}

historyList.addEventListener("click", (event) => {
  const noteButton = event.target.closest(".history-note-button");

  if (noteButton) {
    const historyId = noteButton.dataset.historyId;
    const notes = getNotes();
    const currentNote = notes[historyId] || "";
    const note = window.prompt("Ajoute une note à ce résultat :", currentNote);

    if (note !== null) {
      if (note.trim()) {
        notes[historyId] = note.trim();
      } else {
        delete notes[historyId];
      }
      localStorage.setItem(notesStorageKey, JSON.stringify(notes));
      displayHistory();
    }
    return;
  }

  const button = event.target.closest(".favorite-button");

  if (!button) {
    return;
  }

  const historyId = button.dataset.historyId;
  const favorites = getFavorites();
  const index = favorites.indexOf(historyId);

  if (index >= 0) {
    favorites.splice(index, 1);
  } else {
    favorites.push(historyId);
  }

  localStorage.setItem(favoritesStorageKey, JSON.stringify(favorites));
  displayHistory();
});

function updateDashboard() {
  const history = getHistory();
  const favorites = getFavorites();
  const totalElement = document.querySelector("#dashboard-total");
  const favoritesElement = document.querySelector("#dashboard-favorites");
  const lastElement = document.querySelector("#dashboard-last");
  const lastDateElement = document.querySelector("#dashboard-last-date");
  const toolsElement = document.querySelector("#dashboard-tools");
  const progressElement = document.querySelector("#dashboard-progress");
  const toolCount = new Set(history.map((item) => item.name)).size;

  totalElement.textContent = history.length;
  favoritesElement.textContent = favorites.length;
  lastElement.textContent = history.length ? history[0].name : "--";
  lastDateElement.textContent = history.length ? history[0].date : "Aucune activité";
  toolsElement.textContent = toolCount;
  progressElement.textContent = `${Math.round((toolCount / 35) * 100)}%`;
}

const profileForm = document.querySelector("#profile-form");
const profileName = document.querySelector("#profile-name");
const profileLevel = document.querySelector("#profile-level");
const profileMessage = document.querySelector("#profile-message");
const profileGreeting = document.querySelector("#profile-greeting");
const profileSummary = document.querySelector("#profile-summary");

function updateProfile() {
  let profile;

  try {
    profile = JSON.parse(localStorage.getItem(profileStorageKey) || "null");
  } catch {
    profile = null;
  }

  if (!profile || !profile.name) {
    return;
  }

  profileName.value = profile.name;
  profileLevel.value = profile.level || "Débutant";
  profileGreeting.textContent = `Bonjour ${profile.name} !`;
  profileSummary.textContent = `Niveau : ${profile.level || "Débutant"}. Continue ta révision à ton rythme.`;
}

profileForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = profileName.value.trim();
  const level = profileLevel.value;

  if (!name) {
    profileMessage.textContent = "Indique un prénom ou un pseudonyme.";
    return;
  }

  localStorage.setItem(profileStorageKey, JSON.stringify({ name, level }));
  profileMessage.textContent = "Profil enregistré sur cet appareil.";
  updateProfile();
});

const exportDataButton = document.querySelector("#export-data-button");
const importDataInput = document.querySelector("#import-data-input");

exportDataButton.addEventListener("click", () => {
  const data = {
    history: getHistory(),
    favorites: getFavorites(),
    notes: getNotes(),
    profile: JSON.parse(localStorage.getItem(profileStorageKey) || "null"),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "minecalc-donnees.json";
  link.click();
  URL.revokeObjectURL(url);
});

importDataInput.addEventListener("change", async () => {
  const file = importDataInput.files[0];

  if (!file) {
    return;
  }

  try {
    const data = JSON.parse(await file.text());
    if (!Array.isArray(data.history) || !Array.isArray(data.favorites)) {
      throw new Error("Format invalide");
    }
    localStorage.setItem(historyStorageKey, JSON.stringify(data.history.slice(0, 10)));
    localStorage.setItem(favoritesStorageKey, JSON.stringify(data.favorites));
    localStorage.setItem(notesStorageKey, JSON.stringify(data.notes || {}));
    if (data.profile) {
      localStorage.setItem(profileStorageKey, JSON.stringify(data.profile));
    }
    updateProfile();
    displayHistory();
  } catch {
    profileMessage.textContent = "Le fichier sélectionné n'est pas une sauvegarde MineCalc valide.";
  } finally {
    importDataInput.value = "";
  }
});

updateProfile();

document.querySelectorAll(".example-button").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.example === "tonnage") {
      document.querySelector("#length").value = 20;
      document.querySelector("#width").value = 10;
      document.querySelector("#height").value = 5;
      document.querySelector("#density").value = 2.7;
      document.querySelector("#tonnage-form").scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  const calculatorExamples = {
    "#grade-form": {
      ".block-tonnage": ["1000"],
      ".block-grade": ["2.5"]
    },
    "#recovery-form": {
      "#recovery-tonnage": "1000",
      "#recovery-grade": "3",
      "#recovery-rate": "85"
    },
    "#stripping-form": {
      "#waste-tonnage": "3000",
      "#ore-tonnage": "1000"
    },
    "#productivity-form": {
      "#production-quantity": "800",
      "#working-time": "8"
    },
    "#dilution-form": {
      "#dilution-ore-tonnage": "1000",
      "#dilution-ore-grade": "3",
      "#dilution-waste-tonnage": "200"
    },
    "#cost-form": {
      "#cost-total": "250000",
      "#cost-production": "5000"
    },
    "#loader-form": {
      "#bucket-volume": "2.5",
      "#bucket-fill": "85",
      "#bucket-cycles": "20",
      "#bucket-density": "1.8"
    }
  };

  Object.entries(calculatorExamples).forEach(([formSelector, values]) => {
    const form = document.querySelector(formSelector);
    const button = document.createElement("button");
    button.className = "example-button";
    button.type = "button";
    button.textContent = "Exemple";
    form.prepend(button);
    button.addEventListener("click", () => {
      Object.entries(values).forEach(([selector, value]) => {
        if (Array.isArray(value)) {
          document.querySelectorAll(selector).forEach((input, index) => {
            input.value = value[index] || value[0];
          });
        } else {
          document.querySelector(selector).value = value;
        }
      });
    });
  });

  const contentSearchInput = document.querySelector("#content-search-input");
  const contentSearchStatus = document.querySelector("#content-search-status");
  const searchableContent = document.querySelectorAll(
    ".formula-card, .faq-list details"
  );

  contentSearchInput.addEventListener("input", () => {
    const query = contentSearchInput.value.trim().toLocaleLowerCase("fr-FR");
    let visibleCount = 0;

    searchableContent.forEach((item) => {
      const matches = !query || item.textContent.toLocaleLowerCase("fr-FR").includes(query);
      item.hidden = !matches;
      if (matches) {
        visibleCount += 1;
      }
    });

    contentSearchStatus.textContent = query
      ? `${visibleCount} résultat${visibleCount > 1 ? "s" : ""} trouvé${visibleCount > 1 ? "s" : ""}.`
      : "";
  });
});

clearHistoryButton.addEventListener("click", () => {
  localStorage.removeItem(historyStorageKey);
  displayHistory();
});

printHistoryButton.addEventListener("click", () => {
  window.print();
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