const OCTO_TOTAL_ROLLS = 10;
const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19];
const RADICES = [41, 21, 11, 11, 11, 11, 11, 11];
const POWERS_OF_20 = Array.from({ length: OCTO_TOTAL_ROLLS + 1 }, (_, index) => 20 ** index);
const FACE_EXPONENTS = Array.from({ length: 20 }, (_, index) => primeExponentsForRoll(index + 1));
const SUM_TABLES = precomputeSumTables();
const ODD_TABLES = precomputeOddTables();
const OCTO_SAMPLE_ROLLS = {
  A: [18, 4, 11, 17, null, null, null, null, null, null],
  B: [9, 19, 3, 14, null, null, null, null, null, null],
};

const OCTO_RESULT_GROUPS = [
  {
    title: "Winner",
    symbols: [{ key: "winA", label: "WIN A" }, { key: "winB", label: "WIN B" }],
  },
  {
    title: "Odd Count",
    symbols: [{ key: "oddA", label: "ODD A" }, { key: "oddB", label: "ODD B" }],
  },
  {
    title: "Divisors",
    symbols: [{ key: "divA", label: "DIV A" }, { key: "divB", label: "DIV B" }],
  },
  {
    title: "Spread",
    symbols: [{ key: "spreadS", label: "SPREAD S" }, { key: "spreadL", label: "SPREAD L" }],
  },
];

const TRIPLETS_TOTAL_ROLLS = 9;
const TRIPLETS_FACE_COUNT = 5;
const TRIPLETS_VALUE_COUNT = 10;
const TRIPLETS_PRIOR_DENOMINATOR = TRIPLETS_VALUE_COUNT ** TRIPLETS_FACE_COUNT;
const FACTORIALS = [1, 1, 2, 6, 24, 120];
const TRIPLETS_ASSIGNMENT_CONFIG = {
  A: {
    eventLabel: "A",
    comboTarget: "2A",
    comboFormula: "AB + AC - BC = 2A",
    comboExpression: "AB + AC - BC",
    cheapLegs: "+AB  +AC  -BC",
    richLegs: "-AB  -AC  +BC",
    legs: [
      { symbol: "AB", sign: 1 },
      { symbol: "AC", sign: 1 },
      { symbol: "BC", sign: -1 },
    ],
  },
  B: {
    eventLabel: "B",
    comboTarget: "2B",
    comboFormula: "AB + BC - AC = 2B",
    comboExpression: "AB + BC - AC",
    cheapLegs: "+AB  +BC  -AC",
    richLegs: "-AB  -BC  +AC",
    legs: [
      { symbol: "AB", sign: 1 },
      { symbol: "BC", sign: 1 },
      { symbol: "AC", sign: -1 },
    ],
  },
  C: {
    eventLabel: "C",
    comboTarget: "2C",
    comboFormula: "AC + BC - AB = 2C",
    comboExpression: "AC + BC - AB",
    cheapLegs: "+AC  +BC  -AB",
    richLegs: "-AC  -BC  +AB",
    legs: [
      { symbol: "AC", sign: 1 },
      { symbol: "BC", sign: 1 },
      { symbol: "AB", sign: -1 },
    ],
  },
};
const TRIPLETS_SAMPLE = {
  assignment: "A",
  rolls: [7, 9, 4, 6, null, null, null, null, null],
  quotes: {
    AB: { bid: 103, ask: 105 },
    BC: { bid: 98, ask: 100 },
    AC: { bid: 106, ask: 108 },
  },
};
const TRIPLETS_LIKELIHOOD_POWERS = Array.from({ length: TRIPLETS_FACE_COUNT + 1 }, (_, faceCount) =>
  Array.from({ length: TRIPLETS_TOTAL_ROLLS + 1 }, (_, observedCount) => {
    if (observedCount === 0) {
      return 1;
    }
    if (faceCount === 0) {
      return 0;
    }
    return (faceCount / TRIPLETS_FACE_COUNT) ** observedCount;
  })
);
const TRIPLETS_STATES = precomputeTripletsStates();
const TRIPLETS_PRIOR_EVENT = computeTripletsPosteriorFromCounts(
  Array(TRIPLETS_VALUE_COUNT).fill(0),
  0,
  0
);
const AUCTION_TOTAL_ROUNDS = 20;
const AUCTION_MAX_BID = 100000000;
const AUCTION_PHI_EXPONENT = Math.log(Math.PI);
const AUCTION_LOOKUP_VALUES = [1, 2, 3, 5, 8, 10, 15, 20, 30, 40, 50, 75, 100, 150, 200, 300, 400, 500, 750, 1000];
const AUCTION_SAMPLE_POINT_VALUE = 4.3;
const AUCTION_SAMPLE_BIDS = [
  18000,
  23000,
  0,
  15000,
  42000,
  38000,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
];
const AUCTION_LOOKUP_ROWS = AUCTION_LOOKUP_VALUES.map((totalBid) => {
  return {
    totalBid,
    penalty: computeAuctionPenalty(totalBid),
  };
});
const INTEGER_FORMATTER = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const DECIMAL_FORMATTER = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const SESSION_UNLOCK_KEY = "wqc-helper-unlocks";
const GAME_ACCESS = {
  octo: {
    title: "Game 2: Octomarket",
    shortTitle: "Octomarket",
    subtitle: "Expected values, exact payout distributions, and full-board contract math.",
    digest: "5633c9b8af6d089859afcbec42fdc03f8c407aaba9668218b433bd4959911465",
  },
  triplets: {
    title: "Game 3: Triplets",
    shortTitle: "Triplets",
    subtitle: "Posterior event values, combo pricing, and live trade guidance.",
    digest: "3cd108c9cdd7eac2a757e817d59d4513757921d99ab1f6090a15815d01f6ba25",
  },
  auction: {
    title: "Game 5: Infinite Auction",
    shortTitle: "Infinite Auction",
    subtitle: "Bid penalty tracking, round-edge analysis, and safe bid cutoffs.",
    digest: "d79987051a2552ac1895e06b97d12d8cfe5924872f61dba59c15552bcc832f9e",
  },
};
const GAME_KEYS = Object.keys(GAME_ACCESS);

const elements = {
  topbarTitle: document.getElementById("topbar-title"),
  topbarSubtitle: document.getElementById("topbar-subtitle"),
  topbarStatus: document.getElementById("topbar-status"),
  homeButton: document.getElementById("home-button"),
  viewHome: document.getElementById("view-home"),
  viewOcto: document.getElementById("view-octo"),
  viewTriplets: document.getElementById("view-triplets"),
  viewAuction: document.getElementById("view-auction"),
  homeCards: Array.from(document.querySelectorAll("[data-game-card]")),
  homeEnterButtons: Array.from(document.querySelectorAll(".home-enter-button")),
  passwordModal: document.getElementById("password-modal"),
  passwordGameLabel: document.getElementById("password-game-label"),
  passwordTitle: document.getElementById("password-title"),
  passwordDescription: document.getElementById("password-description"),
  passwordForm: document.getElementById("password-form"),
  passwordInput: document.getElementById("password-input"),
  passwordMessage: document.getElementById("password-message"),
  passwordSubmit: document.getElementById("password-submit"),
  passwordCancel: document.getElementById("password-cancel"),

  rollInputs: document.getElementById("roll-inputs"),
  validationMessage: document.getElementById("validation-message"),
  summaryGrid: document.getElementById("summary-grid"),
  resultsGroups: document.getElementById("results-groups"),
  engineStatus: document.getElementById("engine-status"),
  loadSampleButton: document.getElementById("load-sample"),
  clearBoardButton: document.getElementById("clear-board"),

  tripletsAssignment: document.getElementById("triplets-assignment"),
  tripletsRollInputs: document.getElementById("triplets-roll-inputs"),
  tripletsBidAb: document.getElementById("triplets-bid-ab"),
  tripletsAskAb: document.getElementById("triplets-ask-ab"),
  tripletsBidBc: document.getElementById("triplets-bid-bc"),
  tripletsAskBc: document.getElementById("triplets-ask-bc"),
  tripletsBidAc: document.getElementById("triplets-bid-ac"),
  tripletsAskAc: document.getElementById("triplets-ask-ac"),
  tripletsFormula: document.getElementById("triplets-formula"),
  tripletsMethod: document.getElementById("triplets-method"),
  tripletsValidation: document.getElementById("triplets-validation"),
  tripletsSummaryGrid: document.getElementById("triplets-summary-grid"),
  tripletsResults: document.getElementById("triplets-results"),
  tripletsLoadSampleButton: document.getElementById("triplets-load-sample"),
  tripletsClearBoardButton: document.getElementById("triplets-clear-board"),

  auctionPointValue: document.getElementById("auction-point-value"),
  auctionBidInputs: document.getElementById("auction-bid-inputs"),
  auctionValidation: document.getElementById("auction-validation"),
  auctionSummaryGrid: document.getElementById("auction-summary-grid"),
  auctionResults: document.getElementById("auction-results"),
  auctionMethod: document.getElementById("auction-method"),
  auctionLoadSampleButton: document.getElementById("auction-load-sample"),
  auctionClearBoardButton: document.getElementById("auction-clear-board"),
};

