// --- 全域變數 ---
let idleSpriteSheet; // 待機動畫的精靈圖
let movingSpriteSheet; // 移動動畫的精靈圖
let shootingSpriteSheet; // 射擊動畫的精靈圖
let gunSpriteSheet; // 槍動畫的精靈圖
let dualBladesSpriteSheet; // 雙刀動畫的精靈圖
let secondIdleSpriteSheet; // 第二個角色的待機動畫

let idleFrames = []; // 存放待機動畫的每一格
let movingFrames = []; // 存放移動動畫的每一格
let shootingFrames = []; // 存放射擊動畫的每一格
let gunFrames = []; // 存放槍動畫的每一格
let dualBladesFrames = []; // 存放雙刀動畫的每一格
let secondIdleFrames = []; // 存放第二個角色待機動畫的每一格

// 角色狀態變數
let characterX;
let characterY;
let character2X;
let character2Y;

const CHARACTER_SPEED = 4; // 角色移動速度
let isMoving = false;
let isShooting = false; // 是否正在射擊
let isGunAttack = false; // 是否正在使用槍攻擊
let isDualBladesAttack = false; // 是否正在使用雙刀攻擊
let shootingFrameCounter = 0; // 射擊動畫的計數器
let gunFrameCounter = 0; // 槍動畫的計數器
let dualBladesFrameCounter = 0; // 雙刀動畫的計數器
let facingDirection = 1; // 1 代表朝右, -1 代表朝左

// --- 動畫設定 ---
// 待機動畫
const IDLE_SPRITE_WIDTH = 625;
const IDLE_SPRITE_HEIGHT = 57;
const IDLE_TOTAL_FRAMES = 7;
// 移動動畫
const MOVING_SPRITE_WIDTH = 347;
const MOVING_SPRITE_HEIGHT = 61;
const MOVING_TOTAL_FRAMES = 4;
// 射擊動畫
const SHOOTING_SPRITE_WIDTH = 3004;
const SHOOTING_SPRITE_HEIGHT = 66;
const SHOOTING_TOTAL_FRAMES = 17;
// 槍動畫
const GUN_SPRITE_WIDTH = 15433;
const GUN_SPRITE_HEIGHT = 156;
const GUN_TOTAL_FRAMES = 62;
// 雙刀動畫
const DUALBLADES_SPRITE_WIDTH = 16247;
const DUALBLADES_SPRITE_HEIGHT = 172;
const DUALBLADES_TOTAL_FRAMES = 68;

// 第二個角色待機動畫
const SECOND_IDLE_SPRITE_WIDTH = 627;
const SECOND_IDLE_SPRITE_HEIGHT = 109;
const SECOND_IDLE_TOTAL_FRAMES = 4;

const ANIMATION_SPEED = 5; // 動畫速度，數字越小越快 (您可以調整此數值)

/**
 * p5.js 的 preload() 函式，在 setup() 前執行
 * 用於預先載入圖片、聲音等外部資源
 */
function preload() {
  // 載入待機動畫圖片
  idleSpriteSheet = loadImage(
    '站/00.png',
    () => console.log('待機圖片載入成功！')
  );
  // 載入移動動畫圖片
  movingSpriteSheet = loadImage(
    '移動/00.png',
    () => console.log('移動圖片載入成功！')
  );
  // 載入射擊動畫圖片
  shootingSpriteSheet = loadImage(
    '射/00.png',
    () => console.log('射擊圖片載入成功！')
  );
  // 載入槍動畫圖片
  gunSpriteSheet = loadImage(
    '槍/00.png',
    () => console.log('槍圖片載入成功！')
  );
  // 載入雙刀動畫圖片
  dualBladesSpriteSheet = loadImage(
    '雙刀/00.png',
    () => console.log('雙刀圖片載入成功！')
  );
  // 載入第二個角色的待機動畫圖片
  secondIdleSpriteSheet = loadImage(
    '二站/00.png',
    () => console.log('第二個角色待機圖片載入成功！')
  );
}

/**
 * setup() 函式在程式開始時僅執行一次，用於初始化設定
 */
