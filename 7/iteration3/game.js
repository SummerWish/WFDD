var size = 4;
var gridPadding = 15;
var cellSpacing = 15;

var map = [];

var $grid;
var gridWidth, gridHeight;
var cellWidth, cellHeight;

var animationInterval = 200;

function setup() {
    createMap();
    createGrid();
    for (var i = 0; i < 2; ++i) {
        createRandomTile();
    }

    $(document).on('keydown', function(ev) {
        switch(ev.which) {
            case 37: // left arrow
                move('left');
                break;
            case 39: // right arrow
                move('right');
                break;
            case 38: // up arrow
                move('up');
                break;
            case 40: // down arrow
                move('down');
                break;
        }
    });

    // TODO:
    // 检测游戏结束
    // 重新开始游戏
    // 计分
}

function createMap() {
    map = new Array(size);
    for (var i = 0; i < size; ++i) {
        map[i] = new Array(size);
        for (var j = 0; j < size; ++j) {
            map[i][j] = {
                value: 0,
                left:  0,
                top:   0,
                $tile: null
            };
        }
    }
}

function createCell() {
    var $tile = $('<div>').addClass('cell');
    $tile.css({
        width: cellWidth + 'px',
        height: cellHeight + 'px',
        'line-height': cellHeight + 'px'
    });
    return $tile;
}

function createGrid() {
    $grid = $('.grid');
    gridWidth  = $grid.width();
    gridHeight = $grid.height();
    cellWidth  = ((gridWidth - gridPadding * 2) - (size - 1) * cellSpacing) / size;
    cellHeight = ((gridHeight - gridPadding * 2) - (size - 1) * cellSpacing) / size;
    for (var i = 0; i < size; ++i) {
        for (var j = 0; j < size; ++j) {
            var $tile = createCell();
            map[i][j].left = gridPadding + (cellWidth + cellSpacing) * j;
            map[i][j].top  = gridPadding + (cellHeight + cellSpacing) * i;
            $tile.attr('data-point', '0');
            $tile.css({
                left: map[i][j].left,
                top:  map[i][j].top,
            });
            $tile.appendTo($grid);
        }
    }
}

function getAvailableCells() {
    var availables = [];
    for (var i = 0; i < size; ++i) {
        for (var j = 0; j < size; ++j) {
            if (map[i][j].value == 0) {
                availables.push({row: i, col: j});
            }
        }
    }
    return availables;
}

function isCellAvailable() {
    return (getAvailableCells().length > 0);
}

function getAvailableRandomCell() {
    var availables = getAvailableCells();
    var pos = availables[Math.floor(Math.random() * availables.length)];
    return pos;
}

function createTile(row, col, value) {
    var $tile = createCell();
    $tile.css({
        left: map[row][col].left,
        top:  map[row][col].top,
    });
    $tile.addClass('tile');
    $tile.attr('data-point', value);
    return $tile;
}

function createRandomTile() {
    if (!isCellAvailable()) {
        return;
    }
    var pos = getAvailableRandomCell();
    var value = Math.random() < 0.9 ? 2 : 4;
    map[pos.row][pos.col].value = value;

    // create new cell
    var $tile = createTile(pos.row, pos.col, value);
    $tile.css('transform', 'scale(0)');
    $tile.appendTo($grid);
    $tile.outerHeight(); // force relayout
    $tile.css('transform', 'scale(1)');

    map[pos.row][pos.col].$tile = $tile;
}

function move(direction) {

    var moved = false;

    function _move(row, col, dirRow, dirCol) {
        if (map[row][col].value === 0) {
            return;
        }

        var availableCol = col, availableRow = row;
        var nextRow, nextCol;
        for (var i = 0; i < size; ++i) {
            nextRow = availableRow + dirRow;
            nextCol = availableCol + dirCol;
            if (nextRow >= 0 && nextRow < size && nextCol >= 0 && nextCol < size) {
                if (map[nextRow][nextCol].value === 0) {
                    availableCol = nextCol;
                    availableRow = nextRow;
                }
            } else {
                break;
            }
        }

        var finalCol = null, finalRow = null, merge = false;

        // move anyway
        if (availableCol !== col || availableRow !== row) {
            finalCol = availableCol;
            finalRow = availableRow;
            map[availableRow][availableCol].value = map[row][col].value;
            map[row][col].value = 0;
            moved = true;
        }

        // can merge?
        if (nextCol >= 0 && nextCol < size && nextRow >= 0 && nextRow < size) {
            if (
                map[availableRow][availableCol].value === map[nextRow][nextCol].value
                && !map[nextRow][nextCol].merge
            ) {
                finalCol = nextCol;
                finalRow = nextRow;
                map[nextRow][nextCol].value *= 2;
                map[nextRow][nextCol].merge = true;
                map[availableRow][availableCol].value = 0;
                moved = true;
                merge = true;
            }
        }

        // move from row,col -> finalRow,finalCol
        if (finalCol !== null && finalRow !== null) {
            var $tileSrc = map[row][col].$tile;
            var $tileDst = map[finalRow][finalCol].$tile;

            map[row][col].$tile.css({
                left: map[finalRow][finalCol].left,
                top:  map[finalRow][finalCol].top,
            });
            
            map[finalRow][finalCol].$tile = map[row][col].$tile;
            map[row][col].$tile = null;

            if (merge) {
                var $tileMerged = createTile(finalRow, finalCol, map[finalRow][finalCol].value);
                setTimeout(function() {
                    $tileMerged.css('transform', 'scale(1.3)');
                    $tileMerged.appendTo($grid);
                    $tileMerged.outerHeight();
                    $tileMerged.css('transform', 'scale(1)');
                    map[finalRow][finalCol].$tile = $tileMerged;
                }, animationInterval * 0.66);
                setTimeout(function() {
                    $tileSrc.remove();
                    $tileDst.remove();
                }, animationInterval);
            }
        }
    }

    switch (direction) {
        case 'right':
            for (var col = size - 1; col >= 0; --col) {
                for (var row = 0; row < size; ++row) {
                    _move(row, col, 0, 1);
                }
            }
            break;
        case 'left':
            for (var col = 0; col < size; ++col) {
                for (var row = 0; row < size; ++row) {
                    _move(row, col, 0, -1);
                }
            }
            break;
        case 'up':
            for (var col = 0; col < size; ++col) {
                for (var row = 0; row < size; ++row) {
                    _move(row, col, -1, 0);
                }
            }
            break;
        case 'down':
            for (var col = 0; col < size; ++col) {
                for (var row = size - 1; row >= 0; --row) {
                    _move(row, col, 1, 0);
                }
            }
            break;
    }

    if (moved) {
        for (var i = 0; i < size; ++i) {
            for (var j = 0; j < size; ++j) {
                delete map[i][j].merge;
            }
        }
        setTimeout(function() {
            createRandomTile();
        }, animationInterval * 0.5);
    }
}