const octoRollInputPairs = [];
const tripletsRollInputs = [];
const auctionBidInputs = [];
const auctionBidCells = [];
const tripletsMarketInputs = [
  elements.tripletsBidAb,
  elements.tripletsAskAb,
  elements.tripletsBidBc,
  elements.tripletsAskBc,
  elements.tripletsBidAc,
  elements.tripletsAskAc,
];

const divisorDistributionCache = new Map();

let renderQueued = false;
let divisorStateTables = null;
let divisorEngineStatus = "warming";
let auctionSelectedIndex = null;
let activeView = "home";
let pendingUnlockGame = null;
let unlockedGames = loadUnlockedGames();

bootstrap();

function bootstrap() {
  bindNavigation();
  createOctoRollInputs();
  createTripletsRollInputs();
  createAuctionBidInputs();
  bindButtons();
  updateHomeCards();
  setActiveView("home");
  scheduleRender();

  const warmUp = window.requestIdleCallback
    ? (callback) => window.requestIdleCallback(callback, { timeout: 1000 })
    : (callback) => window.setTimeout(callback, 0);

  warmUp(() => {
    try {
      divisorStateTables = precomputeDivisorStateTables();
      divisorEngineStatus = "ready";
      scheduleRender();
    } catch (error) {
      divisorEngineStatus = "error";
      console.error(error);
      scheduleRender();
    }
  });
}

function bindNavigation() {
  elements.homeButton.addEventListener("click", () => setActiveView("home"));

  elements.homeEnterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      requestGameAccess(button.dataset.gameTarget);
    });
  });

  elements.passwordForm.addEventListener("submit", handlePasswordSubmit);
  elements.passwordCancel.addEventListener("click", closePasswordGate);
  elements.passwordInput.addEventListener("input", () => {
    elements.passwordInput.classList.remove("is-invalid");
    setPasswordMessage("");
  });
  elements.passwordModal.addEventListener("click", (event) => {
    if (event.target === elements.passwordModal) {
      closePasswordGate();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !elements.passwordModal.classList.contains("hidden")) {
      closePasswordGate();
    }
  });
}

function setActiveView(viewName) {
  if (viewName !== "home" && !unlockedGames[viewName]) {
    openPasswordGate(viewName);
    return;
  }

  activeView = viewName;
  const showHome = viewName === "home";
  const showOcto = viewName === "octo";
  const showTriplets = viewName === "triplets";
  const showAuction = viewName === "auction";

  elements.viewHome.classList.toggle("is-active", showHome);
  elements.viewOcto.classList.toggle("is-active", showOcto);
  elements.viewTriplets.classList.toggle("is-active", showTriplets);
  elements.viewAuction.classList.toggle("is-active", showAuction);
  elements.homeButton.classList.toggle("hidden", showHome);

  updateTopbar();
}

function requestGameAccess(gameKey) {
  if (!GAME_ACCESS[gameKey]) {
    return;
  }

  if (unlockedGames[gameKey]) {
    setActiveView(gameKey);
    return;
  }

  openPasswordGate(gameKey);
}

function openPasswordGate(gameKey) {
  const game = GAME_ACCESS[gameKey];
  if (!game) {
    return;
  }

  pendingUnlockGame = gameKey;
  elements.passwordGameLabel.textContent = game.title;
  elements.passwordTitle.textContent = `Unlock ${game.shortTitle}`;
  elements.passwordDescription.textContent = `Enter the password for ${game.title}.`;
  elements.passwordInput.value = "";
  elements.passwordInput.classList.remove("is-invalid");
  setPasswordMessage("");
  elements.passwordModal.classList.remove("hidden");
  elements.passwordModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  window.setTimeout(() => {
    elements.passwordInput.focus();
  }, 0);
}

function closePasswordGate(options = {}) {
  if (!options.force && elements.passwordSubmit.disabled) {
    return;
  }

  pendingUnlockGame = null;
  elements.passwordModal.classList.add("hidden");
  elements.passwordModal.setAttribute("aria-hidden", "true");
  elements.passwordInput.classList.remove("is-invalid");
  setPasswordMessage("");
  document.body.classList.remove("modal-open");
}

async function handlePasswordSubmit(event) {
  event.preventDefault();

  if (!pendingUnlockGame) {
    return;
  }

  const targetGame = pendingUnlockGame;
  const rawPassword = elements.passwordInput.value.trim();
  if (rawPassword === "") {
    elements.passwordInput.classList.add("is-invalid");
    setPasswordMessage("Enter a password to continue.");
    elements.passwordInput.focus();
    return;
  }

  setPasswordControlsDisabled(true);

  try {
    const digest = await hashPassword(rawPassword);
    if (digest === GAME_ACCESS[targetGame].digest) {
      const unlockedGame = targetGame;
      unlockedGames[unlockedGame] = true;
      persistUnlockedGames();
      updateHomeCards();
      closePasswordGate({ force: true });
      setActiveView(unlockedGame);
      return;
    }

    elements.passwordInput.classList.add("is-invalid");
    setPasswordMessage("Wrong password. Try again.");
    elements.passwordInput.select();
  } catch (error) {
    console.error(error);
    setPasswordMessage("Password checks are unavailable in this browser right now.");
  } finally {
    setPasswordControlsDisabled(false);
  }
}

function setPasswordControlsDisabled(isDisabled) {
  elements.passwordInput.disabled = isDisabled;
  elements.passwordSubmit.disabled = isDisabled;
  elements.passwordCancel.disabled = isDisabled;
}

function setPasswordMessage(message) {
  elements.passwordMessage.textContent = message;
  elements.passwordMessage.classList.toggle("hidden", message === "");
}

function updateHomeCards() {
  elements.homeCards.forEach((card) => {
    const gameKey = card.dataset.gameCard;
    const isUnlocked = unlockedGames[gameKey] === true;
    const status = card.querySelector(".home-card-status");
    const note = card.querySelector(".home-card-note");
    const button = card.querySelector(".home-enter-button");

    card.classList.toggle("is-unlocked", isUnlocked);
    status.textContent = isUnlocked ? "Unlocked" : "Locked";
    note.textContent = isUnlocked ? "Ready for this browser session" : "Password required";
    button.textContent = isUnlocked ? "Open Board" : "Unlock Board";
  });

  updateTopbar();
}

function updateTopbar() {
  if (activeView === "home") {
    elements.topbarTitle.textContent = "Home";
    elements.topbarSubtitle.textContent = "Choose a board and unlock it with its own password.";
    elements.topbarStatus.textContent = `${countUnlockedGames()} of ${GAME_KEYS.length} unlocked this session`;
    document.title = "WQC Trading Helpers";
    return;
  }

  const game = GAME_ACCESS[activeView];
  elements.topbarTitle.textContent = game.title;
  elements.topbarSubtitle.textContent = game.subtitle;
  elements.topbarStatus.textContent = "Unlocked for this session";
  document.title = `${game.shortTitle} · WQC Trading Helpers`;
}

function countUnlockedGames() {
  return GAME_KEYS.filter((gameKey) => unlockedGames[gameKey]).length;
}

function createUnlockState() {
  return GAME_KEYS.reduce((state, gameKey) => {
    state[gameKey] = false;
    return state;
  }, {});
}

function loadUnlockedGames() {
  const state = createUnlockState();

  try {
    const saved = window.sessionStorage.getItem(SESSION_UNLOCK_KEY);
    if (!saved) {
      return state;
    }

    const parsed = JSON.parse(saved);
    GAME_KEYS.forEach((gameKey) => {
      state[gameKey] = parsed[gameKey] === true;
    });
  } catch (error) {
    console.warn("Unable to restore unlock state.", error);
  }

  return state;
}

function persistUnlockedGames() {
  try {
    window.sessionStorage.setItem(SESSION_UNLOCK_KEY, JSON.stringify(unlockedGames));
  } catch (error) {
    console.warn("Unable to persist unlock state.", error);
  }
}

async function hashPassword(password) {
  if (!window.crypto || !window.crypto.subtle) {
    throw new Error("Web Crypto unavailable");
  }

  const digestBuffer = await window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(password));
  return Array.from(new Uint8Array(digestBuffer), (value) => value.toString(16).padStart(2, "0")).join("");
}

