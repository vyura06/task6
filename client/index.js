"use strict";

const region = document.getElementById("region"),
  errors_control = document.getElementById("errors_control"),
  errors_range = document.getElementById("errors_range"),
  seed = document.getElementById("seed"),
  generateSeed = document.getElementById("generate-seed"),
  tbody = document.getElementById("tbody")

const random = () => Math.floor(Math.random() * (1e10 + 0) - 0);

let PAGE = 1;
let loading = false;
seed.value = random();

const generator = debounce(rerender);
generator();

region.addEventListener("change", generator);
errors_control.addEventListener("change", generator);
errors_range.addEventListener("change", generator);
seed.addEventListener("change", generator);
csv.addEventListener("click", downloadCSV);
generateSeed.addEventListener("click", () => {
  seed.value = random();
  generator();
});

function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), timeout);
  };
}

async function rerender() {
  loading = true;
  setTimeout(() => loading = false, 50);
  tbody.innerHTML = "";

  for (let i = 0; i < PAGE; i++) {
    await generate(i + 1);
  }
}

async function generate(page = PAGE) {
  errors_control.value = +errors_control.value ?? 0;
  errors_range.value = +errors_range.value ?? 0;
  seed.value = +seed.value ?? 0;
  const data = await getData(page);
  fillTable(data);
}

async function getData(page) {
  const data =
    await fetch("/data?" +
      `page=${page}&` +
      `seed=${seed.value}&` +
      `errors_control=${errors_control.value}&` +
      `errors_range=${errors_range.value}&` +
      `locale=${region.value}&`
    );
  return await data.json();
}

function fillTable(data) {
  for (const row of data) {
    const tr = createRow(row);
    tbody.appendChild(tr);
  }
}

async function downloadCSV() {
  const data = await fetch("/data/csv");
  const csv = await data.text();

  const link = document.createElement("a");
  link.id = "download-csv";
  link.setAttribute(
    "href", "data:text/plain;charset=utf-8," + encodeURIComponent(csv)
  );
  link.setAttribute("download", "faker.csv");
  document.body.appendChild(link);
  document.querySelector("#download-csv").click();
  document.body.removeChild(link);
}

function createRow(row) {
  const tr = document.createElement("tr");

  for (const column in row) {
    const td = document.createElement("td");
    td.textContent = row[column];
    tr.appendChild(td);
  }

  return tr;
}

const check = debounce(checkNewPage);
window.addEventListener("scroll", () => {
  const {
    scrollTop,
    scrollHeight,
    clientHeight
  } = document.documentElement;

  check(scrollTop + clientHeight >= scrollHeight - 5 && !loading);
}, {
  passive: true
});

function checkNewPage(condition) {
  if (condition) {
    PAGE++;
    generate();
  }
}
