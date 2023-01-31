// global vars
let currentLayerIX = 0;
let spatialImgSelected = true;
let selectedPlotIX = -1;
let plotImgs = [];
let spatialImgs = [];
let viewerLinks = [];
let visibleImgs = [];
let spatialImgBtn = null;
let plotImgBtns = null;
let layerBtns = null;

// page setup
function setPageTitle() {
    let title = document.getElementById("title");
    title.innerHTML = cellData["title"];
}

function createColTitles(matrix) {
    let colVariable = cellData["colVariable"];
    let colValues = cellData["colValues"];
    for (let colIX = 0; colIX < colValues.length; colIX++) {
        let colTitle = document.createElement("div");
        colTitle.className = "colTitle";
        colTitle.innerHTML = colVariable + " = " + colValues[colIX];
        matrix.appendChild(colTitle);
    }
}

function createRowTitle(rowIX, matrix) {
    let rowTitle = document.createElement("div");
    rowTitle.className = "rowTitle";
    rowTitle.classList.add("startRow");
    matrix.appendChild(rowTitle);
    let rowTitleTxt = document.createElement("div");
    rowTitleTxt.className = "rowTitleTxt";
    let rowVar = cellData["rowVariable"];
    let rowValues = cellData["rowValues"];
    rowTitleTxt.innerHTML = rowVar + " = " + rowValues[rowIX];
    rowTitle.appendChild(rowTitleTxt);
}

function getViewerLink(rowIX, colIX, layerIX) {
    let rowVar = cellData["rowVariable"][0];
    let rowValues = cellData["rowValues"];
    let colVar = cellData["colVariable"][0];
    let colValues = cellData["colValues"];
    let layerVar = cellData["layerVariable"][0];
    let layerValues = cellData["layerValues"];
    return (
        "https://simularium.allencell.org/viewer?trajUrl=" + 
        "https://readdy-working-bucket.s3.us-west-2.amazonaws.com/" + 
        "outputs/" + cellData["filePrefix"] + "_" + 
        layerVar + "=" + layerValues[layerIX] + "_" + 
        rowVar + "=" + rowValues[rowIX] + "_" + 
        colVar + "=" + colValues[colIX] + "_0.h5.simularium"
    );
}

function getImgSrc(rowIX, colIX, layerIX, spatialImg) {
    let rowVar = cellData["rowVariable"][0];
    let rowValues = cellData["rowValues"];
    let colVar = cellData["colVariable"][0];
    let colValues = cellData["colValues"];
    let layerVar = cellData["layerVariable"][0];
    let layerValues = cellData["layerValues"];
    return (
        "img/" + cellData["filePrefix"] + "/" +
        (spatialImg ? "spatial/" : "plots/") +
        layerVar + "=" + layerValues[layerIX] + "_" + 
        rowVar + "=" + rowValues[rowIX] + "_" + 
        colVar + "=" + colValues[colIX] + ".jpg"
    );
}

function createSpatialImg(rowIX, colIX, layerIX, selected, viewerLink) {
    let spatialImg = document.createElement("img");
    spatialImg.src = getImgSrc(rowIX, colIX, layerIX, true);
    spatialImg.className = "spatialImg";
    if (selected) {
        viewerLink.href = getViewerLink(rowIX, colIX, layerIX);
        spatialImg.classList.add("visible");
    }
    viewerLink.appendChild(spatialImg);
    return spatialImg;
}

function createPlotImg(rowIX, colIX, layerIX, viewerLink) {
    let plotImg = document.createElement("img");
    plotImg.src = getImgSrc(rowIX, colIX, layerIX, false);
    plotImg.classList.add("plotImg");
    viewerLink.appendChild(plotImg);
    return plotImg;
}

function createCellImageLayers(rowIX, colIX, viewerLink) {
    let layerValues = cellData["layerValues"];
    for (let layerIX = 0; layerIX < layerValues.length; layerIX++) {
        // spatial image
        let spatialImg = createSpatialImg(
            rowIX, colIX, layerIX, layerIX === currentLayerIX, viewerLink
        );
        spatialImgs[rowIX][colIX].push(spatialImg);
        if (layerIX === currentLayerIX)
        {
            visibleImgs.push(spatialImg);
        }
        // plot image
        let plotImg = createPlotImg(rowIX, colIX, layerIX, viewerLink);
        plotImgs[rowIX][colIX].push(plotImg);
    }
}

function createCell(rowIX, colIX, matrix) {
    let container = document.createElement("div");
    container.className = "cell";
    matrix.appendChild(container);
    let cellImages = document.createElement("div");
    cellImages.className = "images";
    container.appendChild(cellImages);
    let viewerLink = document.createElement("a");
    viewerLink.target = "_blank";
    cellImages.appendChild(viewerLink);
    createCellImageLayers(rowIX, colIX, viewerLink);
    return viewerLink;
}

function createMatrixPage() {
    let matrix = document.getElementById("matrix");
    setPageTitle();
    createColTitles(matrix);
    let rowValues = cellData["rowValues"];
    let colValues = cellData["colValues"];
    for (let rowIX = 0; rowIX < rowValues.length; rowIX++) {
        viewerLinks.push([]);
        plotImgs.push([]);
        spatialImgs.push([]);
        createRowTitle(rowIX, matrix);
        for (let colIX = 0; colIX < colValues.length; colIX++) {
            plotImgs[rowIX].push([]);
            spatialImgs[rowIX].push([]);
            let viewerLink = createCell(rowIX, colIX, matrix);
            viewerLinks[rowIX].push(viewerLink);
        }
    }
}