function bindButtons() {
  elements.loadSampleButton.addEventListener("click", () => {
    applyOctoRollSet(OCTO_SAMPLE_ROLLS);
    scheduleRender();
  });

  elements.clearBoardButton.addEventListener("click", () => {
    applyOctoRollSet({
      A: Array(OCTO_TOTAL_ROLLS).fill(null),
      B: Array(OCTO_TOTAL_ROLLS).fill(null),
    });
    scheduleRender();
  });

  elements.tripletsLoadSampleButton.addEventListener("click", () => {
    applyTripletsSample(TRIPLETS_SAMPLE);
    scheduleRender();
  });

  elements.tripletsClearBoardButton.addEventListener("click", () => {
    applyTripletsSample({
      assignment: "A",
      rolls: Array(TRIPLETS_TOTAL_ROLLS).fill(null),
      quotes: {
        AB: { bid: null, ask: null },
        BC: { bid: null, ask: null },
        AC: { bid: null, ask: null },
      },
    });
    scheduleRender();
  });

  elements.tripletsAssignment.addEventListener("change", scheduleRender);

  tripletsMarketInputs.forEach((input) => {
    input.addEventListener("input", scheduleRender);
  });

  elements.auctionLoadSampleButton.addEventListener("click", () => {
    applyAuctionBidSet(AUCTION_SAMPLE_BIDS);
    elements.auctionPointValue.value = String(AUCTION_SAMPLE_POINT_VALUE);
    scheduleRender();
  });

  elements.auctionClearBoardButton.addEventListener("click", () => {
    applyAuctionBidSet(Array(AUCTION_TOTAL_ROUNDS).fill(null));
    elements.auctionPointValue.value = "";
    scheduleRender();
  });

  elements.auctionPointValue.addEventListener("input", scheduleRender);
}

function scheduleRender() {
  if (renderQueued) {
    return;
  }

  renderQueued = true;
  window.requestAnimationFrame(() => {
    renderQueued = false;
    renderOctomarket();
    renderTriplets();
    renderAuction();
  });
}

function createOctoRollInputs() {
  for (let index = 0; index < OCTO_TOTAL_ROLLS; index += 1) {
    const row = document.createElement("div");
    row.className = "roll-row";

    const minuteLabel = document.createElement("div");
    minuteLabel.className = "minute-label";
    minuteLabel.innerHTML = `<strong>M${index + 1}</strong><span>A${index + 1} / B${index + 1}</span>`;

    const aInput = createBoundedIntegerInput(`A${index + 1}`, 20, "roll-input");
    const bInput = createBoundedIntegerInput(`B${index + 1}`, 20, "roll-input");

    row.append(minuteLabel, aInput, bInput);
    elements.rollInputs.appendChild(row);
    octoRollInputPairs.push({ aInput, bInput });
  }
}

function createTripletsRollInputs() {
  for (let index = 0; index < TRIPLETS_TOTAL_ROLLS; index += 1) {
    const cell = document.createElement("label");
    cell.className = "triplets-roll-cell";

    const label = document.createElement("span");
    label.className = "triplets-roll-label";
    label.textContent = `R${index + 1}`;

    const input = createBoundedIntegerInput(`Triplets roll ${index + 1}`, 10, "triplets-roll-input");
    input.dataset.index = String(index);

    cell.append(label, input);
    elements.tripletsRollInputs.appendChild(cell);
    tripletsRollInputs.push(input);
  }
}

function createAuctionBidInputs() {
  for (let index = 0; index < AUCTION_TOTAL_ROUNDS; index += 1) {
    const cell = document.createElement("label");
    cell.className = "triplets-roll-cell auction-bid-cell";

    const label = document.createElement("span");
    label.className = "triplets-roll-label";
    label.textContent = `R${index + 1}`;

    const input = createBoundedIntegerInput(
      `Auction bid ${index + 1}`,
      AUCTION_MAX_BID,
      "market-input auction-bid-input",
      0
    );
    input.placeholder = "0";
    input.dataset.index = String(index);
    input.addEventListener("focus", () => {
      auctionSelectedIndex = index;
      scheduleRender();
    });

    cell.append(label, input);
    elements.auctionBidInputs.appendChild(cell);
    auctionBidInputs.push(input);
    auctionBidCells.push(cell);
  }
}

function createBoundedIntegerInput(label, maxValue, className, minValue = 1) {
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "-";
  input.className = className;
  input.inputMode = "numeric";
  input.autocomplete = "off";
  input.maxLength = String(maxValue).length;
  input.spellcheck = false;
  input.dataset.minValue = String(minValue);
  input.dataset.maxValue = String(maxValue);
  input.dataset.lastValid = "";
  input.setAttribute("aria-label", label);
  input.addEventListener("input", handleBoundedIntegerInput);
  return input;
}

function handleBoundedIntegerInput(event) {
  const input = event.currentTarget;
  const minValue = Number(input.dataset.minValue || 1);
  const maxValue = Number(input.dataset.maxValue);
  const normalized = normalizeBoundedIntegerInputValue(
    input.value,
    input.dataset.lastValid || "",
    minValue,
    maxValue
  );

  if (input.value !== normalized) {
    input.value = normalized;
  }

  input.dataset.lastValid = normalized;
  scheduleRender();
}

function normalizeBoundedIntegerInputValue(rawValue, previousValue, minValue, maxValue) {
  const maxLength = String(maxValue).length;
  const digitsOnly = rawValue.replace(/\D/g, "").slice(0, maxLength);

  if (digitsOnly === "") {
    return "";
  }

  const numericValue = Number(digitsOnly);
  return numericValue >= minValue && numericValue <= maxValue ? String(numericValue) : previousValue;
}

function applyOctoRollSet(rollSet) {
  octoRollInputPairs.forEach(({ aInput, bInput }, index) => {
    aInput.value = rollSet.A[index] == null ? "" : String(rollSet.A[index]);
    bInput.value = rollSet.B[index] == null ? "" : String(rollSet.B[index]);
    aInput.dataset.lastValid = aInput.value;
    bInput.dataset.lastValid = bInput.value;
    aInput.classList.remove("is-invalid");
    bInput.classList.remove("is-invalid");
  });
}

function applyTripletsSample(sample) {
  elements.tripletsAssignment.value = sample.assignment;

  tripletsRollInputs.forEach((input, index) => {
    input.value = sample.rolls[index] == null ? "" : String(sample.rolls[index]);
    input.dataset.lastValid = input.value;
    input.classList.remove("is-invalid");
  });

  elements.tripletsBidAb.value = sample.quotes.AB.bid == null ? "" : String(sample.quotes.AB.bid);
  elements.tripletsAskAb.value = sample.quotes.AB.ask == null ? "" : String(sample.quotes.AB.ask);
  elements.tripletsBidBc.value = sample.quotes.BC.bid == null ? "" : String(sample.quotes.BC.bid);
  elements.tripletsAskBc.value = sample.quotes.BC.ask == null ? "" : String(sample.quotes.BC.ask);
  elements.tripletsBidAc.value = sample.quotes.AC.bid == null ? "" : String(sample.quotes.AC.bid);
  elements.tripletsAskAc.value = sample.quotes.AC.ask == null ? "" : String(sample.quotes.AC.ask);
  tripletsMarketInputs.forEach((input) => input.classList.remove("is-invalid"));
}

function applyAuctionBidSet(bids) {
  auctionBidInputs.forEach((input, index) => {
    input.value = bids[index] == null ? "" : String(bids[index]);
    input.dataset.lastValid = input.value;
    input.classList.remove("is-invalid");
  });
}

function renderOctomarket() {
  const state = readOctomarketState();
  renderOctomarketValidation(state);
  renderOctomarketEngineStatus();
  renderOctomarketSummary(state);

  if (state.errors.length > 0) {
    elements.resultsGroups.innerHTML =
      '<p class="empty-state">Fix the highlighted entries to resume the exact fair values.</p>';
    return;
  }

  const results = computeOctomarketResults(state);
  renderOctomarketResults(results);
}

function readOctomarketState() {
  const rollsA = [];
  const rollsB = [];
  const errors = [];
  const invalidInputs = new Set();

  octoRollInputPairs.forEach(({ aInput, bInput }, index) => {
    const parsedA = parseBoundedInteger(aInput.value, `A${index + 1}`, 20);
    const parsedB = parseBoundedInteger(bInput.value, `B${index + 1}`, 20);

    if (parsedA.error) {
      errors.push(parsedA.error);
      invalidInputs.add(aInput);
    }

    if (parsedB.error) {
      errors.push(parsedB.error);
      invalidInputs.add(bInput);
    }

    rollsA.push(parsedA.value);
    rollsB.push(parsedB.value);
  });

  markInvalidState(
    octoRollInputPairs.flatMap(({ aInput, bInput }) => [aInput, bInput]),
    invalidInputs
  );

  const teamA = summarizeOctomarketRolls(rollsA);
  const teamB = summarizeOctomarketRolls(rollsB);
  const pairedMinutes = rollsA.reduce((count, value, index) => {
    return value != null && rollsB[index] != null ? count + 1 : count;
  }, 0);

  return {
    errors,
    pairedMinutes,
    teamA,
    teamB,
  };
}

