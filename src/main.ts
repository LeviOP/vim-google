function handleMain(elm: HTMLDivElement): HTMLElement[][][] {
    const search = elm.querySelector<HTMLDivElement>("#search");
    if (search === null) throw Error("Couldn't find search element!");

    return handleSearch(search);
}

function handleSearch(search: HTMLDivElement): HTMLElement[][][] {
    const rso = search.querySelector<HTMLDivElement>("div > div#rso");
    if (rso === null) throw Error("Couldn't find rso!");

    const children = Array.from(rso.children).filter((child): child is HTMLDivElement => child instanceof HTMLDivElement);
    const searchSections = children.map(handleSection).filter((sections) => sections.length !== 0);

    return searchSections;
}

function handleSection(section: HTMLDivElement): HTMLElement[][] {
    const websiteTest = section.querySelector<HTMLDivElement>("div[data-ved] > div[data-snc]");
    if (websiteTest !== null) return handleWebsite(websiteTest);

    const largeWebsiteTest = section.querySelector<HTMLDivElement>("div:has(div):has(table)");
    if (largeWebsiteTest !== null) return handleLargeWebsite(largeWebsiteTest);

    const peopleAlsoAskTest = section.querySelector<HTMLDivElement>("div[data-initq]");
    if (peopleAlsoAskTest !== null) return handlePeopleAlsoAsk(peopleAlsoAskTest);

    return [];
}

function handleWebsite(div: HTMLDivElement): HTMLElement[][] {
    const levels = Array.from(div.querySelectorAll<HTMLDivElement>("div[data-snhf], div[data-sncf]"));
    return levels.reduce<HTMLElement[][]>((a, level) => {
        const anchorGroups = level.querySelectorAll<HTMLElement>(":has(> a):not(:has(> a > div > img))");
        anchorGroups.forEach((group) => {
            a.push(Array.from(group.querySelectorAll("a")));
        });
        return a;
    }, []);
}

function handleLargeWebsite(div: HTMLDivElement): HTMLElement[][] {
    return Array.from(div.querySelectorAll("a")).map((a) => ([a]));
}

function handlePeopleAlsoAsk(div: HTMLDivElement): HTMLElement[][] {
    console.log("question:", div);
    return [];
}

let sectionIndex: number = -1;
let levelIndex: number = -1;
let rowIndex: number = 0;
let selectedElement: HTMLElement | undefined;

function main() {
    const topAd = document.querySelector<HTMLDivElement>("div#center_col > div#taw");
    if (topAd === null) console.log("Didn't find top ad element!");

    const main = document.querySelector<HTMLDivElement>("div#center_col > div#res");
    if (main === null) return console.log("Didn't find main element!");

    console.time("sections");
    const sections = handleMain(main);
    console.timeEnd("sections");

    document.addEventListener("keydown", (e) => {
        console.log(e);
        if (e.target instanceof HTMLTextAreaElement) return;
        if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;

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

function focusElement(sections: HTMLElement[][][]) {
    console.log(sectionIndex, levelIndex, rowIndex);
    const element = sections[sectionIndex]?.[levelIndex]?.[rowIndex];
    if (element === undefined) return;
    if (selectedElement !== undefined) selectedElement.style.background = "";
    selectedElement = element;
    element.focus();
    element.style.background = "#0ef5";
    element.scrollIntoView({
        block: "center",
        behavior: "smooth"
    });
}

main();

function down(sections: HTMLElement[][][]) {
    if (sectionIndex === -1) {
        sectionIndex = 0;
        levelIndex = 0;
        return;
    }

    const section = sections[sectionIndex]!;

    if (levelIndex + 1 >= section.length) {
        if (sectionIndex + 1 >= sections.length) return;
        sectionIndex++;
        levelIndex = 0;
    } else {
        levelIndex++;
    }
    rowIndex = 0;
}

function up(sections: HTMLElement[][][]) {
    if (sectionIndex === -1) {
        sectionIndex = 0;
        levelIndex = 0;
        return;
    }

    if (levelIndex === 0) {
        if (sectionIndex === 0) return;
        sectionIndex--;
        levelIndex = sections[sectionIndex]!.length - 1;
    } else {
        levelIndex--;
    }
    rowIndex = 0;
}

function right(sections: HTMLElement[][][]) {
    if (sectionIndex === -1) {
        sectionIndex = 0;
        levelIndex = 0;
        return;
    }

    const subSection = sections[sectionIndex]![levelIndex]!;

    if (rowIndex + 1 >= subSection.length) {
        rowIndex = 0;
    } else {
        rowIndex++;
    }
}

function left(sections: HTMLElement[][][]) {
    if (sectionIndex === -1) {
        sectionIndex = 0;
        levelIndex = 0;
        return;
    }

    const subSection = sections[sectionIndex]![levelIndex]!;

    if (rowIndex === 0) {
        rowIndex = subSection.length - 1;
    } else {
        rowIndex--;
    }
}
