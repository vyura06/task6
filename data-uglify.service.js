"use strict";

class UglifyService {
  constructor() {
    this.errorsCount = 0;
    this.remainder = 0;
    this.possibleError = 0;
    this.randomizeFn = Math.random;
    this.uglifyMethods = [
      this.addRandomSymbol,
      this.deleteRandomSymbol,
      this.swapNearSymbols
    ];

    this.symbols = [].concat(
      getCharsByCodes(48, 57),
      getCharsByCodes(65, 90),
      getCharsByCodes(97, 122),
    );
  }

  set ErrorsCount(realNumber) {
    this.errorsCount = Math.floor(realNumber);
    this.remainder = realNumber - this.errorsCount;
  }

  set PossibleError(probability) {
    this.possibleError = probability < this.remainder ? 1 : 0;
  }

  set Locale(locale) {
    this.symbols = [].concat(getCharsByCodes(48, 57));

    if (locale === "ru") {
      this.symbols = [].concat(
        getCharsByCodes(1040, 1103),
      );
    } else {
      this.symbols = [].concat(
        getCharsByCodes(65, 90),
        getCharsByCodes(97, 122),
      );
    }
  }

  addRandomSymbol(strArr, index) {
    const symbolToAdd =
      this.symbols[this.randomizeFn(this.symbols.length, 0)];

    strArr.splice(index, 0, symbolToAdd);
    return strArr;
  }

  deleteRandomSymbol(strArr, index) {
    strArr.splice(index, 1);
    return strArr;
  }

  swapNearSymbols(strArr, index) {
    const nearSymbols = strArr.splice(index, 2).reverse();
    strArr.splice(index, 0, ...nearSymbols);
    return strArr;
  }

  uglifyString(str) {
    const uglifyMethodIndex = this.randomizeFn(3, 0);
    const indexToUglify = this.randomizeFn(str.length - 1, 0);
    const strArr = str.split("");

    const result =
      this.uglifyMethods[uglifyMethodIndex]
        .call(this, strArr, indexToUglify)
        .join("");

    return result;
  }

  uglify(data, locale) {
    const result = [...data];

    this.Locale = locale;
    this.PossibleError = this.randomizeFn(101, 0) / 100;

    for (let i = 0; i < this.errorsCount + this.possibleError; i++) {
      const indexToUglify = this.randomizeFn(result.length, 0);
      result[indexToUglify] = this.uglifyString(result[indexToUglify]);
    }

    return result;
  }
}

function getCharsByCodes(min, max) {
  const chars = [];
  for (let i = min; i < max + 1; i++)
    chars.push(String.fromCharCode(i));
  return chars;
}

module.exports = new UglifyService();