function parseBoundedInteger(rawValue, label, maxValue) {
  return parseBoundedIntegerInRange(rawValue, label, 1, maxValue);
}

function parseBoundedIntegerInRange(rawValue, label, minValue, maxValue) {
  const trimmed = rawValue.trim();
  if (trimmed === "") {
    return { value: null };
  }

  const value = Number(trimmed);
  if (!Number.isInteger(value) || value < minValue || value > maxValue) {
    return { value: null, error: `${label} must be an integer from ${minValue} to ${maxValue}.` };
  }

  return { value };
}

function markInvalidState(allInputs, invalidInputs) {
  allInputs.forEach((input) => {
    input.classList.toggle("is-invalid", invalidInputs.has(input));
  });
}

function summarizeOctomarketRolls(rolls) {
  const exponents = Array(PRIMES.length).fill(0);
  let sum = 0;
  let oddCount = 0;
  let knownCount = 0;

  rolls.forEach((value) => {
    if (value == null) {
      return;
    }

    sum += value;
    oddCount += value % 2;
    knownCount += 1;

    const faceExponents = FACE_EXPONENTS[value - 1];
    for (let index = 0; index < PRIMES.length; index += 1) {
      exponents[index] += faceExponents[index];
    }
  });

  return {
    rolls,
    sum,
    oddCount,
    knownCount,
    remaining: OCTO_TOTAL_ROLLS - knownCount,
    exponents,
    knownProductDivisors: divisorCountFromExponents(exponents),
  };
}

function renderOctomarketValidation(state) {
  if (state.errors.length === 0) {
    elements.validationMessage.classList.add("hidden");
    elements.validationMessage.textContent = "";
    return;
  }

  elements.validationMessage.classList.remove("hidden");
  elements.validationMessage.textContent = state.errors[0];
}

function renderOctomarketEngineStatus() {
  const banner = elements.engineStatus;
  banner.classList.remove("is-warming", "is-error");

  if (divisorEngineStatus === "ready") {
    banner.textContent = "Exact mode";
    return;
  }

  if (divisorEngineStatus === "error") {
    banner.classList.add("is-error");
    banner.textContent = "DIV unavailable";
    return;
  }

  banner.classList.add("is-warming");
  banner.textContent = "Loading DIV";
}

function renderOctomarketSummary(state) {
  const summaryCards = [
    { label: "Logged", value: `${state.pairedMinutes}/${OCTO_TOTAL_ROLLS}` },
    { label: "A Sum", value: String(state.teamA.sum) },
    { label: "B Sum", value: String(state.teamB.sum) },
    { label: "A Odd", value: String(state.teamA.oddCount) },
    { label: "B Odd", value: String(state.teamB.oddCount) },
    { label: "A Div", value: String(state.teamA.knownProductDivisors) },
    { label: "B Div", value: String(state.teamB.knownProductDivisors) },
  ];

  elements.summaryGrid.innerHTML = summaryCards
    .map(
      (card) => `
        <article class="summary-card">
          <h3>${card.label}</h3>
          <strong>${card.value}</strong>
        </article>
      `
    )
    .join("");
}

function computeOctomarketResults(state) {
  const sumDistributionA = buildShiftedProbabilityArray(
    SUM_TABLES[state.teamA.remaining],
    state.teamA.sum,
    201,
    state.teamA.remaining
  );
  const sumDistributionB = buildShiftedProbabilityArray(
    SUM_TABLES[state.teamB.remaining],
    state.teamB.sum,
    201,
    state.teamB.remaining
  );
  const oddDistributionA = buildShiftedProbabilityArray(
    ODD_TABLES[state.teamA.remaining],
    state.teamA.oddCount,
    11,
    state.teamA.remaining
  );
  const oddDistributionB = buildShiftedProbabilityArray(
    ODD_TABLES[state.teamB.remaining],
    state.teamB.oddCount,
    11,
    state.teamB.remaining
  );

  const winnerComparison = compareOrdinalProbabilityArrays(sumDistributionA, sumDistributionB);
  const oddComparison = compareOrdinalProbabilityArrays(oddDistributionA, oddDistributionB);

  const results = {
    winA: threeWayResult(winnerComparison.win, winnerComparison.tie),
    winB: threeWayResult(winnerComparison.loss, winnerComparison.tie),
    oddA: threeWayResult(oddComparison.win, oddComparison.tie),
    oddB: threeWayResult(oddComparison.loss, oddComparison.tie),
    spreadS: binaryResult(spreadProbability(sumDistributionA, sumDistributionB, 6)),
    spreadL: binaryResult(spreadProbability(sumDistributionA, sumDistributionB, 21)),
  };

  if (divisorEngineStatus === "ready") {
    const divisorDistributionA = buildDivisorProbabilityMap(state.teamA.exponents, state.teamA.remaining);
    const divisorDistributionB = buildDivisorProbabilityMap(state.teamB.exponents, state.teamB.remaining);
    const divisorComparison = compareSortedProbabilityMaps(divisorDistributionA, divisorDistributionB);
    results.divA = threeWayResult(divisorComparison.win, divisorComparison.tie);
    results.divB = threeWayResult(divisorComparison.loss, divisorComparison.tie);
  } else {
    results.divA = null;
    results.divB = null;
  }

  return results;
}

function renderOctomarketResults(results) {
  elements.resultsGroups.innerHTML = OCTO_RESULT_GROUPS.map((group) => renderOctoResultGroup(group, results)).join("");
}

function renderOctoResultGroup(group, results) {
  return `
    <section class="results-group">
      <div class="results-group-header">
        <h3>${group.title}</h3>
      </div>
      <div class="symbol-grid">
        ${group.symbols.map((symbol) => renderOctoSymbolCard(symbol, results[symbol.key])).join("")}
      </div>
    </section>
  `;
}

function renderOctoSymbolCard(symbol, result) {
  if (!result) {
    return `
      <article class="symbol-card is-loading">
        <div class="symbol-topline">
          <div>
            <h3>${symbol.label}</h3>
          </div>
          <div class="fair-value-wrap">
            <span class="fair-value-label">Fair</span>
            <span class="fair-value">...</span>
          </div>
        </div>
        <p class="loading-note">Loading exact divisor odds.</p>
      </article>
    `;
  }

  return `
    <article class="symbol-card">
      <div class="symbol-topline">
        <div>
          <h3>${symbol.label}</h3>
        </div>
        <div class="fair-value-wrap">
          <span class="fair-value-label">Fair</span>
          <span class="fair-value">$${result.fairValue.toFixed(2)}</span>
        </div>
      </div>
      <div class="resolution-grid">
        ${result.resolutions.map(renderResolutionRow).join("")}
      </div>
    </article>
  `;
}

function renderTriplets() {
  const state = readTripletsState();
  renderTripletsFormula(state.assignment);
  renderTripletsValidation(state);
  elements.tripletsMethod.textContent = "Exact posterior + sigma";

  if (state.errors.length > 0) {
    elements.tripletsSummaryGrid.innerHTML = "";
    elements.tripletsResults.innerHTML =
      '<p class="empty-state">Fix the highlighted Triplets entries to restore the fair values and trade recommendations.</p>';
    return;
  }

  const posterior = computeTripletsPosterior(state.rolls);
  const model = buildTripletsModel(state.assignment, posterior, state.quotes);

  renderTripletsSummary(state, posterior, model);
  renderTripletsResults(model);
}

function readTripletsState() {
  const assignment = TRIPLETS_ASSIGNMENT_CONFIG[elements.tripletsAssignment.value] ? elements.tripletsAssignment.value : "A";
  const rolls = [];
  const errors = [];
  const invalidInputs = new Set();

  tripletsRollInputs.forEach((input, index) => {
    const parsed = parseBoundedInteger(input.value, `Triplets roll ${index + 1}`, 10);
    if (parsed.error) {
      errors.push(parsed.error);
      invalidInputs.add(input);
    }
    rolls.push(parsed.value);
  });

  const quoteParsers = {
    AB: parseQuotePair(elements.tripletsBidAb, elements.tripletsAskAb, "AB"),
    BC: parseQuotePair(elements.tripletsBidBc, elements.tripletsAskBc, "BC"),
    AC: parseQuotePair(elements.tripletsBidAc, elements.tripletsAskAc, "AC"),
  };

  Object.values(quoteParsers).forEach((parsed) => {
    if (parsed.error) {
      errors.push(parsed.error);
    }
    parsed.invalidInputs.forEach((input) => invalidInputs.add(input));
  });

  markInvalidState([...tripletsRollInputs, ...tripletsMarketInputs], invalidInputs);

  return {
    assignment,
    rolls,
    quotes: {
      AB: quoteParsers.AB.value,
      BC: quoteParsers.BC.value,
      AC: quoteParsers.AC.value,
    },
    errors,
  };
}

