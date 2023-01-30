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
let layerNames = Object.keys(cellData["cells"]);

// page setup
function dataForCell(layerName, rowIX, colIX) {
    if (
        cellData["cells"][layerName].length <= rowIX || 
        cellData["cells"][layerName][rowIX].length <= colIX
    ) {
        return null;
    }
    return cellData["cells"][layerName][rowIX][colIX];
}

function setPageTitle() {
    let title = document.getElementById("title");
    title.innerHTML = cellData["title"];
}

function createColTitles(nCols, colNames, matrix) {
    for (let colIX = 0; colIX < nCols; colIX++) {
        let colTitle = document.createElement("div");
        colTitle.className = "colTitle";
        colTitle.innerHTML = colNames[colIX];
        matrix.appendChild(colTitle);
    }
}

function createRowTitle(rowName, matrix) {
    let rowTitle = document.createElement("div");
    rowTitle.className = "rowTitle";
    rowTitle.classList.add("startRow");
    matrix.appendChild(rowTitle);
    let rowTitleTxt = document.createElement("div");
    rowTitleTxt.className = "rowTitleTxt";
    rowTitleTxt.innerHTML = rowName;
    rowTitle.appendChild(rowTitleTxt);
}

function createSpatialImg(data, selected, viewerLink) {
    let spatialImg = document.createElement("img");
    spatialImg.src = "img/" + data["spatial_img"];
    spatialImg.className = "cellImg";
    if (selected) {
        viewerLink.href = data["viewer_link"];
        spatialImg.classList.add("visible");
    }
    viewerLink.appendChild(spatialImg);
    return spatialImg;
}

function createPlotImg(plotType, data, viewerLink) {
    let plotImg = document.createElement("img");
    plotImg.src = "img/" + data["plot_imgs"][plotType];
    plotImg.className = "plot" + (plotType + 1);
    plotImg.classList.add("cellImg");
    viewerLink.appendChild(plotImg);
    return plotImg;
}

function createCellImageLayers(rowIX, colIX, viewerLink) {
    for (let layerIX = 0; layerIX < layerNames.length; layerIX++) {
        // get data
        let layerName = layerNames[layerIX];
        let data = dataForCell(layerName, rowIX, colIX);
        if (!data) {
            continue;
        }
        // spatial image
        let spatialImg = createSpatialImg(data, layerIX === currentLayerIX, viewerLink);
        spatialImgs[rowIX][colIX].push(spatialImg);
        if (layerIX === currentLayerIX)
        {
            visibleImgs.push(spatialImg);
        }
        // plot images
        let plotType = 0;
        plotImgs[rowIX][colIX].push([]);
        while (data["plot_imgs"].length > plotType) {
            let plotImg = createPlotImg(plotType, data, viewerLink);
            plotImgs[rowIX][colIX][layerIX].push(plotImg);
            plotType++;
        }
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
    let rowNames = cellData["rowNames"];
    let nRows = rowNames.length;
    let colNames = cellData["colNames"];
    let nCols = colNames.length;
    setPageTitle();
    createColTitles(nCols, colNames, matrix);
    for (let rowIX = 0; rowIX < nRows; rowIX++) {
        viewerLinks.push([]);
        plotImgs.push([]);
        spatialImgs.push([]);
        createRowTitle(rowNames[rowIX], matrix);
        for (let colIX = 0; colIX < nCols; colIX++) {
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
    for (let layerIX = 0; layerIX < layerNames.length; layerIX++) {
        let layerBtn = document.createElement("button");
        if (layerIX === currentLayerIX) {
            layerBtn.classList.add("selected");
        }
        layerBtn.type = "button";
        layerBtn.innerHTML = layerNames[layerIX];
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
    }
    visibleImgs = [];
}

function showCurrentImgs() {
    let layerName = layerNames[currentLayerIX];
    for (let rowIX = 0; rowIX < spatialImgs.length; rowIX++) {
        for (let colIX = 0; colIX < spatialImgs[rowIX].length; colIX++) {
            let data = dataForCell(layerName, rowIX, colIX);
            if (!data) {
                continue;
            }
            viewerLinks[rowIX][colIX].href = data["viewer_link"];
            if (spatialImgSelected) {
                spatialImgs[rowIX][colIX][currentLayerIX].classList.add("visible");
                visibleImgs.push(spatialImgs[rowIX][colIX][currentLayerIX]);
            }
            else {
                let plotImg = plotImgs[rowIX][colIX][currentLayerIX][selectedPlotIX];
                plotImg.classList.add("visible");
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

function handleSetLayer1() {
    setLayer(0);
}

function handleSetLayer2() {
    setLayer(1);
}

// render the page
createMatrixPage();
let plotBtnHandlers = [
    handleShowPlot1,
    handleShowPlot2,
]
let layerBtnHandlers = [
    handleSetLayer1,
    handleSetLayer2,
]
spatialImgBtn = createSpatialImgBtn(handleShowSpatial);
plotImgBtns = createPlotImgBtns(plotBtnHandlers);
layerBtns = createLayerBtns(layerBtnHandlers);
