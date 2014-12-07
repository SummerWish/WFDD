var size = 4;
var gridPadding = 15;
var cellSpacing = 15;

var map = [];

// 代码入口
function setup() {
    createMap();
    createGrid();
    for (var i = 0; i < 2; ++i) {
        createRandomTile();
    }
    updateGrid();
}

// 根据 size，初始化 map 为一个二维数组
function createMap() {
    // TODO
}

// 初始化网格 DOM
function createGrid() {
    // TODO
}

// 将 map 内容更新到网格 DOM
function updateGrid() {
    // TODO
}

// 在地图上放置一块新格子
function createRandomTile() {
    var value = Math.random() < 0.9 ? 2 : 4;
    // TODO
}