function parseQuotePair(bidInput, askInput, label) {
  const parsedBid = parseQuoteValue(bidInput.value, `${label} bid`);
  const parsedAsk = parseQuoteValue(askInput.value, `${label} ask`);
  const invalidInputs = new Set();

  if (parsedBid.error) {
    invalidInputs.add(bidInput);
  }

  if (parsedAsk.error) {
    invalidInputs.add(askInput);
  }

  if (!parsedBid.error && !parsedAsk.error && parsedBid.value != null && parsedAsk.value != null && parsedBid.value > parsedAsk.value) {
    invalidInputs.add(bidInput);
    invalidInputs.add(askInput);
    return {
      value: { bid: parsedBid.value, ask: parsedAsk.value },
      error: `${label} bid cannot be above ${label} ask.`,
      invalidInputs,
    };
  }

  return {
    value: { bid: parsedBid.value, ask: parsedAsk.value },
    error: parsedBid.error || parsedAsk.error || null,
    invalidInputs,
  };
}

function parseQuoteValue(rawValue, label) {
  const trimmed = rawValue.trim();
  if (trimmed === "") {
    return { value: null };
  }

  const value = Number(trimmed);
  if (!Number.isInteger(value) || value < 18 || value > 180) {
    return { value: null, error: `${label} must be a whole dollar from 18 to 180.` };
  }

  return { value };
}

function renderTripletsFormula(assignment) {
  const safeAssignment = TRIPLETS_ASSIGNMENT_CONFIG[assignment] ? assignment : "A";
  elements.tripletsFormula.textContent = TRIPLETS_ASSIGNMENT_CONFIG[safeAssignment].comboFormula;
}

function renderTripletsValidation(state) {
  if (state.errors.length === 0) {
    elements.tripletsValidation.classList.add("hidden");
    elements.tripletsValidation.textContent = "";
    return;
  }

  elements.tripletsValidation.classList.remove("hidden");
  elements.tripletsValidation.textContent = state.errors[0];
}

function renderAuction() {
  const state = readAuctionState();
  renderAuctionValidation(state);
  elements.auctionMethod.textContent = "Exact B + phi(B)";

  if (state.errors.length > 0) {
    elements.auctionSummaryGrid.innerHTML = "";
    elements.auctionResults.innerHTML =
      '<p class="empty-state">Fix the highlighted bid entries to restore B and phi(B).</p>';
    return;
  }

  const model = computeAuctionModel(state.bids, state.pointValue);
  renderAuctionSummary(model);
  renderAuctionResults(model);
}

function readAuctionState() {
  const bids = [];
  const errors = [];
  const invalidInputs = new Set();
  const parsedPointValue = parseAuctionPointValue(elements.auctionPointValue.value);

  auctionBidInputs.forEach((input, index) => {
    const parsed = parseBoundedIntegerInRange(input.value, `Round ${index + 1} bid`, 0, AUCTION_MAX_BID);

    if (parsed.error) {
      errors.push(parsed.error);
      invalidInputs.add(input);
    }

    bids.push(parsed.value);
  });

  if (parsedPointValue.error) {
    errors.push(parsedPointValue.error);
    invalidInputs.add(elements.auctionPointValue);
  }

  markInvalidState([elements.auctionPointValue, ...auctionBidInputs], invalidInputs);

  return {
    bids,
    pointValue: parsedPointValue.value,
    errors,
  };
}

function renderAuctionValidation(state) {
  if (state.errors.length === 0) {
    elements.auctionValidation.classList.add("hidden");
    elements.auctionValidation.textContent = "";
    return;
  }

  elements.auctionValidation.classList.remove("hidden");
  elements.auctionValidation.textContent = state.errors[0];
}

function computeAuctionModel(bids, pointValue) {
  let enteredRounds = 0;
  let totalBid = 0;

  bids.forEach((value) => {
    if (value == null) {
      return;
    }

    enteredRounds += 1;
    totalBid += value;
  });

  const selectedIndex = resolveAuctionSelectedIndex(bids);
  const selectedBid = selectedIndex == null ? null : bids[selectedIndex];
  const baseBidWithoutSelected = selectedBid == null ? totalBid : totalBid - selectedBid;
  const penalty = computeAuctionPenalty(totalBid);
  const selectedPenaltyContribution =
    selectedBid == null ? null : penalty - computeAuctionPenalty(baseBidWithoutSelected);
  const maxProfitableBid =
    pointValue == null ? null : findMaxProfitableAuctionBid(baseBidWithoutSelected, pointValue);
  const selectedProfitMargin =
    pointValue == null || selectedPenaltyContribution == null ? null : pointValue - selectedPenaltyContribution;

  return {
    enteredRounds,
    totalBid,
    penalty,
    pointValue,
    selectedIndex,
    selectedBid,
    baseBidWithoutSelected,
    selectedPenaltyContribution,
    maxProfitableBid,
    selectedProfitMargin,
  };
}

function renderAuctionSummary(model) {
  const summaryCards = [
    { label: "Entered", value: `${model.enteredRounds}/${AUCTION_TOTAL_ROUNDS}` },
    { label: "B", value: formatInteger(model.totalBid) },
    { label: "phi(B)", value: formatPlainNumber(model.penalty) },
    { label: "Round Value", value: model.pointValue == null ? "-" : formatPlainNumber(model.pointValue) },
    { label: "Max Safe Bid", value: model.maxProfitableBid == null ? "-" : formatInteger(model.maxProfitableBid) },
    {
      label: selectedAuctionLabel(model.selectedIndex),
      value: model.selectedBid == null ? "-" : formatInteger(model.selectedBid),
    },
    {
      label: "Current Edge",
      value: model.selectedProfitMargin == null ? "-" : renderSignedPlainNumber(model.selectedProfitMargin),
    },
  ];

  elements.auctionSummaryGrid.innerHTML = summaryCards
    .map(
      (card) => `
        <article class="summary-card">
          <h3>${card.label}</h3>
          <strong>${card.value}</strong>
        </article>
      `
    )
    .join("");
}

function renderAuctionResults(model) {
  elements.auctionResults.innerHTML = `
    <div class="results-group">
      <div class="results-group-header">
        <h3>Bid Penalty</h3>
      </div>
      <article class="triplets-card">
        <div class="triplets-card-top">
          <h3>phi(B) = B^(ln pi) / 100</h3>
          <span class="trade-badge hold">${model.enteredRounds}/${AUCTION_TOTAL_ROUNDS} rounds</span>
        </div>
        <div class="metric-grid">
          <div>
            <span class="metric-label">Current B</span>
            <strong>${formatInteger(model.totalBid)}</strong>
          </div>
          <div>
            <span class="metric-label">Current phi(B)</span>
            <strong>${formatPlainNumber(model.penalty)}</strong>
          </div>
          <div>
            <span class="metric-label">Base B Before ${selectedAuctionLabel(model.selectedIndex)}</span>
            <strong>${formatInteger(model.baseBidWithoutSelected)}</strong>
          </div>
          <div>
            <span class="metric-label">Round Value</span>
            <strong>${model.pointValue == null ? "-" : formatPlainNumber(model.pointValue)}</strong>
          </div>
          <div>
            <span class="metric-label">${selectedAuctionLabel(model.selectedIndex)} -> B</span>
            <strong>${model.selectedBid == null ? "-" : formatInteger(model.selectedBid)}</strong>
          </div>
          <div>
            <span class="metric-label">${selectedAuctionLabel(model.selectedIndex)} -> phi(B)</span>
            <strong>${model.selectedPenaltyContribution == null ? "-" : formatPlainNumber(model.selectedPenaltyContribution)}</strong>
          </div>
          <div>
            <span class="metric-label">Max Profitable Bid</span>
            <strong>${model.maxProfitableBid == null ? "-" : formatInteger(model.maxProfitableBid)}</strong>
          </div>
          <div>
            <span class="metric-label">Edge vs Current Bid</span>
            <strong>${model.selectedProfitMargin == null ? "-" : renderSignedPlainNumber(model.selectedProfitMargin)}</strong>
          </div>
        </div>
        <p class="trade-note">
          The selected entry follows the bid box you are focused on. Max profitable bid solves the integer cutoff
          phi(base + bid) - phi(base) &lt;= value, where base excludes the selected round.
        </p>
      </article>
    </div>
    <div class="results-group">
      <div class="results-group-header">
        <h3>Lookup: B to phi(B)</h3>
      </div>
      <article class="triplets-card">
        <div class="triplets-card-top">
          <h3>Quick table for benchmark B values</h3>
          <span class="trade-badge hold">${AUCTION_LOOKUP_VALUES.length} points</span>
        </div>
        <div class="auction-lookup-wrap">
          <table class="auction-lookup-table">
            <thead>
              <tr>
                <th>B</th>
                <th>phi(B)</th>
              </tr>
            </thead>
            <tbody>
              ${AUCTION_LOOKUP_ROWS.map(renderAuctionLookupRow).join("")}
            </tbody>
          </table>
        </div>
      </article>
    </div>
  `;

  renderAuctionSelection(model.selectedIndex);
}

