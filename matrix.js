let matrix = document.getElementById("matrix");
let rowNames = cellData["rowNames"];
let nRows = rowNames.length;
let colNames = cellData["colNames"];
let nCols = colNames.length;
let title = document.getElementById("title");
title.innerHTML = cellData["title"];
let cells = cellData["cells"];
let var3Names = Object.keys(cells);
let currentVar3 = var3Names[0];
let plotImgs = {};
for (let var3IX = 0; var3IX < var3Names.length; var3IX++) {
    plotImgs[var3Names[var3IX]] = [];
}

function renderMatrix() {
    matrix.innerHTML = "";
    for (let colIX = 0; colIX < nCols; colIX++) {
        let colTitle = document.createElement("div");
        colTitle.className = "colTitle";
        colTitle.innerHTML = colNames[colIX];
        matrix.appendChild(colTitle);
    }
    for (let rowIX = 0; rowIX < nRows; rowIX++) {
        let rowTitle = document.createElement("div");
        rowTitle.className = "rowTitle";
        rowTitle.classList.add("startRow");
        matrix.appendChild(rowTitle);
        let rowTitleTxt = document.createElement("div");
        rowTitleTxt.className = "rowTitleTxt";
        rowTitleTxt.innerHTML = rowNames[rowIX];
        rowTitle.appendChild(rowTitleTxt);
        for (let colIX = 0; colIX < nCols; colIX++) {
            let container = document.createElement("div");
            container.className = "cell";
            matrix.appendChild(container);
            if (cells[currentVar3].length > rowIX && cells[currentVar3][rowIX].length > colIX) {
                let cellImages = document.createElement("div");
                cellImages.className = "images";
                container.appendChild(cellImages);
                let viewerLink = document.createElement("a");
                viewerLink.href = cells[currentVar3][rowIX][colIX]["viewer_link"];
                viewerLink.target = "_blank";
                cellImages.appendChild(viewerLink);
                let spatialImg = document.createElement("img");
                spatialImg.src = "img/" + cells[currentVar3][rowIX][colIX]["spatial_img"];
                spatialImg.className = "spatial";
                viewerLink.appendChild(spatialImg);
                plotType = 0;
                while (cells[currentVar3][rowIX][colIX]["plot_imgs"].length > plotType) {
                    if (plotType >= plotImgs[currentVar3].length) {
                        plotImgs[currentVar3].push([]);
                    }
                    let plotImg = document.createElement("img");
                    plotImg.src = "img/" + cells[currentVar3][rowIX][colIX]["plot_imgs"][plotType];
                    plotImg.className = "plot" + (plotType + 1);
                    plotImg.classList.add("plotImg");
                    viewerLink.appendChild(plotImg);
                    plotImgs[currentVar3][plotType].push(plotImg);
                    plotType++;
                }
            }
            else {
                container.innerHTML = "(" + rowIX + ", " + colIX + ")";
            }
        }
    }
}

function deselectViewBtns() {
    document.getElementById("spatialBtn").classList.remove("selected");
    document.getElementById("plot1Btn").classList.remove("selected");
    document.getElementById("plot2Btn").classList.remove("selected");
}

function showPlot(plotType) {
    for (let plotIX = 0; plotIX < plotImgs[currentVar3][plotType].length; plotIX++) {
        plotImgs[currentVar3][plotType][plotIX].classList.add("show");
    }
}

function hidePlots() {
    for (let plotType = 0; plotType < plotImgs[currentVar3].length; plotType++) {
        for (let plotIX = 0; plotIX < plotImgs[currentVar3][plotType].length; plotIX++) {
            plotImgs[currentVar3][plotType][plotIX].classList.remove("show");
        }
    }
}

function deselectVar3Btns() {
    document.getElementById("var3Btn1").classList.remove("selected");
    document.getElementById("var3Btn2").classList.remove("selected");
}

function setVar3(var3IX) {
    currentVar3 = var3Names[var3IX];
    renderMatrix();
}

function showSpatial() {
    deselectViewBtns();
    document.getElementById("spatialBtn").classList.add("selected");
    hidePlots();
}

function showPlot1() {
    deselectViewBtns();
    document.getElementById("plot1Btn").classList.add("selected");
    hidePlots();
    showPlot(0);
}

function showPlot2() {
    deselectViewBtns();
    document.getElementById("plot2Btn").classList.add("selected");
    hidePlots();
    showPlot(1);
}

function setVar3To1() {
    deselectVar3Btns();
    document.getElementById("var3Btn1").classList.add("selected");
    setVar3(0);
}

function setVar3To2() {
    deselectVar3Btns();
    document.getElementById("var3Btn2").classList.add("selected");
    setVar3(1);
}

function addVar3Btns() {
    let handlers = [
        setVar3To1,
        setVar3To2,
    ]
    let var3Btns = document.getElementById("var3Btns");
    for (let var3IX = 0; var3IX < var3Names.length; var3IX++) {
        let var3Btn = document.createElement("button");
        if (var3IX === 0) {
            var3Btn.classList.add("selected");
        }
        var3Btn.type = "button";
        var3Btn.innerHTML = var3Names[var3IX];
        var3Btn.id = "var3Btn" + (var3IX + 1);
        var3Btn.onclick = handlers[var3IX];
        var3Btns.appendChild(var3Btn);
    }
}

addVar3Btns();
renderMatrix();
