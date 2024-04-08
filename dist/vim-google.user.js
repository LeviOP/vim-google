// ==UserScript==
// @name         vim-google
// @namespace    https://github.com/LeviOP
// @version      0.1.1
// @author       LeviOP
// @license      GPL-3.0-only
// @downloadURL  https://raw.githubusercontent.com/LeviOP/vim-google/main/dist/vim-google.user.js
// @updateURL    https://raw.githubusercontent.com/LeviOP/vim-google/main/dist/vim-google.user.js
// @match        *://www.google.com/search*
// ==/UserScript==

(function () {
  'use strict';

  function handleMain(elm) {
    const search = elm.querySelector("#search");
    if (search === null)
      throw Error("Couldn't find search element!");
    return handleSearch(search);
  }
  function handleSearch(search) {
    const rso = search.querySelector("div > div#rso");
    if (rso === null)
      throw Error("Couldn't find rso!");
    const children = Array.from(rso.children).filter((child) => child instanceof HTMLDivElement);
    const searchSections = children.map(handleSection).filter((sections) => sections.length !== 0);
    return searchSections;
  }
  function handleSection(section) {
    const websiteTest = section.querySelector("div[data-ved] > div[data-snc]");
    if (websiteTest !== null)
      return handleWebsite(websiteTest);
    const largeWebsiteTest = section.querySelector("div:has(div):has(table)");
    if (largeWebsiteTest !== null)
      return handleLargeWebsite(largeWebsiteTest);
    const websiteQuoteTest = section.querySelector("div > block-component");
    if (websiteQuoteTest !== null)
      return handleWebsiteQuote(websiteQuoteTest);
    const peopleAlsoAskTest = section.querySelector("div[data-initq]");
    if (peopleAlsoAskTest !== null)
      return handlePeopleAlsoAsk(peopleAlsoAskTest);
    console.log("Don't know what this is!", section);
    return [];
  }
  function handleWebsite(div) {
    console.log("handleWebsite");
    const levels = Array.from(div.querySelectorAll("div[data-snhf], div[data-sncf]"));
    return levels.reduce((a, level) => {
      const anchorGroups = level.querySelectorAll("span:has(> a), div:has(> a + *)");
      anchorGroups.forEach((group) => {
        a.push(Array.from(group.querySelectorAll("a")));
      });
      return a;
    }, []);
  }
  function handleLargeWebsite(div) {
    console.log("handleLargeWebsite");
    return Array.from(div.querySelectorAll("a")).map((a) => [a]);
  }
  function handleWebsiteQuote(div) {
    console.log("handleWebsiteQuote");
    const anchor = div.querySelector("a:has(h3)");
    if (anchor === null)
      return [];
    return [[anchor]];
  }
  function handlePeopleAlsoAsk(div) {
    console.log("question:", div);
    return [];
  }
  let sectionIndex = -1;
  let levelIndex = -1;
  let rowIndex = 0;
  let selectedElement;
  function main() {
    const topAd = document.querySelector("div#center_col > div#taw");
    if (topAd === null)
      console.log("Didn't find top ad element!");
    const main2 = document.querySelector("div#center_col > div#res");
    if (main2 === null)
      return console.log("Didn't find main element!");
    console.time("sections");
    const sections = handleMain(main2);
    console.timeEnd("sections");
    document.addEventListener("keydown", (e) => {
      console.log(e);
      if (e.target instanceof HTMLTextAreaElement)
        return;
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey)
        return;
      if (e.key === "j") {
        down(sections);
      } else if (e.key === "k") {
        up(sections);
      } else if (e.key === "l") {
        right(sections);
      } else if (e.key === "h") {
        left(sections);
      } else {
        return;
      }
      focusElement(sections);
      e.preventDefault();
    });
  }
  function focusElement(sections) {
    var _a, _b;
    console.log(sectionIndex, levelIndex, rowIndex);
    const element = (_b = (_a = sections[sectionIndex]) == null ? void 0 : _a[levelIndex]) == null ? void 0 : _b[rowIndex];
    if (element === void 0)
      return;
    if (selectedElement !== void 0)
      selectedElement.style.background = "";
    selectedElement = element;
    element.focus({
      preventScroll: true
    });
    element.style.background = "#0ef5";
    element.scrollIntoView({
      block: "center",
      behavior: "smooth"
    });
  }
  main();
  function down(sections) {
    if (sectionIndex === -1) {
      sectionIndex = 0;
      levelIndex = 0;
      return;
    }
    const section = sections[sectionIndex];
    if (levelIndex + 1 >= section.length) {
      if (sectionIndex + 1 >= sections.length)
        return;
      sectionIndex++;
      levelIndex = 0;
    } else {
      levelIndex++;
    }
    rowIndex = 0;
  }
  function up(sections) {
    if (sectionIndex === -1) {
      sectionIndex = 0;
      levelIndex = 0;
      return;
    }
    if (levelIndex === 0) {
      if (sectionIndex === 0)
        return;
      sectionIndex--;
      levelIndex = sections[sectionIndex].length - 1;
    } else {
      levelIndex--;
    }
    rowIndex = 0;
  }
  function right(sections) {
    if (sectionIndex === -1) {
      sectionIndex = 0;
      levelIndex = 0;
      return;
    }
    const subSection = sections[sectionIndex][levelIndex];
    if (rowIndex + 1 >= subSection.length) {
      rowIndex = 0;
    } else {
      rowIndex++;
    }
  }
  function left(sections) {
    if (sectionIndex === -1) {
      sectionIndex = 0;
      levelIndex = 0;
      return;
    }
    const subSection = sections[sectionIndex][levelIndex];
    if (rowIndex === 0) {
      rowIndex = subSection.length - 1;
    } else {
      rowIndex--;
    }
  }

})();