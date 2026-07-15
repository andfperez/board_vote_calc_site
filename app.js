const voteTable = document.querySelector("#vote-table");
const resetButton = document.querySelector("#reset-button");
const captureButton = document.querySelector("#capture-button");
const appShell = document.querySelector(".app-shell");
const investmentNameInput = document.querySelector("#investment-name");

const supportTotal = document.querySelector("#support-total");
const approvalTotal = document.querySelector("#approval-total");
const abstainTotal = document.querySelector("#abstain-total");
const objectTotal = document.querySelector("#object-total");

const STORAGE_KEY = "board-vote-calculator-state";
const INVESTMENT_NAME_KEY = "board-vote-calculator-investment-name";

const positions = {
  support: {
    label: "Support",
    className: "position-support",
  },
  comment: {
    label: "Comments",
    className: "position-comment",
  },
  abstain: {
    label: "Abstain",
    className: "position-abstain",
  },
  object: {
    label: "Object",
    className: "position-object",
  },
};

let voteState = loadState();

function loadState() {
  const savedState = localStorage.getItem(STORAGE_KEY);

  if (!savedState) {
    return {};
  }

  try {
    const parsedState = JSON.parse(savedState);

    if (
      !parsedState ||
      typeof parsedState !== "object" ||
      Array.isArray(parsedState)
    ) {
      localStorage.removeItem(STORAGE_KEY);
      return {};
    }

    const validConstituencyIds = new Set(
      constituencies.map((constituency) => constituency.id)
    );

    const validPositions = new Set([
      "support",
      "comment",
      "abstain",
      "object",
    ]);

    const cleanedState = {};

    Object.entries(parsedState).forEach(([constituencyId, position]) => {
      if (
        validConstituencyIds.has(constituencyId) &&
        validPositions.has(position) &&
        position !== "support"
      ) {
        cleanedState[constituencyId] = position;
      }
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanedState));

    return cleanedState;
  } catch (error) {
    console.warn("Saved voting scenario could not be loaded.", error);
    localStorage.removeItem(STORAGE_KEY);
    return {};
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(voteState));
}

function getPosition(constituencyId) {
  return voteState[constituencyId] ?? "support";
}

function setPosition(constituencyId, position) {
  if (position === "support") {
    delete voteState[constituencyId];
  } else {
    voteState[constituencyId] = position;
  }

  saveState();
function loadInvestmentName() {
  const savedName = localStorage.getItem(INVESTMENT_NAME_KEY);

  if (savedName) {
    investmentNameInput.value = savedName;
  }
}

function saveInvestmentName() {
  const investmentName = investmentNameInput.value.trim();

  if (investmentName) {
    localStorage.setItem(INVESTMENT_NAME_KEY, investmentName);
  } else {
    localStorage.removeItem(INVESTMENT_NAME_KEY);
  }
}

  render();
}

function calculateTotals() {
  const totals = {
    support: 0,
    comment: 0,
    abstain: 0,
    object: 0,
  };

  constituencies.forEach((constituency) => {
    const position = getPosition(constituency.id);
    totals[position] += constituency.votingPower;
  });

  return totals;
}

function formatPercentage(value) {
  return `${value.toFixed(2)}%`;
}

function createPositionSelect(constituency) {
  const select = document.createElement("select");
  const currentPosition = getPosition(constituency.id);

  select.className = `position-select ${positions[currentPosition].className}`;
  select.setAttribute(
    "aria-label",
    `Position for ${constituency.name}`
  );

  Object.entries(positions).forEach(([value, details]) => {
    const option = document.createElement("option");

    option.value = value;
    option.textContent = details.label;
    option.selected = value === currentPosition;

    select.appendChild(option);
  });

  select.addEventListener("change", (event) => {
    setPosition(constituency.id, event.target.value);
  });

  return select;
}

function createVoteRow(constituency) {
  const row = document.createElement("div");
  row.className = "vote-row";

  const constituencyCell = document.createElement("div");
  constituencyCell.className = "constituency-cell";

  const code = document.createElement("span");
  code.className = "constituency-code";
  code.textContent = constituency.id;

  const name = document.createElement("strong");
  name.textContent = constituency.name;

  constituencyCell.append(code, name);

  const votingPowerCell = document.createElement("div");
  votingPowerCell.className = "voting-power-cell";
  votingPowerCell.textContent = constituency.votingPower.toFixed(2);

  const positionCell = document.createElement("div");
  positionCell.className = "position-cell";
  positionCell.appendChild(createPositionSelect(constituency));

  row.append(
    constituencyCell,
    votingPowerCell,
    positionCell
  );

  return row;
}

function renderSummary() {
  const totals = calculateTotals();

  const supportVotingPower = totals.support + totals.comment;
  const votesCast = supportVotingPower + totals.object;

  const approvalPercentage =
    votesCast > 0
      ? (supportVotingPower / votesCast) * 100
      : 0;

  supportTotal.textContent = formatPercentage(supportVotingPower);
  approvalTotal.textContent = formatPercentage(approvalPercentage);
  abstainTotal.textContent = formatPercentage(totals.abstain);
  objectTotal.textContent = formatPercentage(totals.object);
}

function renderTable() {
  voteTable.innerHTML = "";

  constituencies.forEach((constituency) => {
    voteTable.appendChild(createVoteRow(constituency));
  });
}

function render() {
  renderSummary();
  renderTable();
}

function render() {
  renderSummary();
  renderTable();
}

function createSnapshotFilename() {
  const investmentName = investmentNameInput?.value.trim();
  const baseName = investmentName || "voting-scenario";

  const safeName = baseName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const date = new Date().toISOString().slice(0, 10);

  return `${safeName || "voting-scenario"}-${date}.png`;
}

async function captureScenario() {
  if (!window.html2canvas || !appShell) {
    window.alert("The snapshot function could not be loaded.");
    return;
  }

  const originalButtonText = captureButton.textContent;

  try {
    captureButton.disabled = true;
    captureButton.textContent = "Creating…";
    document.body.classList.add("is-capturing");

    await new Promise((resolve) => {
      window.requestAnimationFrame(resolve);
    });

    const canvas = await window.html2canvas(appShell, {
      backgroundColor: "#eef3f8",
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const downloadLink = document.createElement("a");

    downloadLink.download = createSnapshotFilename();
    downloadLink.href = canvas.toDataURL("image/png");
    downloadLink.click();
  } catch (error) {
    console.error("The snapshot could not be created.", error);
    window.alert("The snapshot could not be created.");
  } finally {
    document.body.classList.remove("is-capturing");
    captureButton.disabled = false;
    captureButton.textContent = originalButtonText;
  }
}

captureButton.addEventListener("click", captureScenario);

resetButton.addEventListener("click", () => {
  voteState = {};
  localStorage.removeItem(STORAGE_KEY);
  render();
});

// Render the voting table immediately when the page loads.
render();

// Load and activate the investment-name field separately.
if (investmentNameInput) {
  loadInvestmentName();
  investmentNameInput.addEventListener("input", saveInvestmentName);
} else {
  console.warn("Investment name input was not found.");
}