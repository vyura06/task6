"use strict";

const region = document.getElementById("region"),
  errors = document.getElementById("errors"),
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
errors.addEventListener("change", generator);
seed.addEventListener("change", generator);
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
  errors.value = +errors.value ?? 0;
  seed.value = +seed.value ?? 0;
  const data = await getData(page);
  fillTable(data);
}

async function getData(page) {
  const data =
    await fetch("/data?" +
      `page=${page}&` +
      `seed=${seed.value}&` +
      `errors=${errors.value}&` +
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