function createSpatialImgBtn(handler) {
    let imgBtnsDiv = document.getElementById("imgBtns");
    let result = document.createElement("button");
    result.type = "button";
    result.innerHTML = "spatial view";
    result.id = "spatialBtn";
    result.classList.add("selected");
    result.onclick = handler;
    imgBtnsDiv.appendChild(result);
    return result;
}

function createPlotImgBtns(handlers) {
    let imgBtnsDiv = document.getElementById("imgBtns");
    let plotNames = cellData["plotNames"];
    let result = [];
    for (let plotIX = 0; plotIX < plotNames.length; plotIX++) {
        let plotImgBtn = document.createElement("button");
        plotImgBtn.type = "button";
        plotImgBtn.innerHTML = plotNames[plotIX];
        plotImgBtn.id = "plotBtn" + (plotIX + 1);
        plotImgBtn.onclick = handlers[plotIX];
        imgBtnsDiv.appendChild(plotImgBtn);
        result.push(plotImgBtn);
    }
    return result;
}

function createLayerBtns(handlers) {
    let layerBtnsDiv = document.getElementById("layerBtns");
    let result = [];
    let layerVar = cellData["layerVariable"];
    let layerValues = cellData["layerValues"];
    for (let layerIX = 0; layerIX < layerValues.length; layerIX++) {
        let layerBtn = document.createElement("button");
        if (layerIX === currentLayerIX) {
            layerBtn.classList.add("selected");
        }
        layerBtn.type = "button";
        layerBtn.innerHTML = layerVar + " = " + layerValues[layerIX];
        layerBtn.id = "layerBtn" + (layerIX + 1);
        layerBtn.onclick = handlers[layerIX];
        layerBtnsDiv.appendChild(layerBtn);
        result.push(layerBtn);
    }
    return result;
}

// state updates
function deselectImgBtns() {
    spatialImgBtn.classList.remove("selected");
    for (let plotIX = 0; plotIX < plotImgBtns.length; plotIX++) {
        plotImgBtns[plotIX].classList.remove("selected");
    }
}

function hideVisibleImages() {
    for (let imgIX = 0; imgIX < visibleImgs.length; imgIX++) {
        visibleImgs[imgIX].classList.remove("visible");
        if (selectedPlotIX >= 0) {
            visibleImgs[imgIX].classList.remove("plot" + (selectedPlotIX + 1));
        }
    }
    visibleImgs = [];
}

function showCurrentImgs() {
    for (let rowIX = 0; rowIX < spatialImgs.length; rowIX++) {
        for (let colIX = 0; colIX < spatialImgs[rowIX].length; colIX++) {
            viewerLinks[rowIX][colIX].href = getViewerLink(rowIX, colIX, currentLayerIX);
            if (spatialImgSelected) {
                spatialImgs[rowIX][colIX][currentLayerIX].classList.add("visible");
                visibleImgs.push(spatialImgs[rowIX][colIX][currentLayerIX]);
            }
            else {
                let plotImg = plotImgs[rowIX][colIX][currentLayerIX];
                plotImg.classList.add("visible");
                plotImg.classList.add("plot" + (selectedPlotIX + 1));
                visibleImgs.push(plotImg);
            }
        }
    }
}

function showSpatial() {
    deselectImgBtns();
    spatialImgBtn.classList.add("selected");
    hideVisibleImages();
    spatialImgSelected = true;
    selectedPlotIX = -1;
    showCurrentImgs();
}

function showPlot(plotIX) {
    deselectImgBtns();
    plotImgBtns[plotIX].classList.add("selected");
    hideVisibleImages();
    spatialImgSelected = false;
    selectedPlotIX = plotIX;
    showCurrentImgs();
}

function deselectLayerBtns() {
    for (let layerIX = 0; layerIX < layerBtns.length; layerIX++) {
        layerBtns[layerIX].classList.remove("selected");
    }
}

function setLayer(layerIX) {
    if (layerIX === currentLayerIX) {
        return;
    }
    deselectLayerBtns();
    layerBtns[layerIX].classList.add("selected");
    hideVisibleImages();
    currentLayerIX = layerIX;
    showCurrentImgs();
}

// button handlers
// The number of these should match the number of plots and layers
function handleShowSpatial() {
    showSpatial();
}

function handleShowPlot1() {
    showPlot(0);
}

function handleShowPlot2() {
    showPlot(1);
}

function handleShowPlot3() {
    showPlot(2);
}

function handleShowPlot4() {
    showPlot(3);
}

function handleShowPlot5() {
    showPlot(4);
}

function handleSetLayer1() {
    setLayer(0);
}

function handleSetLayer2() {
    setLayer(1);
}

function handleSetLayer3() {
    setLayer(2);
}

// render the page
createMatrixPage();
let plotBtnHandlers = [
    handleShowPlot1,
    handleShowPlot2,
    handleShowPlot3,
    handleShowPlot4,
    handleShowPlot5,
]
let layerBtnHandlers = [
    handleSetLayer1,
    handleSetLayer2,
    handleSetLayer3,
]
spatialImgBtn = createSpatialImgBtn(handleShowSpatial);
plotImgBtns = createPlotImgBtns(plotBtnHandlers);
layerBtns = createLayerBtns(layerBtnHandlers);