function setup() {
  // 建立一個佔滿整個瀏覽器視窗的畫布
  createCanvas(windowWidth, windowHeight);

  // 初始化角色位置在畫布中央
  characterX = width / 2;
  characterY = height / 2;
  character2X = width / 2 + 150; // 將第二個角色放在第一個角色右邊
  character2Y = height / 2;

  // --- 處理待機動畫 ---
  let idlePreciseW = IDLE_SPRITE_WIDTH / IDLE_TOTAL_FRAMES;
  let idleRoundedW = floor(idlePreciseW);
  for (let i = 0; i < IDLE_TOTAL_FRAMES; i++) {
    // 使用 round() 計算精確的 x 座標，避免誤差累積
    let x = round(i * idlePreciseW);
    let frame = idleSpriteSheet.get(x, 0, idleRoundedW, IDLE_SPRITE_HEIGHT);
    idleFrames.push(frame);
  }

  // --- 處理移動動畫 ---
  let movingPreciseW = MOVING_SPRITE_WIDTH / MOVING_TOTAL_FRAMES;
  let movingRoundedW = floor(movingPreciseW);
  for (let i = 0; i < MOVING_TOTAL_FRAMES; i++) {
    // 使用 round() 計算精確的 x 座標，避免誤差累積
    let x = round(i * movingPreciseW);
    let frame = movingSpriteSheet.get(x, 0, movingRoundedW, MOVING_SPRITE_HEIGHT);
    movingFrames.push(frame);
  }

  // --- 處理射擊動畫 ---
  // 由於 2296 / 17 不是整數，直接用 floor() 會導致切割誤差累積而破圖。
  // 我們需要更精確地計算每一格的起始位置。
  const preciseFrameWidth = SHOOTING_SPRITE_WIDTH / SHOOTING_TOTAL_FRAMES;
  const roundedFrameWidth = floor(preciseFrameWidth); // 使用取整後的寬度進行擷取

  for (let i = 0; i < SHOOTING_TOTAL_FRAMES; i++) {
    // 使用 round() 計算每一格精確的起始 x 座標，避免誤差累積
    let x = round(i * preciseFrameWidth);
    let frame = shootingSpriteSheet.get(x, 0, roundedFrameWidth, SHOOTING_SPRITE_HEIGHT);
    shootingFrames.push(frame);
  }

  // --- 處理槍動畫 ---
  let gunPreciseW = GUN_SPRITE_WIDTH / GUN_TOTAL_FRAMES;
  let gunRoundedW = floor(gunPreciseW);
  for (let i = 0; i < GUN_TOTAL_FRAMES; i++) {
    // 使用 round() 計算精確的 x 座標，避免誤差累積
    let x = round(i * gunPreciseW);
    let frame = gunSpriteSheet.get(x, 0, gunRoundedW, GUN_SPRITE_HEIGHT);
    gunFrames.push(frame);
  }

  // --- 處理雙刀動畫 ---
  let dualBladesPreciseW = DUALBLADES_SPRITE_WIDTH / DUALBLADES_TOTAL_FRAMES;
  let dualBladesRoundedW = floor(dualBladesPreciseW);
  for (let i = 0; i < DUALBLADES_TOTAL_FRAMES; i++) {
    // 使用 round() 計算精確的 x 座標，避免誤差累積
    let x = round(i * dualBladesPreciseW);
    let frame = dualBladesSpriteSheet.get(x, 0, dualBladesRoundedW, DUALBLADES_SPRITE_HEIGHT);
    dualBladesFrames.push(frame);
  }

  // --- 處理第二個角色待機動畫 ---
  let secondIdlePreciseW = SECOND_IDLE_SPRITE_WIDTH / SECOND_IDLE_TOTAL_FRAMES;
  let secondIdleRoundedW = floor(secondIdlePreciseW);
  for (let i = 0; i < SECOND_IDLE_TOTAL_FRAMES; i++) {
    // 使用 round() 計算精確的 x 座標，避免誤差累積
    let x = round(i * secondIdlePreciseW);
    let frame = secondIdleSpriteSheet.get(x, 0, secondIdleRoundedW, SECOND_IDLE_SPRITE_HEIGHT);
    secondIdleFrames.push(frame);
  }

  // 設定 image() 函式的繪圖模式為中心對齊
  // 這樣圖片的中心會對準我們指定的 (x, y) 座標
  imageMode(CENTER);
}

/**
 * draw() 函式會以高頻率不斷重複執行，負責繪製每一幀的畫面
 */
