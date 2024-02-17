// global vars
let currentLayerIX = 0;
let spatialImgSelected = true;
let spatialZoomImgSelected = false;
let selectedPlotIX = -1;
let images = [];
let viewerLinks = [];
let visibleImgs = [];
let spatialImgBtn = null;
let spatialZoomImgBtn = null;
let plotImgBtns = null;
let layerBtns = null;

// page setup
function setPageTitle() {
    let title = document.getElementById("title");
    title.innerHTML = matrixData["title"];
}

function createColTitles(matrix) {
    let colVariable = matrixData["variables"][matrixData["colVariableIX"]];
    let colValues = matrixData["colValues"];
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
    let rowVariable = matrixData["variables"][matrixData["rowVariableIX"]];
    let rowValues = matrixData["rowValues"];
    rowTitleTxt.innerHTML = rowVariable + " = " + rowValues[rowIX];
    rowTitle.appendChild(rowTitleTxt);
}

function getLayerValue(layerVarIX, layerIX) {
    let layerVariables = matrixData["layerVariables"];
    let currLayerNValues = layerVariables[layerVarIX]["values"].length;
    if (layerVarIX + 1 >= layerVariables.length) {  // last layer variable
        return layerIX % currLayerNValues;  
    }
    let nValues = 1;
    for (let ix = layerVarIX + 1; ix < layerVariables.length; ix++) {
        nValues *= layerVariables[ix]["values"].length;
    }
    if (layerVarIX === 0) {
        let x = Math.floor(layerIX / nValues);
        return x;
    }
    else {
        return Math.floor((layerIX + 1) / nValues) % currLayerNValues;
    }
}

function getFilenameVariableStr(rowIX, colIX, layerIX) {
    let variables = matrixData["variables"];
    let result = Array(variables.length).fill("");
    // row and col
    let rowVarIX = matrixData["rowVariableIX"]
    let rowName = variables[rowVarIX][0].toLowerCase();
    let rowValue = matrixData["rowValues"][rowIX];
    result[rowVarIX] = rowName + "=" + rowValue;
    let colVarIX = matrixData["colVariableIX"]
    let colName = variables[colVarIX][0].toLowerCase();
    let colValue = matrixData["colValues"][colIX];
    result[colVarIX] = colName + "=" + colValue;
    // layers
    let layerVariables = matrixData["layerVariables"];
    for (let ix = 0; ix < layerVariables.length; ix++) {
        let varIX = layerVariables[ix]["ix"];
        let name = variables[varIX][0].toLowerCase();
        let valueIX = getLayerValue(ix, layerIX);
        let value = layerVariables[ix]["values"][valueIX];
        result[varIX] = name + "=" + value;
    }
    return result.join('_');
}

function getImgSrc(rowIX, colIX, layerIX) {
    return (
        "../img/" + matrixData["filePrefix"] + "/" +
        matrixData["filePrefix"] + "_" +
        getFilenameVariableStr(rowIX, colIX, layerIX) + ".jpg"
    );
}

function createImg(rowIX, colIX, layerIX, current, viewerLink) {
    let newImg = document.createElement("img");
    newImg.src = getImgSrc(rowIX, colIX, layerIX);
    newImg.classList.add("image");
    newImg.classList.add("spatial");
    if (current) {
        viewerLink.href = getViewerHref(rowIX, colIX, layerIX);
        newImg.classList.add("visible");
    }
    viewerLink.appendChild(newImg);
    return newImg;
}

function getNLayers() {
    let layerVariables = matrixData["layerVariables"];
    let result = 1;
    for (let ix = 0; ix < layerVariables.length; ix++) {
        result *= layerVariables[ix]["values"].length;
    }
    return result;
}

