const voteTable = document.querySelector("#vote-table");
const resetButton = document.querySelector("#reset-button");

const supportTotal = document.querySelector("#support-total");
const commentTotal = document.querySelector("#comment-total");
const abstainTotal = document.querySelector("#abstain-total");
const objectTotal = document.querySelector("#object-total");

const STORAGE_KEY = "board-vote-calculator-state";

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
    return JSON.parse(savedState);
  } catch {
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

  supportTotal.textContent = formatPercentage(
    totals.support + totals.comment
  );

  commentTotal.textContent = formatPercentage(totals.comment);
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

resetButton.addEventListener("click", () => {
  voteState = {};
  localStorage.removeItem(STORAGE_KEY);
  render();
});

render();