function resolveAuctionSelectedIndex(bids) {
  if (
    auctionSelectedIndex != null &&
    auctionSelectedIndex >= 0 &&
    auctionSelectedIndex < AUCTION_TOTAL_ROUNDS
  ) {
    return auctionSelectedIndex;
  }

  for (let index = bids.length - 1; index >= 0; index -= 1) {
    if (bids[index] != null) {
      return index;
    }
  }

  return 0;
}

function parseAuctionPointValue(rawValue) {
  const trimmed = rawValue.trim();
  if (trimmed === "") {
    return { value: null };
  }

  const value = Number(trimmed);
  if (!Number.isFinite(value) || value < 0 || value > 10) {
    return { value: null, error: "Round value must be a number from 0 to 10." };
  }

  return { value };
}

function findMaxProfitableAuctionBid(baseBid, pointValue) {
  let low = 0;
  let high = AUCTION_MAX_BID;
  const basePenalty = computeAuctionPenalty(baseBid);

  while (low < high) {
    const midpoint = Math.floor((low + high + 1) / 2);
    const incrementalPenalty = computeAuctionPenalty(baseBid + midpoint) - basePenalty;

    if (incrementalPenalty <= pointValue + 1e-12) {
      low = midpoint;
    } else {
      high = midpoint - 1;
    }
  }

  return low;
}

function renderAuctionSelection(selectedIndex) {
  auctionBidCells.forEach((cell, index) => {
    cell.classList.toggle("is-active", index === selectedIndex);
  });
}

function selectedAuctionLabel(selectedIndex) {
  return `Round ${selectedIndex + 1}`;
}

function renderAuctionLookupRow(entry) {
  return `
    <tr>
      <td>${formatInteger(entry.totalBid)}</td>
      <td>${formatPlainNumber(entry.penalty)}</td>
    </tr>
  `;
}

function computeTripletsPosterior(rolls) {
  const observedCounts = Array(TRIPLETS_VALUE_COUNT).fill(0);
  let observedSum = 0;
  let observedCount = 0;

  rolls.forEach((value) => {
    if (value == null) {
      return;
    }

    observedCounts[value - 1] += 1;
    observedSum += value;
    observedCount += 1;
  });

  return computeTripletsPosteriorFromCounts(observedCounts, observedSum, observedCount);
}

function computeTripletsPosteriorFromCounts(observedCounts, observedSum, observedCount) {
  const remaining = TRIPLETS_TOTAL_ROLLS - observedCount;
  let weightSum = 0;
  let nextRollMean = 0;
  let eventMean = 0;
  let eventSecondMoment = 0;

  TRIPLETS_STATES.forEach((state) => {
    let weight = state.priorWeight;

    for (let index = 0; index < TRIPLETS_VALUE_COUNT; index += 1) {
      const observed = observedCounts[index];
      if (observed === 0) {
        continue;
      }

      const faceCount = state.counts[index];
      if (faceCount === 0) {
        weight = 0;
        break;
      }

      weight *= TRIPLETS_LIKELIHOOD_POWERS[faceCount][observed];
    }

    if (weight === 0) {
      return;
    }

    const conditionalMean = observedSum + remaining * state.rollMean;
    const conditionalVariance = remaining * (state.rollSecondMoment - state.rollMean ** 2);

    weightSum += weight;
    nextRollMean += weight * state.rollMean;
    eventMean += weight * conditionalMean;
    eventSecondMoment += weight * (conditionalVariance + conditionalMean ** 2);
  });

  const safeWeightSum = weightSum || 1;
  const normalizedEventMean = eventMean / safeWeightSum;
  const normalizedSecondMoment = eventSecondMoment / safeWeightSum;
  const variance = Math.max(0, normalizedSecondMoment - normalizedEventMean ** 2);

  return {
    observedCount,
    remaining,
    nextRollMean: nextRollMean / safeWeightSum,
    eventMean: normalizedEventMean,
    variance,
    standardDeviation: Math.sqrt(variance),
  };
}

function buildTripletsModel(assignment, posterior, quotes) {
  const config = TRIPLETS_ASSIGNMENT_CONFIG[assignment];
  const priorMean = TRIPLETS_PRIOR_EVENT.eventMean;
  const priorVariance = TRIPLETS_PRIOR_EVENT.variance;

  const fairValues = {
    AB: 2 * priorMean,
    AC: 2 * priorMean,
    BC: 2 * priorMean,
  };

  const variances = {
    AB: 2 * priorVariance,
    AC: 2 * priorVariance,
    BC: 2 * priorVariance,
  };

  if (assignment === "A") {
    fairValues.AB = posterior.eventMean + priorMean;
    fairValues.AC = posterior.eventMean + priorMean;
    variances.AB = posterior.variance + priorVariance;
    variances.AC = posterior.variance + priorVariance;
  } else if (assignment === "B") {
    fairValues.AB = posterior.eventMean + priorMean;
    fairValues.BC = posterior.eventMean + priorMean;
    variances.AB = posterior.variance + priorVariance;
    variances.BC = posterior.variance + priorVariance;
  } else {
    fairValues.AC = posterior.eventMean + priorMean;
    fairValues.BC = posterior.eventMean + priorMean;
    variances.AC = posterior.variance + priorVariance;
    variances.BC = posterior.variance + priorVariance;
  }

  const contracts = ["AB", "BC", "AC"].map((symbol) =>
    buildTradeView(symbol, fairValues[symbol], variances[symbol], quotes[symbol])
  );

  const comboQuotes = buildComboExecutableQuotes(config, quotes);
  const combo = buildComboView(config, posterior, comboQuotes);

  return {
    config,
    contracts,
    combo,
  };
}

function buildTradeView(symbol, fairValue, variance, quote) {
  const standardDeviation = Math.sqrt(Math.max(0, variance));
  const buyEdge = quote.ask == null ? null : fairValue - quote.ask;
  const sellEdge = quote.bid == null ? null : quote.bid - fairValue;
  const recommendation = classifyQuoteTrade(buyEdge, sellEdge, standardDeviation);
  const actionableEdge =
    recommendation.action === "Buy"
      ? buyEdge
      : recommendation.action === "Sell"
        ? sellEdge
        : null;
  const actionPrice =
    recommendation.action === "Buy"
      ? quote.ask
      : recommendation.action === "Sell"
        ? quote.bid
        : null;

  return {
    symbol,
    fairValue,
    standardDeviation,
    bid: quote.bid,
    ask: quote.ask,
    buyEdge,
    sellEdge,
    actionableEdge,
    actionPrice,
    recommendation,
  };
}

function buildComboView(config, posterior, comboQuotes) {
  const fairValue = 2 * posterior.eventMean;
  const standardDeviation = 2 * posterior.standardDeviation;
  const buyEdge = comboQuotes.ask == null ? null : fairValue - comboQuotes.ask;
  const sellEdge = comboQuotes.bid == null ? null : comboQuotes.bid - fairValue;
  const recommendation = classifyQuoteTrade(buyEdge, sellEdge, standardDeviation);
  const actionableEdge =
    recommendation.action === "Buy"
      ? buyEdge
      : recommendation.action === "Sell"
        ? sellEdge
        : null;
  const actionPrice =
    recommendation.action === "Buy"
      ? comboQuotes.ask
      : recommendation.action === "Sell"
        ? comboQuotes.bid
        : null;

  return {
    label: config.comboExpression,
    target: config.comboTarget,
    formula: config.comboFormula,
    cheapLegs: config.cheapLegs,
    richLegs: config.richLegs,
    buyFormula: buildComboQuoteFormula(config, "buy"),
    sellFormula: buildComboQuoteFormula(config, "sell"),
    fairValue,
    standardDeviation,
    bid: comboQuotes.bid,
    ask: comboQuotes.ask,
    buyEdge,
    sellEdge,
    actionableEdge,
    actionPrice,
    recommendation,
  };
}

function emptyTradeRecommendation() {
  return {
    badgeText: "Watch",
    badgeClass: "hold",
    action: "Watch",
    units: 0,
  };
}