function createCellImageLayers(rowIX, colIX, viewerLink) {
    let nLayers = getNLayers();
    for (let layerIX = 0; layerIX < nLayers; layerIX++) {
        let newImg = createImg(
            rowIX, colIX, layerIX, layerIX === currentLayerIX, viewerLink
        );
        images[rowIX][colIX].push(newImg);
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
    let rowValues = matrixData["rowValues"];
    let colValues = matrixData["colValues"];
    for (let rowIX = 0; rowIX < rowValues.length; rowIX++) {
        viewerLinks.push([]);
        images.push([]);
        createRowTitle(rowIX, matrix);
        for (let colIX = 0; colIX < colValues.length; colIX++) {
            images[rowIX].push([]);
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

function createSpatialZoomImgBtn(handler) {
    let imgBtnsDiv = document.getElementById("imgBtns");
    let result = document.createElement("button");
    result.type = "button";
    result.innerHTML = "spatial view (zoom)";
    result.id = "spatialZoomBtn";
    result.onclick = handler;
    imgBtnsDiv.appendChild(result);
    return result;
}

function createPlotImgBtns(handlers) {
    let imgBtnsDiv = document.getElementById("imgBtns");
    let plotNames = matrixData["plotNames"];
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

function getLayerName(layerIX) {
    let variables = matrixData["variables"];
    let layerVariables = matrixData["layerVariables"];
    let result = Array(layerVariables.length).fill("");
    for (let ix = 0; ix < layerVariables.length; ix++) {
        let varIX = layerVariables[ix]["ix"];
        let name = variables[varIX];
        let valueIX = getLayerValue(ix, layerIX);
        let value = layerVariables[ix]["values"][valueIX];
        result[ix] = name + " = " + value;
    }
    return result.join(', ');
}

function createLayerBtns(handlers) {
    let result = [];
    let layerBtnsDiv = document.getElementById("layerBtns");
    let nLayers = getNLayers();
    for (let layerIX = 0; layerIX < nLayers; layerIX++) {
        let layerBtn = document.createElement("button");
        if (layerIX === currentLayerIX) {
            layerBtn.classList.add("selected");
        }
        layerBtn.type = "button";
        layerBtn.innerHTML = getLayerName(layerIX);
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
    if (matrixData["zoom"]) {
        spatialZoomImgBtn.classList.remove("selected");
    }
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
        else {
            if (spatialImgSelected) {
                visibleImgs[imgIX].classList.remove("spatial");
            }
            if (spatialZoomImgSelected) {
                visibleImgs[imgIX].classList.remove("spatialZoom");
            }
        }
    }
    visibleImgs = [];
}

function showCurrentImgs() {
    for (let rowIX = 0; rowIX < images.length; rowIX++) {
        for (let colIX = 0; colIX < images[rowIX].length; colIX++) {
            viewerLinks[rowIX][colIX].href = getViewerHref(rowIX, colIX, currentLayerIX);
            currentImg = images[rowIX][colIX][currentLayerIX]
            let newClass = spatialImgSelected ? "spatial" : spatialZoomImgSelected ? "spatialZoom" : "plot" + (selectedPlotIX + 1);
            currentImg.classList.add(newClass);
            currentImg.classList.add("visible");
            visibleImgs.push(currentImg);
        }
    }
}

function showSpatial() {
    deselectImgBtns();
    spatialImgBtn.classList.add("selected");
    hideVisibleImages();
    spatialImgSelected = true;
    spatialZoomImgSelected = false;
    selectedPlotIX = -1;
    showCurrentImgs();
}

function showSpatialZoom() {
    deselectImgBtns();
    if (matrixData["zoom"]) {
        spatialZoomImgBtn.classList.add("selected");
    }
    hideVisibleImages();
    spatialImgSelected = false;
    spatialZoomImgSelected = true;
    selectedPlotIX = -1;
    showCurrentImgs();
}

function showPlot(plotIX) {
    deselectImgBtns();
    plotImgBtns[plotIX].classList.add("selected");
    hideVisibleImages();
    spatialImgSelected = false;
    spatialZoomImgSelected = false;
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

function handleShowSpatialZoom() {
    showSpatialZoom();
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

function handleSetLayer4() {
    setLayer(3);
}

function handleSetLayer5() {
    setLayer(4);
}

// render the page
function main() {
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
        handleSetLayer4,
        handleSetLayer5,
    ]
    spatialImgBtn = createSpatialImgBtn(handleShowSpatial);
    if (matrixData["zoom"]) {
        spatialZoomImgBtn = createSpatialZoomImgBtn(handleShowSpatialZoom);
    }
    plotImgBtns = createPlotImgBtns(plotBtnHandlers);
    layerBtns = createLayerBtns(layerBtnHandlers);
}

main();
