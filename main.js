import { generateReturnArray } from "./src/investmentGoals";
import { Chart } from "chart.js/auto";
import { createTable } from "./src/table";

const finalMoneyChart = document.getElementById("final-money-distribution");
const progressionChart = document.getElementById("progression");
const form = document.getElementById("investment-form");
const clearFormBtn = document.getElementById("clear-form");
let doughnutChartReference = {};
let progressionChartReference = {};

const columnsArray = [
  { columnLabel: "Mês", accessor: "month" },
  {
    columnLabel: "Total investido",
    accessor: "investedAmount",
    format: (numberInfo) => formatCurrencyToTable(numberInfo),
  },
  {
    columnLabel: "Rendimento mensal",
    accessor: "interestReturns",
    format: (numberInfo) => formatCurrencyToTable(numberInfo),
  },
  {
    columnLabel: "Redimento total",
    accessor: "totalInterestReturns",
    format: (numberInfo) => formatCurrencyToTable(numberInfo),
  },
  {
    columnLabel: "Quantia total",
    accessor: "totalAmount",
    format: (numberInfo) => formatCurrencyToTable(numberInfo),
  },
];

function formatCurrencyToTable(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatCurrencyToGraph(value) {
  return value.toFixed(2);
}

function renderProgression(evt) {
  evt.preventDefault();
  if (document.querySelector(".error")) {
    return;
  }

  resetCharts();

  // const startingAmount = Number(form['starting-amount'].value)

  const startingAmount = Number(
    document.getElementById("starting-amount").value.replace(",", ".")
  );
  const additionalContribution = Number(
    document.getElementById("additional-contribution").value.replace(",", ".")
  );
  const timeAmount = Number(document.getElementById("time-amount").value);
  const timeAmountPeriod = document.getElementById("time-amount-period").value;
  const returnRate = Number(
    document.getElementById("return-rate").value.replace(",", ".")
  );
  const returnRatePeriod = document.getElementById("evaluation-period").value;
  const taxRate = Number(
    document.getElementById("tax-rate").value.replace(",", ".")
  );

  const returnsArray = generateReturnArray(
    startingAmount,
    timeAmount,
    timeAmountPeriod,
    additionalContribution,
    returnRate,
    returnRatePeriod
  );

  const finalInvestmentObject = returnsArray[returnsArray.length - 1];

  doughnutChartReference = new Chart(finalMoneyChart, {
    type: "doughnut",
    data: {
      labels: ["Total investido", "Rendimento", "Imposto"],
      datasets: [
        {
          data: [
            formatCurrencyToGraph(finalInvestmentObject.investedAmount),

            formatCurrencyToGraph(
              finalInvestmentObject.totalInterestReturns * (1 - taxRate / 100)
            ),

            formatCurrencyToGraph(
              finalInvestmentObject.totalInterestReturns * (taxRate / 100)
            ),
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: true,
          labels: {
            color: "#fff",
          },
        },
      },
    },
  });

  progressionChartReference = new Chart(progressionChart, {
    type: "bar",
    data: {
      labels: returnsArray.map((investmentObject) => investmentObject.month),
      datasets: [
        {
          label: "Total Investido",
          data: returnsArray.map((investmentObject) =>
            formatCurrencyToGraph(investmentObject.investedAmount)
          ),
        },
        {
          label: "Retorno do Investimento",
          data: returnsArray.map((investmentObject) =>
            formatCurrencyToGraph(investmentObject.interestReturns)
          ),
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: true,
          labels: {
            color: "#fff",
          },
        },
      },
      responsive: true,
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: "#fff",
          },
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
          },
        },
        y: {
          stacked: true,
          ticks: {
            color: "#fff",
          },
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
          },
        },
      },
    },
  });

  createTable(columnsArray, returnsArray, "results-table");
}

function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function resetCharts() {
  if (
    !isObjectEmpty(doughnutChartReference) &&
    !isObjectEmpty(progressionChartReference)
  ) {
    doughnutChartReference.destroy();
    progressionChartReference.destroy();
  }
}

function clearForm() {
  form["starting-amount"].value = "";
  form["additional-contribution"].value = "";
  form["time-amount"].value = "";
  form["return-rate"].value = "";
  form["tax-rate"].value = "";

  resetCharts();

  const clearErrorInputs = document.querySelectorAll(".error");

  for (const clearErrorInput of clearErrorInputs) {
    clearErrorInput.classList.remove("error");
    clearErrorInput.parentElement.querySelector("p").remove();
  }
}

function validateInput(evt) {
  if (evt.target.value === "") {
    return;
  }

  const { parentElement } = evt.target;
  const grandParentElement = evt.target.parentElement.parentElement;
  const inputValue = evt.target.value.replace(",", ".");

  if (
    (!parentElement.classList.contains("error") && isNaN(inputValue)) ||
    Number(inputValue) <= 0
  ) {
    const errorTextElement = document.createElement("p");
    errorTextElement.classList.add("text-red-500");
    errorTextElement.innerText = "*Preencha o campo com um valor válido";

    parentElement.classList.add("error");
    grandParentElement.appendChild(errorTextElement);
  } else if (
    parentElement.classList.contains("error") &&
    !isNaN(inputValue) &&
    Number(inputValue) > 0
  ) {
    parentElement.classList.remove("error");
    grandParentElement.querySelector("p").remove();
  }
}

for (const formElement of form) {
  if (formElement.tagName === "INPUT" && formElement.hasAttribute("name")) {
    formElement.addEventListener("blur", validateInput);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const mainEl = document.querySelector("main");
  const carouselEl = document.getElementById("carousel");
  const nextBtn = document.getElementById("slide-arrow-next");
  const previousBtn = document.getElementById("slide-arrow-previous");

  previousBtn.style.display = "none";

  nextBtn.addEventListener("click", () => {
    carouselEl.scrollLeft += mainEl.clientWidth;
    nextBtn.style.display = "none"; // Esconde o botão "Próximo"
    previousBtn.style.display = "block";
  });

  previousBtn.addEventListener("click", () => {
    carouselEl.scrollLeft -= mainEl.clientWidth;
    previousBtn.style.display = "none"; // Esconde o botão "Anterior"
    nextBtn.style.display = "block";
  });
});

form.addEventListener("submit", renderProgression);
clearFormBtn.addEventListener("click", clearForm);
