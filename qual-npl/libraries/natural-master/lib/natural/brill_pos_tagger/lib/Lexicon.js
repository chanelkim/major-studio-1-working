/*
  Lexicon class
  Copyright (C) 2019 Hugo W.L. ter Doest

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

'use strict'

const englishLexicon = require('../data/English/lexicon_from_posjs.json')
const dutchLexicon = require('../data/Dutch/brill_Lexicon.json')

const DEBUG = false

// Constructor creates a Lexicon for language
function Lexicon (language, defaultCategory, defaultCategoryCapitalised, extendedLexicon) {
  const lexicon = (() => {
    switch (language) {
      case 'EN':
        return englishLexicon
      case 'DU':
        return dutchLexicon
      default:
        return dutchLexicon
    }
  })()

  this.lexicon = Object.assign(lexicon, extendedLexicon || {})

  if (defaultCategory) {
    this.defaultCategory = defaultCategory
    if (defaultCategoryCapitalised) {
      this.defaultCategoryCapitalised = defaultCategoryCapitalised
    }
  }
}

// Parses a lexicon in text format: word cat1 cat2 ... catn
Lexicon.prototype.parseLexicon = function (data) {
  // Split into an array of non-empty lines
  const arrayOfLines = data.match(/[^\r\n]+/g)
  this.lexicon = {} // Object.create(null);
  const that = this
  arrayOfLines.forEach(function (line) {
    // Split line by whitespace
    const elements = line.trim().split(/\s+/)
    if (elements.length > 0) {
      that.lexicon[elements[0]] = elements.slice(1)
    }
  })
}

Lexicon.prototype.tagWordWithDefaults = function (word) {
  if (/[A-Z]/.test(word[0]) && this.defaultCategoryCapitalised) {
    // Capitalised
    return this.defaultCategoryCapitalised
  } else {
    // If not found assign default_category
    return this.defaultCategory
  }
}

// Returns a list of categories for word
Lexicon.prototype.tagWord = function (word) {
  let categories = this.lexicon[word]
  DEBUG && console.log(categories)
  if (!categories || (typeof categories === 'function')) {
    categories = this.lexicon[word.toLowerCase()]
  }
  if (!categories || (typeof categories === 'function')) {
    categories = [this.tagWordWithDefaults(word)]
  }
  return (categories)
}

// Adds a word to the lexicon. NB simply replaces the entry
Lexicon.prototype.addWord = function (word, categories) {
  this.lexicon[word] = categories
}

Lexicon.prototype.prettyPrint = function () {
  let result = ''
  const that = this
  Object.keys(this.lexicon).forEach(function (token) {
    result += token + '\t'
    that.lexicon[token].forEach(function (cat) {
      result += cat + '\t'
    })
    result += '\n'
  })
  return result
}

Lexicon.prototype.nrEntries = function () {
  return Object.keys(this.lexicon).length
}

Lexicon.prototype.size = function () {
  return this.nrEntries()
}

Lexicon.prototype.setDefaultCategories = function (category, categoryCapitalised) {
  this.defaultCategory = category
  if (categoryCapitalised) {
    this.defaultCategoryCapitalised = categoryCapitalised
  }
}

module.exports = Lexicon