function draw() {
  // 設定畫布背景顏色
  background('#57E2E5');

  // --- 處理鍵盤輸入 (當不在任何攻擊動畫中時才能移動) ---
  if (!isShooting && !isGunAttack && !isDualBladesAttack) {
    isMoving = false; // 每幀開始時先假設沒有移動
    if (keyIsDown(LEFT_ARROW)) {
      characterX -= CHARACTER_SPEED;
      isMoving = true;
      facingDirection = -1; // 朝左
    }
    if (keyIsDown(RIGHT_ARROW)) {
      characterX += CHARACTER_SPEED;
      isMoving = true;
      facingDirection = 1; // 朝右
    }
    if (keyIsDown(UP_ARROW)) {
      characterY -= CHARACTER_SPEED;
      isMoving = true;
    }
    if (keyIsDown(DOWN_ARROW)) {
      characterY += CHARACTER_SPEED;
      isMoving = true;
    }
  }

  // --- 選擇並繪製動畫 ---
  let currentFrames;
  let totalFrames;
  let frameIndex;

  if (isDualBladesAttack) {
    currentFrames = dualBladesFrames;
    totalFrames = DUALBLADES_TOTAL_FRAMES;
    // 使用專用的計數器來播放一次性動畫
    frameIndex = floor(dualBladesFrameCounter / ANIMATION_SPEED);
    if (frameIndex >= totalFrames) {
      // 動畫播放完畢
      isDualBladesAttack = false;
      dualBladesFrameCounter = 0;
      // 切換回待機動畫
      currentFrames = idleFrames;
      totalFrames = IDLE_TOTAL_FRAMES;
      frameIndex = floor((frameCount / ANIMATION_SPEED) % totalFrames);
    } else {
      dualBladesFrameCounter++;
    }
  }
  else if (isGunAttack) {
    currentFrames = gunFrames;
    totalFrames = GUN_TOTAL_FRAMES;
    // 使用專用的計數器來播放一次性動畫
    frameIndex = floor(gunFrameCounter / ANIMATION_SPEED);
    if (frameIndex >= totalFrames) {
      // 動畫播放完畢
      isGunAttack = false;
      gunFrameCounter = 0;
      // 切換回待機動畫
      currentFrames = idleFrames;
      totalFrames = IDLE_TOTAL_FRAMES;
      frameIndex = floor((frameCount / ANIMATION_SPEED) % totalFrames);
    } else {
      gunFrameCounter++;
    }
  }
  else if (isShooting) {
    currentFrames = shootingFrames;
    totalFrames = SHOOTING_TOTAL_FRAMES;
    // 使用專用的計數器來播放一次性動畫
    frameIndex = floor(shootingFrameCounter / ANIMATION_SPEED);
    if (frameIndex >= totalFrames) {
      // 動畫播放完畢
      isShooting = false;
      shootingFrameCounter = 0;
      // 切換回待機動畫
      currentFrames = idleFrames;
      totalFrames = IDLE_TOTAL_FRAMES;
      frameIndex = floor((frameCount / ANIMATION_SPEED) % totalFrames);
    } else {
      shootingFrameCounter++;
    }
  } else if (isMoving) {
    currentFrames = movingFrames;
    totalFrames = MOVING_TOTAL_FRAMES;
    frameIndex = floor((frameCount / ANIMATION_SPEED) % totalFrames);
  } else {
    currentFrames = idleFrames;
    totalFrames = IDLE_TOTAL_FRAMES;
    frameIndex = floor((frameCount / ANIMATION_SPEED) % totalFrames);
  }

  if (currentFrames.length > 0) {
    let frame = currentFrames[frameIndex];

    // push() 和 pop() 用於建立一個獨立的繪圖狀態，避免 scale 影響到其他元素
    push();
    translate(characterX, characterY); // 將畫布原點移動到角色位置
    scale(facingDirection, 1); // 根據面朝方向翻轉 X 軸
    image(frame, 0, 0); // 在新的原點 (0,0) 繪製圖片
    pop();
  }

  // --- 繪製第二個角色 ---
  if (secondIdleFrames.length > 0) {
    // 計算當前應該顯示的幀
    let secondFrameIndex = floor((frameCount / ANIMATION_SPEED) % SECOND_IDLE_TOTAL_FRAMES);
    let secondFrame = secondIdleFrames[secondFrameIndex];
    // 繪製第二個角色 (目前沒有左右翻轉功能)
    image(secondFrame, character2X, character2Y);
  }

  
}

/**
 * 當鍵盤按鍵被按下一次時，p5.js 會自動呼叫此函式
 */
function keyPressed() {
  // 如果不在任何攻擊狀態下
  if (!isShooting && !isGunAttack && !isDualBladesAttack) {
    // 如果按下的是空白鍵 (keyCode 32)
    if (keyCode === 32) {
    isShooting = true;
    shootingFrameCounter = 0; // 重置射擊動畫計數器
    } // 如果按下的是 'x' 鍵 (keyCode 88)
    else if (keyCode === 88) {
    isGunAttack = true;
    gunFrameCounter = 0; // 重置槍動畫計數器
    } // 如果按下的是 'c' 鍵 (keyCode 67)
    else if (keyCode === 67) {
      isDualBladesAttack = true;
      dualBladesFrameCounter = 0; // 重置雙刀動畫計數器
    }
  }
}

/**
 * 當瀏覽器視窗大小改變時，自動被 p5.js 呼叫
 */
function windowResized() {
  // 將畫布大小調整為新的視窗大小
  resizeCanvas(windowWidth, windowHeight);
}