function classifyQuoteTrade(buyEdge, sellEdge, standardDeviation) {
  const safeBuyEdge = buyEdge == null ? -Infinity : buyEdge;
  const safeSellEdge = sellEdge == null ? -Infinity : sellEdge;
  const bestEdge = Math.max(safeBuyEdge, safeSellEdge);

  if (!Number.isFinite(bestEdge) || bestEdge < 0.75) {
    return {
      badgeText: "Hold",
      badgeClass: "hold",
      action: "Hold",
      units: 0,
    };
  }

  const action = safeBuyEdge >= safeSellEdge ? "Buy" : "Sell";
  const edge = action === "Buy" ? safeBuyEdge : safeSellEdge;
  const score = standardDeviation > 0 ? edge / standardDeviation : edge;
  let units = 1;

  if (score >= 1.2 || edge >= 8) {
    units = 3;
  } else if (score >= 0.6 || edge >= 4) {
    units = 2;
  }

  return {
    badgeText: `${action} ${units}u`,
    badgeClass: action === "Buy" ? "buy" : "sell",
    action,
    units,
  };
}

function buildComboExecutableQuotes(config, quotes) {
  let ask = 0;
  let bid = 0;

  for (const leg of config.legs) {
    const quote = quotes[leg.symbol];

    if (leg.sign === 1) {
      if (quote.ask == null) {
        ask = null;
      } else if (ask != null) {
        ask += quote.ask;
      }

      if (quote.bid == null) {
        bid = null;
      } else if (bid != null) {
        bid += quote.bid;
      }
    } else {
      if (quote.bid == null) {
        ask = null;
      } else if (ask != null) {
        ask -= quote.bid;
      }

      if (quote.ask == null) {
        bid = null;
      } else if (bid != null) {
        bid -= quote.ask;
      }
    }
  }

  return { bid, ask };
}

function buildComboQuoteFormula(config, direction) {
  return config.legs
    .map((leg, index) => {
      const quoteSide =
        direction === "buy"
          ? leg.sign === 1
            ? `ask(${leg.symbol})`
            : `bid(${leg.symbol})`
          : leg.sign === 1
            ? `bid(${leg.symbol})`
            : `ask(${leg.symbol})`;
      const prefix = index === 0 ? (leg.sign === 1 ? "" : "-") : leg.sign === 1 ? " + " : " - ";
      return `${prefix}${quoteSide}`;
    })
    .join("");
}

function renderTripletsSummary(state, posterior, model) {
  const summaryCards = [
    { label: `${state.assignment} Fair`, value: formatPrice(posterior.eventMean) },
    { label: "Next Roll EV", value: formatPrice(posterior.nextRollMean) },
    { label: model.combo.target, value: formatPrice(model.combo.fairValue) },
    { label: `${state.assignment} Sigma`, value: formatNumber(posterior.standardDeviation) },
    { label: "Combo Bid", value: model.combo.bid == null ? "-" : formatPrice(model.combo.bid) },
    { label: "Combo Ask", value: model.combo.ask == null ? "-" : formatPrice(model.combo.ask) },
  ];

  elements.tripletsSummaryGrid.innerHTML = summaryCards
    .map(
      (card) => `
        <article class="summary-card">
          <h3>${card.label}</h3>
          <strong>${card.value}</strong>
        </article>
      `
    )
    .join("");
}

function renderTripletsResults(model) {
  elements.tripletsResults.innerHTML = `
    <section class="triplets-column">
      <div class="results-group">
        <div class="results-group-header">
          <h3>Contracts</h3>
        </div>
        <div class="triplets-card-grid">
          ${model.contracts.map(renderTripletsContractCard).join("")}
        </div>
      </div>
    </section>
    <section class="triplets-column">
      <div class="results-group">
        <div class="results-group-header">
          <h3>${model.combo.target} Combo</h3>
        </div>
        ${renderTripletsComboCard(model.combo)}
      </div>
    </section>
  `;
}

function renderTripletsContractCard(contract) {
  const note = buildContractNote(contract);

  return `
    <article class="triplets-card">
      <div class="triplets-card-top">
        <h3>${contract.symbol}</h3>
        <span class="trade-badge ${contract.recommendation.badgeClass}">${contract.recommendation.badgeText}</span>
      </div>
      <div class="metric-grid">
        <div>
          <span class="metric-label">Fair</span>
          <strong>${formatPrice(contract.fairValue)}</strong>
        </div>
        <div>
          <span class="metric-label">Bid</span>
          <strong>${contract.bid == null ? "-" : formatPrice(contract.bid)}</strong>
        </div>
        <div>
          <span class="metric-label">Ask</span>
          <strong>${contract.ask == null ? "-" : formatPrice(contract.ask)}</strong>
        </div>
        <div>
          <span class="metric-label">Best Edge</span>
          <strong>${contract.actionableEdge == null ? "-" : formatPrice(contract.actionableEdge)}</strong>
        </div>
      </div>
      <p class="trade-note">${note}</p>
    </article>
  `;
}

function renderTripletsComboCard(combo) {
  const note = buildComboNote(combo);

  return `
    <article class="triplets-card">
      <div class="triplets-card-top">
        <h3>${combo.formula}</h3>
        <span class="trade-badge ${combo.recommendation.badgeClass}">${combo.recommendation.badgeText}</span>
      </div>
      <div class="metric-grid">
        <div>
          <span class="metric-label">Fair</span>
          <strong>${formatPrice(combo.fairValue)}</strong>
        </div>
        <div>
          <span class="metric-label">Bid</span>
          <strong>${combo.bid == null ? "-" : formatPrice(combo.bid)}</strong>
        </div>
        <div>
          <span class="metric-label">Ask</span>
          <strong>${combo.ask == null ? "-" : formatPrice(combo.ask)}</strong>
        </div>
        <div>
          <span class="metric-label">Best Edge</span>
          <strong>${combo.actionableEdge == null ? "-" : formatPrice(combo.actionableEdge)}</strong>
        </div>
      </div>
      <div class="combo-legs">
        <div>
          <span class="metric-label">Cheap Combo</span>
          <strong>${combo.cheapLegs}</strong>
        </div>
        <div>
          <span class="metric-label">Rich Combo</span>
          <strong>${combo.richLegs}</strong>
        </div>
      </div>
      <div class="formula-lines">
        <div>
          <span class="metric-label">Combo Ask</span>
          <strong>${combo.buyFormula}</strong>
        </div>
        <div>
          <span class="metric-label">Combo Bid</span>
          <strong>${combo.sellFormula}</strong>
        </div>
      </div>
      <p class="combo-note">${note}</p>
    </article>
  `;
}

function buildContractNote(contract) {
  if (contract.bid == null && contract.ask == null) {
    return "Enter a best bid and/or lowest ask to compare executable prices against your fair value.";
  }

  if (contract.recommendation.action === "Hold") {
    return "Fair value sits inside the live quotes, so there is no immediate aggressive edge.";
  }

  const actionLabel = contract.recommendation.action === "Buy" ? "ask" : "bid";
  return `${contract.recommendation.action} at the ${actionLabel} because that gives you an estimated edge of ${formatPrice(
    contract.actionableEdge
  )}. Size guide is based on edge relative to model sigma.`;
}

function buildComboNote(combo) {
  if (combo.bid == null && combo.ask == null) {
    return "Enter enough live bids and asks to build synthetic combo quotes from the legs.";
  }

  if (combo.recommendation.action === "Hold") {
    return "The synthetic combo bid/ask brackets your fair value, so there is no immediate combo edge.";
  }

  const actionLabel = combo.recommendation.action === "Buy" ? "combo ask" : "combo bid";
  return `${combo.recommendation.action} the combo at the ${actionLabel} because the synthetic edge is ${formatPrice(
    combo.actionableEdge
  )}. Cheap legs buy the combo; rich legs sell it.`;
}

function buildShiftedProbabilityArray(counts, offset, finalLength, remaining) {
  const probabilities = Array(finalLength).fill(0);
  const totalOutcomes = POWERS_OF_20[remaining];

  counts.forEach((count, index) => {
    if (count === 0) {
      return;
    }

    probabilities[offset + index] = count / totalOutcomes;
  });

  return probabilities;
}

function compareOrdinalProbabilityArrays(leftProbabilities, rightProbabilities) {
  let rightLess = 0;
  let win = 0;
  let tie = 0;

  for (let index = 0; index < Math.max(leftProbabilities.length, rightProbabilities.length); index += 1) {
    const left = leftProbabilities[index] || 0;
    const right = rightProbabilities[index] || 0;

    if (left > 0) {
      win += left * rightLess;
      tie += left * right;
    }

    rightLess += right;
  }

  return normalizedThreeWay(win, tie);
}

