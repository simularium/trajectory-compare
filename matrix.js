let matrix = document.getElementById("matrix");
let rowNames = cellData["rowNames"];
let nRows = rowNames.length;
let colNames = cellData["colNames"];
let nCols = colNames.length;
let cells = cellData["cells"];
let title = document.getElementById("title");
title.innerHTML = cellData["title"];
let plotImgs = [];
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
        if (cells.length > rowIX && cells[rowIX].length > colIX) {
            let cellImages = document.createElement("div");
            cellImages.className = "images";
            container.appendChild(cellImages);
            let viewerLink = document.createElement("a");
            viewerLink.href = cells[rowIX][colIX]["viewer_link"];
            viewerLink.target = "_blank";
            cellImages.appendChild(viewerLink);
            let spatialImg = document.createElement("img");
            spatialImg.src = "img/" + cells[rowIX][colIX]["spatial_img"];
            spatialImg.className = "spatial";
            viewerLink.appendChild(spatialImg);
            plotType = 0;
            while (cells[rowIX][colIX]["plot_imgs"].length > plotType) {
                if (plotType >= plotImgs.length) {
                    plotImgs.push([])
                }
                let plotImg = document.createElement("img");
                plotImg.src = "img/" + cells[rowIX][colIX]["plot_imgs"][plotType];
                plotImg.className = "plot" + (plotType + 1);
                plotImg.classList.add("plotImg");
                viewerLink.appendChild(plotImg);
                plotImgs[plotType].push(plotImg)
                plotType++;
            }
        }
        else {
            container.innerHTML = "(" + rowIX + ", " + colIX + ")"
        }
    }
}

function deselectBtns() {
    document.getElementById("spatialBtn").classList.remove("selected");
    document.getElementById("plot1Btn").classList.remove("selected");
    document.getElementById("plot2Btn").classList.remove("selected");
}

function showPlot(plotType) {
    for (let plotIX = 0; plotIX < plotImgs[plotType].length; plotIX++) {
        plotImgs[plotType][plotIX].classList.add("show");
    }
}

function hidePlots() {
    for (let plotType = 0; plotType < plotImgs.length; plotType++) {
        for (let plotIX = 0; plotIX < plotImgs[plotType].length; plotIX++) {
            plotImgs[plotType][plotIX].classList.remove("show");
        }
    }
}

function showSpatial() {
    deselectBtns();
    document.getElementById("spatialBtn").classList.add("selected");
    hidePlots();
}

function showPlot1() {
    deselectBtns();
    document.getElementById("plot1Btn").classList.add("selected");
    hidePlots();
    showPlot(0);
}

function showPlot2() {
    deselectBtns();
    document.getElementById("plot2Btn").classList.add("selected");
    hidePlots();
    showPlot(1);
}
