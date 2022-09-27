"use strict";

const { faker } = require("@faker-js/faker");
const dataUglifyService = require("./data-uglify.service");
dataUglifyService.randomizeFn = faker.mersenne.rand;

const setSeed = seed => faker.seed(seed);
const setLocale = locale => faker.setLocale(locale);
const setErrors = errorsPercentage =>
  dataUglifyService.ErrorsCount = errorsPercentage;

const getAddress = () => ({
  city: faker.address.city(),
  street: faker.address.streetAddress(true),
});

const getPhone = () => faker.phone.phoneNumber();

const getNextPage = page => {
  const rows = [];

  for (let i = (page - 1) * 20; i < page * 20; i++) {
    const id = faker.mersenne.rand(1000000, 100000);
    const fullName = faker.name.findName();
    const address = Object.values(getAddress()).join(", ");
    const phone = getPhone();

    const row = {
      index: i + 1,
      id,
      fullName,
      address,
      phone
    };

    rows.push(row);
  }

  rows.map(row => {
    [row.fullName, row.address, row.phone] =
      dataUglifyService.uglify(
        [row.fullName, row.address, row.phone], faker.locale
      );
    return row;
  });

  return rows;
};

module.exports = {
  setSeed,
  setLocale,
  setErrors,
  getNextPage,
};