function compareSortedProbabilityMaps(leftMap, rightMap) {
  const leftEntries = Array.from(leftMap.entries()).sort((a, b) => a[0] - b[0]);
  const rightEntries = Array.from(rightMap.entries()).sort((a, b) => a[0] - b[0]);
  const rightLookup = new Map(rightEntries);

  let rightLess = 0;
  let rightIndex = 0;
  let win = 0;
  let tie = 0;

  leftEntries.forEach(([value, probability]) => {
    while (rightIndex < rightEntries.length && rightEntries[rightIndex][0] < value) {
      rightLess += rightEntries[rightIndex][1];
      rightIndex += 1;
    }

    win += probability * rightLess;
    tie += probability * (rightLookup.get(value) || 0);
  });

  return normalizedThreeWay(win, tie);
}

function spreadProbability(sumDistributionA, sumDistributionB, threshold) {
  let probability = 0;

  for (let a = 0; a < sumDistributionA.length; a += 1) {
    const probabilityA = sumDistributionA[a];
    if (probabilityA === 0) {
      continue;
    }

    for (let b = 0; b < sumDistributionB.length; b += 1) {
      const probabilityB = sumDistributionB[b];
      if (probabilityB === 0) {
        continue;
      }

      if (Math.abs(a - b) >= threshold) {
        probability += probabilityA * probabilityB;
      }
    }
  }

  return clampProbability(probability);
}

function threeWayResult(winProbability, tieProbability) {
  const win = clampProbability(winProbability);
  const tie = clampProbability(tieProbability);
  const lose = clampProbability(1 - win - tie);

  return {
    fairValue: 100 * win + 50 * tie,
    resolutions: [
      { payout: 0, probability: lose },
      { payout: 50, probability: tie },
      { payout: 100, probability: win },
    ],
  };
}

function binaryResult(yesProbability) {
  const yes = clampProbability(yesProbability);
  const no = clampProbability(1 - yes);

  return {
    fairValue: 100 * yes,
    resolutions: [
      { payout: 0, probability: no },
      { payout: 100, probability: yes },
    ],
  };
}

function normalizedThreeWay(win, tie) {
  const loss = Math.max(0, 1 - win - tie);
  const total = win + tie + loss;

  if (total === 0) {
    return { win: 0, tie: 0, loss: 0 };
  }

  return {
    win: win / total,
    tie: tie / total,
    loss: loss / total,
  };
}

function clampProbability(value) {
  if (Number.isNaN(value)) {
    return 0;
  }
  return Math.min(1, Math.max(0, value));
}

function renderResolutionRow(resolution) {
  const className = resolution.payout === 50 ? "fill-50" : resolution.payout === 100 ? "fill-100" : "fill-0";
  const width = `${(resolution.probability * 100).toFixed(2)}%`;

  return `
    <div class="resolution-row">
      <span>$${resolution.payout}</span>
      <div class="resolution-track">
        <div class="resolution-fill ${className}" style="width: ${width};"></div>
      </div>
      <span class="resolution-probability">${formatProbability(resolution.probability)}</span>
    </div>
  `;
}

function formatProbability(probability) {
  return `${(probability * 100).toFixed(2)}%`;
}

function computeAuctionPenalty(totalBid) {
  return totalBid === 0 ? 0 : totalBid ** AUCTION_PHI_EXPONENT / 100;
}

function formatPrice(value) {
  return `$${value.toFixed(2)}`;
}

function formatInteger(value) {
  return INTEGER_FORMATTER.format(value);
}

function formatPlainNumber(value) {
  return DECIMAL_FORMATTER.format(value);
}

function formatSignedPlainNumber(value) {
  const sign = value >= 0 ? "+" : "-";
  return `${sign}${formatPlainNumber(Math.abs(value))}`;
}

function renderSignedPlainNumber(value) {
  const stateClass = value > 0 ? "is-positive" : value < 0 ? "is-negative" : "is-neutral";
  return `<span class="signed-number ${stateClass}">${formatSignedPlainNumber(value)}</span>`;
}

function formatSignedPrice(value) {
  const sign = value >= 0 ? "+" : "-";
  return `${sign}$${Math.abs(value).toFixed(2)}`;
}

function formatNumber(value) {
  return value.toFixed(2);
}

function precomputeSumTables() {
  const tables = [[1]];

  for (let remaining = 1; remaining <= OCTO_TOTAL_ROLLS; remaining += 1) {
    const previous = tables[remaining - 1];
    const current = Array(remaining * 20 + 1).fill(0);

    previous.forEach((count, sum) => {
      if (count === 0) {
        return;
      }

      for (let face = 1; face <= 20; face += 1) {
        current[sum + face] += count;
      }
    });

    tables.push(current);
  }

  return tables;
}

function precomputeOddTables() {
  const tables = [[1]];

  for (let remaining = 1; remaining <= OCTO_TOTAL_ROLLS; remaining += 1) {
    const previous = tables[remaining - 1];
    const current = Array(remaining + 1).fill(0);

    previous.forEach((count, oddCount) => {
      current[oddCount] += count * 10;
      current[oddCount + 1] += count * 10;
    });

    tables.push(current);
  }

  return tables;
}

function precomputeDivisorStateTables() {
  let currentStates = [[0, 1]];
  const tables = [currentStates.map(([key, count]) => [...decodeExponentKey(key), count])];

  for (let remaining = 1; remaining <= OCTO_TOTAL_ROLLS; remaining += 1) {
    const nextMap = new Map();

    currentStates.forEach(([key, count]) => {
      const base = decodeExponentKey(key);

      FACE_EXPONENTS.forEach((face) => {
        const nextKey = encodeExponentKey([
          base[0] + face[0],
          base[1] + face[1],
          base[2] + face[2],
          base[3] + face[3],
          base[4] + face[4],
          base[5] + face[5],
          base[6] + face[6],
          base[7] + face[7],
        ]);

        nextMap.set(nextKey, (nextMap.get(nextKey) || 0) + count);
      });
    });

    currentStates = Array.from(nextMap.entries());
    tables.push(currentStates.map(([key, count]) => [...decodeExponentKey(key), count]));
  }

  return tables;
}

function buildDivisorProbabilityMap(observedExponents, remaining) {
  const cacheKey = `${remaining}:${observedExponents.join(",")}`;
  const cached = divisorDistributionCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const distribution = new Map();
  const totalOutcomes = POWERS_OF_20[remaining];
  const states = divisorStateTables[remaining];

  states.forEach((state) => {
    let divisorCount = 1;

    for (let index = 0; index < PRIMES.length; index += 1) {
      divisorCount *= observedExponents[index] + state[index] + 1;
    }

    distribution.set(divisorCount, (distribution.get(divisorCount) || 0) + state[8] / totalOutcomes);
  });

  divisorDistributionCache.set(cacheKey, distribution);
  return distribution;
}

function primeExponentsForRoll(value) {
  let remainder = value;
  const exponents = [];

  PRIMES.forEach((prime) => {
    let count = 0;
    while (remainder % prime === 0) {
      remainder /= prime;
      count += 1;
    }
    exponents.push(count);
  });

  return exponents;
}

function encodeExponentKey(exponents) {
  let key = 0;
  let multiplier = 1;

  exponents.forEach((exponent, index) => {
    key += exponent * multiplier;
    multiplier *= RADICES[index];
  });

  return key;
}

function decodeExponentKey(key) {
  const exponents = [];
  let remainder = key;

  RADICES.forEach((radix) => {
    exponents.push(remainder % radix);
    remainder = Math.floor(remainder / radix);
  });

  return exponents;
}

function divisorCountFromExponents(exponents) {
  return exponents.reduce((product, exponent) => product * (exponent + 1), 1);
}

function precomputeTripletsStates() {
  const states = [];
  const counts = Array(TRIPLETS_VALUE_COUNT).fill(0);

  function recurse(index, remainingFaces) {
    if (index === TRIPLETS_VALUE_COUNT - 1) {
      counts[index] = remainingFaces;
      states.push(buildTripletsState(counts));
      return;
    }

    for (let faceCount = 0; faceCount <= remainingFaces; faceCount += 1) {
      counts[index] = faceCount;
      recurse(index + 1, remainingFaces - faceCount);
    }
  }

  recurse(0, TRIPLETS_FACE_COUNT);
  return states;
}

function buildTripletsState(countVector) {
  const counts = [...countVector];
  const multinomialDenominator = counts.reduce((product, count) => product * FACTORIALS[count], 1);
  const priorWeight = FACTORIALS[TRIPLETS_FACE_COUNT] / (multinomialDenominator * TRIPLETS_PRIOR_DENOMINATOR);

  let rollMean = 0;
  let rollSecondMoment = 0;

  counts.forEach((count, index) => {
    const value = index + 1;
    const probability = count / TRIPLETS_FACE_COUNT;
    rollMean += value * probability;
    rollSecondMoment += value * value * probability;
  });

  return {
    counts,
    priorWeight,
    rollMean,
    rollSecondMoment,
  };
}
