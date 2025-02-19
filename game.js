// 获取画布和上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 游戏配置
let gridSize = 20; // 改为可变的网格大小
let tileCount = 20; // 固定网格数量
let gameSpeed = 150; // 初始游戏速度
let difficulty = 'normal'; // 游戏难度

// 调整画布大小的函数
function resizeCanvas() {
    const minSize = Math.min(window.innerWidth * 0.8, window.innerHeight * 0.8);
    canvas.width = minSize;
    canvas.height = minSize;
    gridSize = minSize / tileCount; // 重新计算网格大小
}

// 初始化画布大小
resizeCanvas();

// 监听窗口大小变化
window.addEventListener('resize', resizeCanvas);

// 蛇的初始位置和速度
let snake = [
    { x: 5, y: 5 }
];
let dx = 1;
let dy = 0;

// 食物位置
let food = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
};

// 游戏状态
let score = 0;
let gameRunning = true;

// 设置游戏难度
function setDifficulty(level) {
    difficulty = level;
    switch(level) {
        case 'easy':
            gameSpeed = 200;
            break;
        case 'normal':
            gameSpeed = 150;
            break;
        case 'hard':
            gameSpeed = 100;
            break;
    }
}

// 控制蛇的方向
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowUp':
            if (dy !== 1) { dx = 0; dy = -1; }
            break;
        case 'ArrowDown':
            if (dy !== -1) { dx = 0; dy = 1; }
            break;
        case 'ArrowLeft':
            if (dx !== 1) { dx = -1; dy = 0; }
            break;
        case 'ArrowRight':
            if (dx !== -1) { dx = 1; dy = 0; }
            break;
    }
});

// 游戏主循环
function gameLoop() {
    if (!gameRunning) return;

    // 移动蛇
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // 检查碰撞
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }

    // 检查自身碰撞
    for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
            return;
        }
    }

    snake.unshift(head);

    // 检查是否吃到食物
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        document.getElementById('scoreValue').textContent = score;
        generateFood();
        // 每得50分加快游戏速度
        if (score % 50 === 0 && gameSpeed > 50) {
            gameSpeed -= 10;
        }
    } else {
        snake.pop();
    }

    // 清空画布
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制食物
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);

    // 绘制蛇
    ctx.fillStyle = '#4CAF50';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });

    setTimeout(gameLoop, gameSpeed);
}

// 生成新的食物
function generateFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);

    // 确保食物不会生成在蛇身上
    snake.forEach(segment => {
        if (food.x === segment.x && food.y === segment.y) {
            generateFood();
        }
    });
}

// 游戏结束
function gameOver() {
    gameRunning = false;
    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOver').style.display = 'block';
}

// 重新开始游戏
function restartGame() {
    snake = [{ x: 5, y: 5 }];
    dx = 1;
    dy = 0;
    score = 0;
    setDifficulty('normal'); // 重置游戏速度
    document.getElementById('scoreValue').textContent = score;
    document.getElementById('gameOver').style.display = 'none';
    generateFood();
    gameRunning = true;
    gameLoop();
}

// 开始游戏
gameLoop();