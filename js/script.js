// Отменяю вызов контекстного меню браузера при нажатии на правую кнопку мыши
document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
})

// Основные блоки игры
let mainMenu =       document.getElementById("main-menu");
let ratingMenu =     document.getElementById("rating-menu");
let modeSelection =  document.getElementById("mode-selection");
let changeSettings = document.getElementById("change-settings");
let pauseMenu =      document.getElementById("pause-menu");
let gameOverMenu =   document.getElementById("game-over-menu");

// Холст на котором будет рисоваться игра
let gaming =         document.getElementById("gaming");

// Кнопки главного меню
let continueGameButton = document.getElementById("continue-game-button");
let newGameButton =      document.getElementById("new-game-button");
let ratingMenuButton =   document.getElementById("rating-menu-button");

// Кнопки в меню выбора режима игры
let standartModeButton =                document.getElementById("standart-mode-button");
let customModeButton =                  document.getElementById("custom-mode-button");
let fromModeSelectionToMainMenuButton = document.getElementById("from-mode-selection-to-main-menu-button");

// Кнопки в меню паузы
let resumeGameButton = document.getElementById("resume-game-button");
let saveAndOutButton = document.getElementById("save-and-out-button");

// Кнопки в меню своих настроек
let startCustomGameButton = document.getElementById("start-custom-game-button");
let fromChangeSettingsToModeSelectionButton = document.getElementById("from-change-settings-to-mode-selection-button");

// Кнопки в меню конца игры
let restartGameButton = document.getElementById("restart-game");
let fromGameOverMenuToMainMenuButton = document.getElementById("from-game-over-menu-to-main-menu");

// Надпись с результатом в меню конца игры
let gameResultInscription = document.getElementById("game-result");

// Поле ввода для изменения имени игрока в меню рейтинга и кнопка для изменения имени
let changeNameInput = document.getElementById('change-name-input');
let changeNameButton = document.getElementById('change-name-button');

// По умолчанию скрываем все блоки кроме главного меню
ratingMenu.style.display =     'none';
gaming.style.display =         'none';
modeSelection.style.display =  'none';
changeSettings.style.display = 'none';
pauseMenu.style.display =      'none';
gameOverMenu.style.display =   'none';

// Ячейки таблицы рейтинга
// Имена
let resultsNames = [];
for (let i = 0; i < 5; i++) {
    resultsNames.push(document.getElementById(`result-${i + 1}-name`));
}
// Значения
let resultsValues = [];
for (let i = 0; i < 5; i++) {
    resultsValues.push(document.getElementById(`result-${i + 1}-value`));
}



// Заходим в меню рейтинга
ratingMenuButton.onclick = function() {
    // Пишем текущее имя игрока в поле для его ввода
    if (localStorage.getItem('playerName') == null) changeNameInput.value = "Игрок";
    else changeNameInput.value = localStorage.getItem('playerName');

    // Загружаем результаты в рейтинг
    if (localStorage.getItem('gameResults') != null) {
        let gameResults = JSON.parse(localStorage.getItem('gameResults'));
        for (let i = 0; i < 5; i++) {
            resultsNames[i].innerHTML = gameResults[i][0];
            resultsValues[i].innerHTML = `${Math.floor(gameResults[i][1] / 60)}:${gameResults[i][1] % 60}`;
        }
    }

    mainMenu.style.display =   'none';
    ratingMenu.style.display = 'flex';
}

// Меняем имя игрока при нажатии на соответствующую кнопку в меню рейтинга
changeNameButton.onclick = function() {
    if (changeNameInput.value.length > 0) localStorage.setItem('playerName', changeNameInput.value);
}

// Кнопка выхода из меню рейтинга в главное меню
let fromRatingToMainMenuButton = document.getElementById("from-rating-to-main-menu-button");

// Выходим из меню рейтинга в главное меню
fromRatingToMainMenuButton.onclick = function() {
    ratingMenu.style.display = 'none';
    mainMenu.style.display =   'flex';
}

// Заходим из главного меню в меню выбора режима (новая игра)
newGameButton.onclick = function() {
    mainMenu.style.display =      'none';
    modeSelection.style.display = 'flex';
}

// Выходим из меню выбора режима в главное меню
fromModeSelectionToMainMenuButton.onclick = function() {
    modeSelection.style.display = 'none';
    mainMenu.style.display =      'flex';
}

// КОД ОТВЕЧАЮЩИЙ НЕПОСРЕДСТВЕННО ЗА ПРОЦЕСС ИГРЫ ------------------------------- >
const canvas = document.getElementById('gaming');
const ctx = canvas.getContext('2d');

// Класс всех игровых объектов
class gameObject {
    x;
    y;
    width;
    height;
    speed;              // скорость движения
    directionVector;    // единичный вектор направления движения

    constructor (x = 0, y = 0, width = 1, height = 1, speed = 0, directionVector = [0, 0]) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.directionVector = directionVector;
    }

    static getXDirectionVector(obj) {
        return obj.directionVector[0];
    }
    static getYDirectionVector(obj) {
        return obj.directionVector[1];
    }
    static setXDirectionVector(obj, value) {
        obj.directionVector[0] = value;
    }
    static setYDirectionVector(obj, value) {
        obj.directionVector[1] = value;
    }

    static getSpeed(obj) {
        return obj.speed;
    }
    static setSpeed(obj, value) {
        obj.speed = value;
    }

    static getX(obj) {
        return obj.x;
    }
    static setX(obj, value) {
        obj.x = value;
    }

    static getY(obj) {
        return obj.y;
    }
    static setY(obj, value) {
        obj.y = value;
    }

    static getWidth(obj) {
        return obj.width;
    }

    static getHeight(obj) {
        return obj.height;
    }
 
    // Проверка пересечения объектов по значениям их размеров и положения на плоскости
    static valuesRectIntersection(x1, y1, w1, h1, x2, y2, w2, h2) {
        if (x2 + w2 < x1 || x2 > x1 + w1 || y2 + h2 < y1 || y2 > y1 + h1) {
            return false;
        } else {
            return true;
        }
    }

    // Проверка пересечения объектов по ссылкам на них
    static linkRectIntersection(gameObject1, gameObject2) {
        const x1 = gameObject.getX(gameObject1);
        const y1 = gameObject.getY(gameObject1);
        const w1 = gameObject.getWidth(gameObject1);
        const h1 = gameObject.getHeight(gameObject1);

        const x2 = gameObject.getX(gameObject2);
        const y2 = gameObject.getY(gameObject2);
        const w2 = gameObject.getWidth(gameObject2);
        const h2 = gameObject.getHeight(gameObject2);

        return this.valuesRectIntersection(x1, y1, w1, h1, x2, y2, w2, h2);
    }

    // Движение объекта в зависимости от его направления
    static move(obj) {
        // Находим модуль вектора направления объекта, округляем до сотых
        let vectorModule = Math.round((gameObject.getXDirectionVector(obj) ** 2 + gameObject.getYDirectionVector(obj) ** 2) ** 0.5 * 100) / 100;
        
        // Делим вектор на модуль чтобы нормализовать его (делаем вектор направления единичным), округляем до сотых
        if (vectorModule != 0) {
            obj.directionVector[0] = Math.round(obj.directionVector[0] / vectorModule * 100) / 100;
            obj.directionVector[1] = Math.round(obj.directionVector[1] / vectorModule * 100) / 100;
        }

        // Двигаем объект в направлении заданном единичным вектором направления со скоростью объекта
        gameObject.setX(obj, gameObject.getX(obj) + gameObject.getSpeed(obj) * gameObject.getXDirectionVector(obj));
        gameObject.setY(obj, gameObject.getY(obj) + gameObject.getSpeed(obj) * gameObject.getYDirectionVector(obj));
    }
}

// Начальные значения у некоторых переменных могут быть другими (при игре со своими настройками), поэтому для них
// созданы их копии (с припиской Default в конце имени), в к-х и будут храниться эти начальные значения.

let FPS = 1000 / 25;                                        // Частота кадров
let rateComplications = 3;                                  // Через какие промежутки времени игра будет усложняться (в сек.)
let timeNextComplication = rateComplications * FPS;         // Сколько времени осталось до следующего усложения (в кадрах)

let minutes = 0;                                            // Сколько минут продержался игрок
let seconds = 0;                                            // Сколько секунд продержался игрок
let frames = 0;                                             // Сколько кадров продержался игрок

let pressA = false;                                         // Какие кнопки нажаты на клавиатуре
let pressD = false;
let pressW = false;
let pressS = false;

let playerSpeedDefault = 12; // (свои настройки)
let playerSpeed = playerSpeedDefault;                       // Скорость игрока

let playerWidth = 60;                                       // Ширина и высота игрока
let playerHeight = 40;

// Объект игрока
let player = new gameObject(1280/2 - playerWidth/2, 720/2 - playerHeight/2, playerWidth, playerHeight, playerSpeed);

let playerMaxHealthDefault = 5; // (свои настройки)
player.maxHealth = playerMaxHealthDefault;                  // Максимальное здоровье игрока
player.health = player.maxHealth;                           // Текущее здоровье игрока

let playerAmmunitionSizeDefault = 30; // (свои настройки)
player.ammunitionSize = playerAmmunitionSizeDefault;        // Сколько максимально пуль в боезапасе игрока
player.ammunition = player.ammunitionSize;                  // Сколько сейчас пуль в боезапасе игрока

player.isShooting = false;                                  // Стреляет ли игрок

let playerReloadDefault = 8; // (свои настройки)
player.RELOAD = playerReloadDefault;                        // Сколько времени в кадрах требуется для перезарядки
player.reload = 0;                                          // Сколько времени осталось до следующего выстрела

let playerBulletSizeDefault = 10; // (свои настройки)
player.bulletSize = playerBulletSizeDefault;                // Размер пуль

let playerBulletSpeedDefault = 16; // (свои настройки)
player.bulletSpeed = playerBulletSpeedDefault;              // Скорость пуль

let bullets = [];                                         // Массив пуль

let bonuses = [];                                         // Массив бонусов

let minTimeBonusDefault = FPS * 5;  // (свои настройки)
let maxTimeBonusDefault = FPS * 25; // (свои настройки)
let minTimeBonus = minTimeBonusDefault;                     // Минимальное и максимальное время появления бонуса
let maxTimeBonus = maxTimeBonusDefault;

// Время до появления следующего бонуса
let timeBonus = RandN(minTimeBonus, maxTimeBonus + 1, true);

let asteroids = [];                                       // Массив астероидов

// Начальная и конечная частота появления астероидов
let startSpawnRateAsteroidsDefault = 25; // (свои настройки)
let finishSpawnRateAsteroidsDefault = 1; // (свои настройки)
let startSpawnRateAsteroids = startSpawnRateAsteroidsDefault;
let finishSpawnRateAsteroids = finishSpawnRateAsteroidsDefault;

let spawnRateAsteroids = startSpawnRateAsteroids;           // Текущая частота появления астероидов
let timeNextAsteroid = spawnRateAsteroids;                  // Время до появления следующего астероида

let startMinSpeedAsteroid = 1;                              // Минимальная и максимальная скорость астероидов в начале
let startMaxSpeedAsteroid = 8;

let finishMinSpeedAsteroid = 7;                             // Минимальная и максимальная скорость астероидов в конце
let finishMaxSpeedAsteroid = 35;

let minSpeedAsteroid = startMinSpeedAsteroid;               // Текущая минимальная и максимальная скорость астероидов
let maxSpeedAsteroid = startMaxSpeedAsteroid;

let smallAsteroidStrength = 1;                              // Прочность маленького, среднего и большого астероидов
let mediumAsteroidStrength = 2;                             // Т.е. сколько выстрелов нужно чтобы их уничтожить
let bigAsteroidStrength = 3;

// Отслеживание нажатий клавиш на клавиатуре
document.addEventListener('keydown', function(event) {

    // Движение игрока по горизонтали
    if (event.code === 'KeyA') {
        pressA = true;
    } else if (event.code === 'KeyD') {
        pressD = true;
    }

    // Движение игрока по вертикали
    if (event.code === 'KeyW') {
        pressW = true;
    } else if (event.code === 'KeyS') {
        pressS = true;
    }
})

// Отслеживание отпускания клавиш на клавиатуре
document.addEventListener('keyup', function(event) {
    // Игрок перестаёт двигаться по горизонтали
    if (event.code === 'KeyA') {
        pressA = false;
    } else if (event.code === 'KeyD') {
        pressD = false;
    }

    // Игрок перестаёт двигаться по вертикали 
    if (event.code === 'KeyW') {
        pressW = false;
    } else if (event.code === 'KeyS') {
        pressS = false;
    }
})

let mouseX; // координаты курсора или нажатия пальцем
let mouseY;

// Процедура расчитывающая координаты курсора/нажатия c учётом полноэкранного режима
function dependFullScreen() {
    if (document.fullscreenElement) {
        let sideStripe = 0; // Боковая полоса в полноэкранном режиме (если дисплей широкий)
        let topStripe = 0;  // Верхняя полоса в полноэкранном режиме (если дисплей высокий)
        
        // Дисплей шире или выше чем предполагается
        if (Math.floor(window.innerWidth / window.innerHeight) > Math.floor(1280 / 720)) {
            sideStripe = (window.innerWidth - (window.innerHeight / 720 * 1280)) / 2;
        } else if (Math.floor(window.innerWidth / window.innerHeight) < Math.floor(1280 / 720)) {
            topStripe = (window.innerHeight - (window.innerWidth / 1280 * 720)) / 2;
        }

        mouseX = Math.floor((mouseX - sideStripe) * (1280 / (window.innerWidth - 2 * sideStripe)));
        mouseY = Math.floor((mouseY - topStripe) * (720 / (window.innerHeight - 2 * topStripe)));
    } else {
        // Учитываем растягивание холста на всю ширину и высоту окна браузера
        mouseX = Math.floor(mouseX / window.innerWidth * 1280);
        mouseY = Math.floor(mouseY / window.innerHeight * 720);
    }
}

// Отслеживание нажатия кнопки мыши
gaming.addEventListener("mousedown", function(event) {
    // Вычисляем координаты
    mouseX = event.clientX;
    mouseY = event.clientY;

    // Учитываем полноэкранный режим
    dependFullScreen();

    // Ставим на паузу если перед нажатием курсор был на кнопке паузы
    if (mouseX >= 1160 && mouseX <= 1240 && mouseY >= 40 && mouseY <= 120) {
        gaming.style.display =    'none';
        pauseMenu.style.display = 'flex';
        isGamePause = true;
        // Если процесс игры останавливается/завершается, то мы выходим из полноэкранного режима
        if (document.fullscreenElement) document.exitFullscreen();
    } else if (mouseX >= 1040 && mouseX <= 1120 && mouseY >= 40 && mouseY <= 120) {
        // Если игрок нажимает на кнопку полноэкранного режима, то игра переходит в полноэкранный режим или выходит из него
        if (!document.fullscreenElement) {
            gaming.requestFullscreen();
          } else {
            document.exitFullscreen();
          }
    } else{
        // В ином случае игрок стреляет
        player.isShooting = true;
    }
})

gaming.addEventListener("mouseup", function(event) {
    player.isShooting = false;
})

// Координаты джостика
let joystickCenterX = 1125;
let joystickCenterY = 575;

let joystickCoordinateX = joystickCenterX;
let joystickCoordinateY = joystickCenterY;

// Процедура движения джостика
function joystickMove() {
    // Вычисляем расстояние до центра джостика и сравниваем с его радиусом
    let distance = Math.sqrt((joystickCenterX - mouseX) ** 2 + (joystickCenterY - mouseY) ** 2);
    if (distance <= 100) {
        joystickCoordinateX = mouseX;
        joystickCoordinateY = mouseY;
    }
}

// Отслеживание касаний пальцем (Для мобильных устройств)
gaming.addEventListener("touchstart", function(event) {
    // Вычисляем координаты
    mouseX = event.changedTouches[0].pageX;
    mouseY = event.changedTouches[0].pageY;

    // Учитываем полноэкранный режим
    dependFullScreen();

    joystickMove();

    // Ставим на паузу если перед нажатием курсор был на кнопке паузы
    if (mouseX >= 1160 && mouseX <= 1240 && mouseY >= 40 && mouseY <= 120) {
        gaming.style.display =    'none';
        pauseMenu.style.display = 'flex';
        isGamePause = true;
        // Если процесс игры останавливается/завершается, то мы выходим из полноэкранного режима
        if (document.fullscreenElement) document.exitFullscreen();
    } else if (mouseX >= 1040 && mouseX <= 1120 && mouseY >= 40 && mouseY <= 120) {
        // Если игрок нажимает на кнопку полноэкранного режима, то игра переходит в полноэкранный режим или выходит из него
        if (!document.fullscreenElement) {
            gaming.requestFullscreen();
          } else {
            document.exitFullscreen();
          }
    } else if (mouseX >= 40 && mouseX <= 190 && mouseY >= 530 && mouseY <= 680) {
        // Нажатие на кнопку стрельбы
        player.isShooting = !player.isShooting;
    }
})

// Отслеживание движений пальцем по экрану (Для мобильных устройств)
gaming.addEventListener("touchmove", function(event) {
    // Вычисляем координаты
    mouseX = event.changedTouches[0].pageX;
    mouseY = event.changedTouches[0].pageY;

    // Учитываем полноэкранный режим
    dependFullScreen();

    joystickMove();
})

let playerImg = new Image();   // Картинка игрока
playerImg.src = "img/player/player.png";

// Картинки игрока при получении урона, столкновении с бонусами
let playerDamageImg = new Image();
playerDamageImg.src = "img/player/playerDamage.png";
let playerHealthUpImg = new Image();
playerHealthUpImg.src = "img/player/playerHealthUp.png";
let playerAmmunitionUpImg = new Image();
playerAmmunitionUpImg.src = "img/player/playerAmmunitionUp.png";

// Номер текущей картинки игрока и (если она не стадартная) сколько кадров ещё её отрисовывать
let numberPlayerImg = 0;
let framesPlayerImg = 0;

// Картинки бонусов
let healthBonusImg = new Image();
healthBonusImg.src = "img/healthBonus.png";
let bulletBonusImg = new Image();
bulletBonusImg.src = "img/bulletsBonus.png";

// Процедура для получения кадров анимации в массив
function getAnimationFrames(array, count, path) {
    for (let i = 0; i < count; i++) {
        array.push(new Image());
        array[i].src = `${path}/${i}.gif`;
    }
}

// Анимации астероидов
let smallAsteroidImgs = [];
getAnimationFrames(smallAsteroidImgs, 16, "img/smallAsteroid");

let mediumAsteroidImgs = [];
getAnimationFrames(mediumAsteroidImgs, 14, "img/mediumAsteroid");

let bigAsteroidImgs = [];
getAnimationFrames(bigAsteroidImgs, 12, "img/bigAsteroid");

// Картинка фон
let backgroundImg = new Image();
backgroundImg.src = "img/background.png";
let backgroundY1 = 0, backgroundY2 = -720;

// Разрушение пули
let bulletDestroyImgs = [];
getAnimationFrames(bulletDestroyImgs, 8, "img/bulletDestroy");
let bulletDestroyEffects = [];

// разрушение маленького астероида
let smallAsteroidDestroyImgs = [];
getAnimationFrames(smallAsteroidDestroyImgs, 6, "img/smallAsteroidDestroy");
let smallAsteroidDestroyEffects = [];

// разрушение среднего астероида
let mediumAsteroidDestroyImgs = [];
getAnimationFrames(mediumAsteroidDestroyImgs, 7, "img/mediumAsteroidDestroy");
let mediumAsteroidDestroyEffects = [];

// разрушение большого астероида
let bigAsteroidDestroyImgs = [];
getAnimationFrames(bigAsteroidDestroyImgs, 7, "img/bigAsteroidDestroy");
let bigAsteroidDestroyEffects = [];

// Процедура для отрисовки эффекта
function drawEffect(arrayImgs, arrayEffects) {
    for (let i = 0; i < arrayEffects.length; i++) {
        if (arrayEffects[i][2] > arrayImgs.length - 1) {
            arrayEffects.splice(i, 1);
            i--;
        } else {
            ctx.drawImage(arrayImgs[arrayEffects[i][2]], arrayEffects[i][0], arrayEffects[i][1]);
            arrayEffects[i][2]++;
        }
    }
}

// Процедура отрисовки кадра
function frameDraw() {
    // Рисуем фон
    ctx.drawImage(backgroundImg, 0, backgroundY1);
    ctx.drawImage(backgroundImg, 0, backgroundY2);
    if (backgroundY1 < 720) backgroundY1+=2;
    else backgroundY1 = -718;
    if (backgroundY2 < 720) backgroundY2+=2;
    else backgroundY2 = -718;

    // ОТРИСОВКА ИГРОВЫХ ОБЪЕКТОВ

    // отрисовываем игрока
    if (numberPlayerImg == 1) {
        ctx.drawImage(playerDamageImg, gameObject.getX(player), gameObject.getY(player));
    } else if (numberPlayerImg == 2) {
        ctx.drawImage(playerHealthUpImg, gameObject.getX(player), gameObject.getY(player));
    } else if (numberPlayerImg == 3) {
        ctx.drawImage(playerAmmunitionUpImg, gameObject.getX(player), gameObject.getY(player));
    } else {
        ctx.drawImage(playerImg, gameObject.getX(player), gameObject.getY(player));
    }
    if (framesPlayerImg > 0) framesPlayerImg--;
    else numberPlayerImg = 0;

    // Отрисовываем бонусы
    for (let i = 0; i < bonuses.length; i++) {
        if (bonuses[i].type == 'health') ctx.drawImage(healthBonusImg, gameObject.getX(bonuses[i]), gameObject.getY(bonuses[i]));
        else ctx.drawImage(bulletBonusImg, gameObject.getX(bonuses[i]), gameObject.getY(bonuses[i]));
    }

    // Отрисовываем пули
    ctx.fillStyle = '#80DAEB';
    ctx.strokeStyle = '#80DAEB';
    for (let i = 0; i < bullets.length; i++) {
        ctx.beginPath();
        ctx.arc(gameObject.getX(bullets[i]), gameObject.getY(bullets[i]) + 6, player.bulletSize / 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }

    // Отрисовываем астероиды
    for (let i = 0; i < asteroids.length; i++) {
        if (gameObject.getHeight(asteroids[i]) == 30) {
            ctx.drawImage(smallAsteroidImgs[asteroids[i].numberFrame], gameObject.getX(asteroids[i]), gameObject.getY(asteroids[i]));
            if (asteroids[i].numberFrame < 15) asteroids[i].numberFrame++;
            else asteroids[i].numberFrame = 0;
            
        } else if (gameObject.getHeight(asteroids[i]) == 50) {
            ctx.drawImage(mediumAsteroidImgs[asteroids[i].numberFrame], gameObject.getX(asteroids[i]), gameObject.getY(asteroids[i]));
            if (asteroids[i].numberFrame < 13) asteroids[i].numberFrame++;
            else asteroids[i].numberFrame = 0;
        } else {
            ctx.drawImage(bigAsteroidImgs[asteroids[i].numberFrame], gameObject.getX(asteroids[i]), gameObject.getY(asteroids[i]));
            if (asteroids[i].numberFrame < 11) asteroids[i].numberFrame++;
            else asteroids[i].numberFrame = 0;
        }
    }

    // Отрисовываем эффекты уничтожения астероидов
    drawEffect(smallAsteroidDestroyImgs, smallAsteroidDestroyEffects);
    drawEffect(mediumAsteroidDestroyImgs, mediumAsteroidDestroyEffects);
    drawEffect(bigAsteroidDestroyImgs, bigAsteroidDestroyEffects);


    // Отрисовываем эффекты уничтожения пуль
    drawEffect(bulletDestroyImgs, bulletDestroyEffects);

    // ОТРИСОВКА ИГРОВОГО ИНТЕРФЕЙСА

    // отрисовка шкалы здоровья игрока
    let remaminingHealth; // Отношение текущего здоровья игрока к максимальному
    if (player.health > 0) remaminingHealth = player.health / player.maxHealth;
    else remaminingHealth = 0;
    
    ctx.fillStyle = '#480607';
    ctx.fillRect(30, 30, 60, 20);
    ctx.fillStyle = 'red';
    ctx.fillRect(30, 30, Math.floor(remaminingHealth * 60), 20);

    // отрисовка шкалы боезапаса игрока
    let remainingAmmunition = player.ammunition / player.ammunitionSize;; // Отношение текущего боезапаса к максимальному

    ctx.fillStyle = "#1E90FF";
    ctx.fillRect(120, 30, 60, 20);
    ctx.fillStyle = "#80DAEB";
    ctx.fillRect(120, 30, Math.floor(remainingAmmunition * 60), 20);

    // отрисовка таймера
    ctx.fillStyle = '#00FF00';
    ctx.font = "36px serif";
    ctx.fillText(`${minutes}:${seconds}`, 210, 50);

    // отрисовка кнопки паузы
    ctx.strokeStyle = 'white';
    ctx.strokeRect(1160, 40, 80, 80);
    ctx.strokeRect(1175, 55, 20, 50);
    ctx.strokeRect(1205, 55, 20, 50);

    // отрисовка кнопки полноэкранного режима
    ctx.strokeRect(1040, 40, 80, 80);

    ctx.beginPath();
    ctx.moveTo(1075, 50);
    ctx.lineTo(1050, 50);
    ctx.lineTo(1050, 75);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(1085, 50);
    ctx.lineTo(1110, 50);
    ctx.lineTo(1110, 75);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(1050, 85);
    ctx.lineTo(1050, 110);
    ctx.lineTo(1075, 110);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(1110, 85);
    ctx.lineTo(1110, 110);
    ctx.lineTo(1085, 110);
    ctx.stroke();

    // Отрисовка кнопки стрельбы и джостика (для мобильных устройств)
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        ctx.beginPath();
        ctx.arc(joystickCenterX, joystickCenterY, 100, 0, 2 * Math.PI);
        ctx.stroke();
    
        ctx.beginPath();
        ctx.arc(joystickCoordinateX, joystickCoordinateY, 20, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.stroke();
    
        // Красим кнопку стрельбы в красный если игрок стреляет
        if (player.isShooting) ctx.strokeStyle = 'red';
        else ctx.strokeStyle = 'white';
        ctx.strokeRect(40, 530, 150, 150);
    }
}

// Функция для генерации случайного числа в заданном диапазоне
function RandN(min, max, isInteger) {
    if (isInteger) {
        return Math.floor(Math.random() * (max - min) + min);
    }
    else {
        return Math.random() * (max - min) + min;
    }
}

// Процедура приводящая значения игровых переменных к начальным
function initialValues() {
    timeNextComplication = rateComplications * FPS;            // Сколько времени осталось до следующего усложения (в кадрах)

    minutes = 0;                                               // Сколько минут продержался игрок
    seconds = 0;                                               // Сколько секунд продержался игрок
    frames = 0;                                                // Сколько кадров продержался игрок

    playerSpeed = playerSpeedDefault;                          // Скорость игрока

    // Объект игрока
    player = new gameObject(1280/2 - playerWidth/2, 720/2 - playerHeight/2, playerWidth, playerHeight, playerSpeed);

    player.maxHealth = playerMaxHealthDefault;                  // Максимальное здоровье игрока
    player.health = player.maxHealth;                           // Текущее здоровье игрока

    player.ammunitionSize = playerAmmunitionSizeDefault;        // Сколько максимально пуль в боезапасе игрока
    player.ammunition = player.ammunitionSize;                  // Сколько сейчас пуль в боезапасе игрока

    player.isShooting = false;                                  // Стреляет ли игрок

    player.RELOAD = playerReloadDefault;                        // Сколько времени в кадрах требуется для перезарядки
    player.reload = 0;                                          // Сколько времени осталось до следующего выстрела

    player.bulletSize = playerBulletSizeDefault;                // Размер пуль

    player.bulletSpeed = playerBulletSpeedDefault;              // Скорость пуль

    bullets = [];                                               // Массив пуль

    bonuses = [];                                               // Массив бонусов

    minTimeBonus = minTimeBonusDefault;                         // Минимальное и максимальное время появления бонуса
    maxTimeBonus = maxTimeBonusDefault;

    // Время до появления следующего бонуса
    timeBonus = RandN(minTimeBonus, maxTimeBonus + 1, true);

    asteroids = [];                                             // Массив астероидов

    // Начальная и конечная частота появления астероидов
    startSpawnRateAsteroids = startSpawnRateAsteroidsDefault;
    finishSpawnRateAsteroids = finishSpawnRateAsteroidsDefault;

    spawnRateAsteroids = startSpawnRateAsteroids;               // Текущая частота появления астероидов
    timeNextAsteroid = spawnRateAsteroids;                      // Время до появления следующего астероида

    minSpeedAsteroid = startMinSpeedAsteroid;                   // Текущая минимальная и максимальная скорость астероидов
    maxSpeedAsteroid = startMaxSpeedAsteroid;

    // Эффекты и положение картинки фона
    numberPlayerImg = 0;
    framesPlayerImg = 0;
    backgroundY1 = 0;
    backgroundY2 = -720;
    bulletDestroyEffects = [];
    smallAsteroidDestroyEffects = [];
    mediumAsteroidDestroyEffects = [];
    bigAsteroidDestroyEffects = [];
}

// Процедура записывающая значения игровых переменных в localStorage (Сохранение игры)
function saveProgress() {
    localStorage.setItem("timeNextComplication", timeNextComplication.toString());

    localStorage.setItem("minutes", minutes.toString());
    localStorage.setItem("seconds", seconds.toString());
    localStorage.setItem("frames", frames.toString());

    localStorage.setItem("player", JSON.stringify(player));

    localStorage.setItem("bullets", JSON.stringify(bullets));

    localStorage.setItem("bonuses", JSON.stringify(bonuses));

    localStorage.setItem("minTimeBonus", minTimeBonus.toString());
    localStorage.setItem("maxTimeBonus", maxTimeBonus.toString());

    localStorage.setItem("timeBonus", timeBonus.toString());

    localStorage.setItem("asteroids", JSON.stringify(asteroids));

    localStorage.setItem("startSpawnRateAsteroids", startSpawnRateAsteroids.toString());
    localStorage.setItem("finishSpawnRateAsteroids", finishSpawnRateAsteroids.toString());

    localStorage.setItem("spawnRateAsteroids", spawnRateAsteroids.toString());
    localStorage.setItem("timeNextAsteroid", timeNextAsteroid.toString());

    localStorage.setItem("minSpeedAsteroid", minSpeedAsteroid.toString());
    localStorage.setItem("maxSpeedAsteroid", maxSpeedAsteroid.toString());

    // Эффекты и положение картинки фона
    localStorage.setItem("numberPlayerImg", numberPlayerImg.toString());
    localStorage.setItem("framesPlayerImg", framesPlayerImg.toString());
    localStorage.setItem("backgroundY1", backgroundY1.toString());
    localStorage.setItem("backgroundY2", backgroundY2.toString());
    localStorage.setItem("bulletDestroyEffects", JSON.stringify(bulletDestroyEffects));
    localStorage.setItem("smallAsteroidDestroyEffects", JSON.stringify(smallAsteroidDestroyEffects));
    localStorage.setItem("mediumAsteroidDestroyEffects", JSON.stringify(mediumAsteroidDestroyEffects));
    localStorage.setItem("bigAsteroidDestroyEffects", JSON.stringify(bigAsteroidDestroyEffects));
}

// Процедура считывающая значения игровых переменных из localStorage (Загрузка игры)
function loadProgress() {
    timeNextComplication = Number.parseInt(localStorage.getItem("timeNextComplication"));

    minutes = Number.parseInt(localStorage.getItem("minutes"));
    seconds = Number.parseInt(localStorage.getItem("seconds"));
    frames = Number.parseInt(localStorage.getItem("frames"));

    player = JSON.parse(localStorage.getItem("player"));

    bullets = JSON.parse(localStorage.getItem("bullets"));
    
    bonuses = JSON.parse(localStorage.getItem("bonuses"));

    minTimeBonus = Number.parseInt(localStorage.getItem("minTimeBonus"));
    maxTimeBonus = Number.parseInt(localStorage.getItem("maxTimeBonus"));

    timeBonus = Number.parseInt(localStorage.getItem("timeBonus"));

    asteroids = JSON.parse(localStorage.getItem("asteroids"));

    startSpawnRateAsteroids = Number.parseInt(localStorage.getItem("startSpawnRateAsteroids"));
    finishSpawnRateAsteroids = Number.parseInt(localStorage.getItem("finishSpawnRateAsteroids"));

    spawnRateAsteroids = Number.parseInt(localStorage.getItem("spawnRateAsteroids"));
    timeNextAsteroid = Number.parseInt(localStorage.getItem("timeNextAsteroid"));

    minSpeedAsteroid = Number.parseInt(localStorage.getItem("minSpeedAsteroid"));
    maxSpeedAsteroid = Number.parseInt(localStorage.getItem("maxSpeedAsteroid"));

    // Эффекты и положение картинки фона
    numberPlayerImg = Number.parseInt(localStorage.getItem("numberPlayerImg"));
    framesPlayerImg = Number.parseInt(localStorage.getItem("framesPlayerImg"));
    backgroundY1 = Number.parseInt(localStorage.getItem("backgroundY1"));
    backgroundY2 = Number.parseInt(localStorage.getItem("backgroundY2"));
    bulletDestroyEffects = JSON.parse(localStorage.getItem("bulletDestroyEffects"));
    smallAsteroidDestroyEffects = JSON.parse(localStorage.getItem("smallAsteroidDestroyEffects"));
    mediumAsteroidDestroyEffects = JSON.parse(localStorage.getItem("mediumAsteroidDestroyEffects"));
    bigAsteroidDestroyEffects = JSON.parse(localStorage.getItem("bigAsteroidDestroyEffects"));
}

// Процедура блокирующая кнопку "продолжить" если нет сохранений, и делающая её доступной если сохранения есть
function continueButtonAccess() {
    if (Number.parseInt(localStorage.getItem("loadExist")) != 1) continueGameButton.disabled = true;
    else continueGameButton.disabled = false;
}

// Выпадающие списки
let playerSpeedSelect =      document.getElementById("player-speed");
let playerHealthSelect =     document.getElementById("player-health");
let playerAmmunitionSelect = document.getElementById("player-ammunition");
let countAsteroidsSelect =   document.getElementById("count-asteroids");
let playerReloadSelect =     document.getElementById('player-reload');
let bulletSizeSelect =       document.getElementById('bullet-size');
let bulletSpeedSelect =      document.getElementById('bullet-speed');
let countBonusesSelect =     document.getElementById('count-bonuses');

// Процедура меняющая стандартное значение некоторых игровых переменных в зависимости от соответствующих выпадающих списков (свои настройки)
function yourSettings() {
    localStorage.setItem('isDefaultSettings', 0); // Записываем в localStorage то, что мы поменяли стандартные настройки

    let selectedPlayerSpeed = Number(playerSpeedSelect.options[playerSpeedSelect.selectedIndex].value);
    let selectedPlayerHealth = Number(playerHealthSelect.options[playerHealthSelect.selectedIndex].value);
    let selectedPlayerAmmunition = Number(playerAmmunitionSelect.options[playerAmmunitionSelect.selectedIndex].value);
    let selectedCountAsteroids = Number(countAsteroidsSelect.options[countAsteroidsSelect.selectedIndex].value);
    let selectedPlayerReload = Number(playerReloadSelect.options[playerReloadSelect.selectedIndex].value);
    let selectedBulletSize = Number(bulletSizeSelect.options[bulletSizeSelect.selectedIndex].value);
    let selectedBulletSpeed = Number(bulletSpeedSelect.options[bulletSpeedSelect.selectedIndex].value);
    let selectedCountBonuses = Number(countBonusesSelect.options[countBonusesSelect.selectedIndex].value);

    switch (selectedPlayerSpeed) {
        case 1:
            playerSpeedDefault = 4;
            break;
        case 2:
            playerSpeedDefault = 8;
            break;
        case 3:
            playerSpeedDefault = 12;
            break;
        case 4:
            playerSpeedDefault = 18;
            break;
        case 5:
            playerSpeedDefault = 25;
            break;
    }

    switch (selectedPlayerHealth) {
        case 1:
            playerMaxHealthDefault = 1;
            break;
        case 2:
            playerMaxHealthDefault = 3;
            break;
        case 3:
            playerMaxHealthDefault = 5;
            break;
        case 4:
            playerMaxHealthDefault = 8;
            break;
        case 5:
            playerMaxHealthDefault = 15;
            break;
    }

    switch (selectedPlayerAmmunition) {
        case 1:
            playerAmmunitionSizeDefault = 10;
            break;
        case 2:
            playerAmmunitionSizeDefault = 20;
            break;
        case 3:
            playerAmmunitionSizeDefault = 30;
            break;
        case 4:
            playerAmmunitionSizeDefault = 50;
            break;
        case 5:
            playerAmmunitionSizeDefault = 100;
            break;
    }

    switch (selectedCountAsteroids) {
        case 1:
            startSpawnRateAsteroidsDefault = 50;
            finishSpawnRateAsteroidsDefault = 15;
            break;
        case 2:
            startSpawnRateAsteroidsDefault = 40;
            finishSpawnRateAsteroidsDefault = 10;
            break;
        case 3:
            startSpawnRateAsteroidsDefault = 25;
            finishSpawnRateAsteroidsDefault = 1;
            break;
        case 4:
            startSpawnRateAsteroidsDefault = 15;
            finishSpawnRateAsteroidsDefault = 1;
            break;
        case 5:
            startSpawnRateAsteroidsDefault = 5;
            finishSpawnRateAsteroidsDefault = 1;
            break;
    }

    switch (selectedPlayerReload) {
        case 1:
            playerReloadDefault = 40;
            break;
        case 2:
            playerReloadDefault = 10;
            break;
        case 3:
            playerReloadDefault = 8;
            break;
        case 4:
            playerReloadDefault = 5;
            break;
        case 5:
            playerReloadDefault = 4;
            break;
    }

    switch (selectedBulletSize) {
        case 1:
            playerBulletSizeDefault = 3;
            break;
        case 2:
            playerBulletSizeDefault = 6;
            break;
        case 3:
            playerBulletSizeDefault = 10;
            break;
        case 4:
            playerBulletSizeDefault = 20;
            break;
        case 5:
            playerBulletSizeDefault = 30;
            break;
    }

    switch (selectedBulletSpeed) {
        case 1:
            playerBulletSpeedDefault = 5;
            break;
        case 2:
            playerBulletSpeedDefault = 10;
            break;
        case 3:
            playerBulletSpeedDefault = 16;
            break;
        case 4:
            playerBulletSpeedDefault = 25;
            break;
        case 5:
            playerBulletSpeedDefault = 40;
            break;
    }

    switch (selectedCountBonuses) {
        case 1:
            minTimeBonusDefault = FPS * 20;
            maxTimeBonusDefault = FPS * 50;
            break;
        case 2:
            minTimeBonusDefault = FPS * 10;
            maxTimeBonusDefault = FPS * 40;
            break;
        case 3:
            minTimeBonusDefault = FPS * 5;
            maxTimeBonusDefault = FPS * 25;
            break;
        case 4:
            minTimeBonusDefault = FPS * 3;
            maxTimeBonusDefault = FPS * 15;
            break;
        case 5:
            minTimeBonusDefault = FPS;
            maxTimeBonusDefault = FPS * 5;
            break;
    }

}

// Процедура меняющая стандартные значения некоторых игровых переменных делая их изначальными
function defaultSettings() {
    localStorage.setItem('isDefaultSettings', 1); // Записываем в localStorage то, что мы вернули стандартные настройки

    playerSpeedDefault = 12;
    playerMaxHealthDefault = 5;
    playerAmmunitionSizeDefault = 30;
    playerReloadDefault = 8;
    playerBulletSizeDefault = 10;
    playerBulletSpeedDefault = 16;
    minTimeBonusDefault = FPS * 5; 
    maxTimeBonusDefault = FPS * 25;
    startSpawnRateAsteroidsDefault = 25;
    finishSpawnRateAsteroidsDefault = 1;
}

// ------------------------------------------------------------------------------ >

// Находится ли игра на паузе
let isGamePause = false;

// Игровой цикл (интервал)
let gameCycle = null;

// Что будет происходить каждое повторение игрового цикла
function oneFrameGameCycle() {
    // Игра будет продолжаться если она не на паузе
    if (!isGamePause) {
        // Меняем направляющий вектор игрока в зависимости от нажатой клавиши
        if (pressA) gameObject.setXDirectionVector(player, -1);
        else if (pressD) gameObject.setXDirectionVector(player, 1);
        else gameObject.setXDirectionVector(player, 0);
        if (pressW) gameObject.setYDirectionVector(player, -1);
        else if (pressS) gameObject.setYDirectionVector(player, 1);
        else gameObject.setYDirectionVector(player, 0);

        // Меняем направляющий вектор игрока в зависимости от положения джостика (Для мобильных устройств)
        if (joystickCoordinateX != joystickCenterX) gameObject.setXDirectionVector(player, (joystickCoordinateX - joystickCenterX));
        if (joystickCoordinateY != joystickCenterY) gameObject.setYDirectionVector(player, (joystickCoordinateY - joystickCenterY));

        gameObject.move(player);       // Двигаем игрока

        // Не даём игроку выйти за пределы экрана
        if (gameObject.getX(player) < 0) gameObject.setX(player, 0);
        else if (gameObject.getX(player) + gameObject.getWidth(player) > 1280) gameObject.setX(player, 1280 - gameObject.getWidth(player));
        if (gameObject.getY(player) < 0) gameObject.setY(player, 0);
        else if (gameObject.getY(player) + gameObject.getHeight(player) > 720) gameObject.setY(player, 720 - gameObject.getHeight(player));

        if (player.reload > 0) player.reload--;    // Время до следующего выстрела уменьшается (происходит перезарядка)

        // Игрок стреляет если произошла перезарядка и зажата левая кнопка мыши и есть пули в боезапасе
        if (player.reload == 0 && player.isShooting && player.ammunition > 0) {
            bullets.push(new gameObject(gameObject.getX(player) + gameObject.getWidth(player) / 2, gameObject.getY(player) - player.bulletSize / 2, player.bulletSize, player.bulletSize, player.bulletSpeed, [0, -1]));
            bullets[bullets.length - 1].destroy = false;     // Уничтожается ли пуля (при попадании в астероид и вылет за границы экрана)
            player.reload = player.RELOAD;
            player.ammunition--;
        }

        // Двигаем все пули и уничтожаем их если они улетели за край экрана
        for (let i = 0; i < bullets.length; i++) {
            gameObject.move(bullets[i]);
            if (gameObject.getY(bullets[i]) < -100 - player.bulletSize) {
                bullets[i].destroy = true;
            }
        }

        // Усложнение игры
        if (timeNextComplication > 0) timeNextComplication--;
        else {
            timeNextComplication = rateComplications * FPS;

            // Увеличиваем скорость астероидов
            if (minSpeedAsteroid < finishMinSpeedAsteroid) minSpeedAsteroid++;
            if (maxSpeedAsteroid < finishMaxSpeedAsteroid) maxSpeedAsteroid++;

            // Увеличиваем скорость появления астероидов
            if (spawnRateAsteroids > finishSpawnRateAsteroids) spawnRateAsteroids--;
        }

        // Появление следующего астероида
        if (timeNextAsteroid > 0) timeNextAsteroid--;
        else {
            timeNextAsteroid = spawnRateAsteroids;

            // Создаём астероид
            let startX = RandN(0, 1281, true);         // Начальная позиция x астероида
            let typeAsteroid = RandN(0, 3, true);      // Тип астероида (маленький, средний, большой)

            let sizeAsteroid;                          // размер астероида
            let strengthAsteroid;                      // прочность астероида

            if (typeAsteroid == 0) {
                sizeAsteroid = 30;
                strengthAsteroid = smallAsteroidStrength;
            } else if (typeAsteroid == 1) {
                sizeAsteroid = 50;
                strengthAsteroid = mediumAsteroidStrength;
            } else {
                sizeAsteroid = 80;
                strengthAsteroid = bigAsteroidStrength;
            }

            // Скорость астероида
            speedAsteroid = RandN(minSpeedAsteroid, maxSpeedAsteroid + 1, true);  

            // Направляющий вектор астероида
            directionVectorAsteroid = [RandN(-1, 1, false), 1];

            asteroids.push(new gameObject(startX, -100, sizeAsteroid, sizeAsteroid, speedAsteroid, directionVectorAsteroid));
            asteroids[asteroids.length - 1].strength = strengthAsteroid;
            asteroids[asteroids.length - 1].numberFrame = 0;
        }

        // Двигаем все астероиды и уничтожаем их если они улетели вниз
        for (let i = 0; i < asteroids.length; i++) {
            gameObject.move(asteroids[i]);
            if (gameObject.getY(asteroids[i]) > 1000) {
                asteroids[i].strength = 0;
            }
        }

        // Столкновение астероидов с другими игровыми объектами (астероиды, пули, игрок)
        for (let i = 0; i < asteroids.length; i++) {
            // Столкновение астероида с астероидом (очки прочности столкнувшихся астероидов вычитаются друг из друга)
            for (let j = 0; j < asteroids.length; j++) {
                if (i == j) continue;  // Не проверяем столкновение астероида с самим собой
                if (gameObject.linkRectIntersection(asteroids[i], asteroids[j])) {
                    let rememberStrength = asteroids[i].strength;   // Запоминаем прочность одного из астероидов
                    // Вычитать будем только если вычитаемая прочность положительная
                    // (Иначе прочность из к-й вычитают увеличится)
                    if (asteroids[j].strength > 0) asteroids[i].strength -= asteroids[j].strength;
                    if (rememberStrength > 0) asteroids[j].strength -= rememberStrength;
                }
            }

            // Столкновение астероида с пулей (Пуля уничтожается, астероид теряет очко прочности)
            for (let j = 0; j < bullets.length; j++) {
                if (gameObject.linkRectIntersection(asteroids[i], bullets[j])) {
                    bullets[j].destroy = true;
                    asteroids[i].strength--;
                }
            }

            // Столкновение астероида с игроком (астероид уничтожается, игрок теряет очко здоровья)
            if (gameObject.linkRectIntersection(player, asteroids[i])) {
                numberPlayerImg = 1;
                framesPlayerImg = 3;
                player.health--;
                asteroids[i].strength = 0;
            }
        }

        // Уничтожение пули (удаление её из массива пуль)
        for (let i = 0; i < bullets.length; i++) {
            if (bullets[i].destroy) {
                bulletDestroyEffects.push([gameObject.getX(bullets[i]) - 25 + player.bulletSize / 2, gameObject.getY(bullets[i]) - 25 + player.bulletSize / 2, 0]);
                bullets.splice(i, 1);
                i--;
            }
        }

        // Уничтожение астероида (удаление его из массива астероидов)
        for (let i = 0; i < asteroids.length; i++) {
            if (asteroids[i].strength <= 0) {
                if (gameObject.getHeight(asteroids[i]) == 30) {
                    smallAsteroidDestroyEffects.push([gameObject.getX(asteroids[i]) - 25 + gameObject.getHeight(asteroids[i]) / 2, gameObject.getY(asteroids[i]) - 25 + gameObject.getHeight(asteroids[i]) / 2, 0]);
                } else if (gameObject.getHeight(asteroids[i]) == 50) {
                    mediumAsteroidDestroyEffects.push([gameObject.getX(asteroids[i]) - 40 + gameObject.getHeight(asteroids[i]) / 2, gameObject.getY(asteroids[i]) - 40 + gameObject.getHeight(asteroids[i]) / 2, 0]);
                } else {
                    bigAsteroidDestroyEffects.push([gameObject.getX(asteroids[i]) - 60 + gameObject.getHeight(asteroids[i]) / 2, gameObject.getY(asteroids[i]) - 60 + gameObject.getHeight(asteroids[i]) / 2, 0]);
                }
                asteroids.splice(i, 1);
                i--;
            }
        }

        // Считаем время прошедшее с начала игры
        if (frames < FPS - 1) frames++;
        else {
            frames = 0;
            seconds++;
        }
        if (seconds == 60) {
            seconds = 0;
            minutes++;
        }

        // Создаём бонус
        if (timeBonus > 0) timeBonus--;
        else {
            timeBonus = RandN(minTimeBonus, maxTimeBonus + 1, true);
            let bonusX = RandN(100, 1100, true);
            let bonusType = RandN(0, 2, true);

            bonuses.push(new gameObject(bonusX, -100, 50, 50, 6, [0, 1]));
            bonuses[bonuses.length - 1].destroy = false;                         // Уничтожить ли бонус (при подбирании игроком или вылете за пределы экрана)
            // Тип бонуса (восстанавливает здоровье или боезапас)
            if (bonusType == 0) {
                bonuses[bonuses.length - 1].type = 'health';
            }
            else {
                bonuses[bonuses.length - 1].type = 'ammunition';
            }
        }

        // Двигаем бонусы и уничтожаем их при вылете за пределы экрана
        for (let i = 0; i < bonuses.length; i++) {
            gameObject.move(bonuses[i]);
            if (gameObject.getY(bonuses[i]) > 1000) bonuses[i].destroy = true;
        }

        // Отслеживаем столкновения бонусов с игроком
        for (let i = 0; i < bonuses.length; i++) {
            if (gameObject.linkRectIntersection(player, bonuses[i])) {
                framesPlayerImg = 3;
                if (bonuses[i].type == 'health') {
                    numberPlayerImg = 2;
                    player.health = player.maxHealth;   // В зависимости от типа бонуса восстанавливаем игроку здоровье или боезапас
                }
                else {
                    numberPlayerImg = 3;
                    player.ammunition = player.ammunitionSize;
                }
                bonuses[i].destroy = true;
            }
        }

        // Уничтожаем бонусы
        for (let i = 0; i < bonuses.length; i++) {
            if (bonuses[i].destroy) {
                bonuses.splice(i, 1);
                i--;
            }
        }

        // ОТРИСОВКА КАДРА
        frameDraw();

        // Игрок проигрывает если теряет все очки здоровья
        if (player.health <= 0) {
            // Если процесс игры останавливается/завершается, то мы выходим из полноэкранного режима
            if (document.fullscreenElement) document.exitFullscreen();

            let resultText = `Ваш результат: ${minutes}:${seconds}. `; // Текст с результатом

            // Записывать результат в рейтинг будем только если у игры стандартные настройки
            if (Number(localStorage.getItem('isDefaultSettings') == 1)) {
                let playerName;                                            // Имя игрока, под которым запишется результат
                let gameResults = [];                                      // Все результаты, отсортированные по невозрастанию

                // Если у игрока нет имени, записываем стандартное
                if (localStorage.getItem('playerName') == null) playerName = 'Игрок';
                else playerName = localStorage.getItem('playerName');

                // Создаём массив результатов если его ещё нет
                if (localStorage.getItem('gameResults') == null) {
                    // Заполняем массив пустыми значениями
                    for (let i = 0; i < 5; i++) gameResults.push(['--------', 0]);
                    // Записываем текущий результат как самый высокий
                    gameResults[0] = [playerName, minutes * 60 + seconds];
                    // Сохраняем результаты в localStorage
                    localStorage.setItem('gameResults', JSON.stringify(gameResults));
                    resultText += 'Вы заняли 1 место в рейтинге!';
                } else {
                    gameResults = JSON.parse(localStorage.getItem('gameResults'));
                    // Сравниваем текущий результат с результатами в рейтинге
                    for (let i = 0; i < 5; i++) {
                        if (minutes * 60 + seconds >= gameResults[i][1]) {
                            // Сдвигаем результаты вниз
                            for (let j = 4; j > i; j--) {
                                gameResults[j] = gameResults[j - 1];
                            }
                            gameResults[i] = [playerName, minutes * 60 + seconds];
                            // Сохраняем результаты в localStorage
                            localStorage.setItem('gameResults', JSON.stringify(gameResults));
                            resultText += `Вы заняли ${i + 1} место в рейтинге!`;
                            break;
                        }
                    }
                }
            } else resultText += 'Он не отобразится в рейтинге (свои настройки).';

            gameResultInscription.innerHTML = resultText;

            endGameCycle();
            gaming.style.display =         'none';
            gameOverMenu.style.display =   'flex';
        }
    }
}


// Процедура запуска игрового цикла
function startGameCycle() {
    ctx.fillStyle = '#1d242f';           // Закрашиваем холст (чтобы кадры из прошлых игр не мелькали в начале)
    ctx.fillRect(0, 0, 1280, 720);
    gameCycle = setInterval(oneFrameGameCycle, FPS);
}

// Процедура окончания игрового цикла
function endGameCycle() {
    isGamePause = false;
    clearInterval(gameCycle);
    gameCycle = null;
}

// Начало игры при выборе стандартного режима
standartModeButton.onclick = function() {
    modeSelection.style.display = 'none';
    gaming.style.display =        'block';
    defaultSettings();
    initialValues();
    localStorage.setItem('loadExist', '0');   // Мы начинаем новую игру, поэтому сохранений больше нет
    startGameCycle();
}

// Выход из меню паузы при нажатии на кнопку "продолжить"
resumeGameButton.onclick = function() {
    gaming.style.display =    'block';
    pauseMenu.style.display = 'none';
    isGamePause = false;
}

// Сохраняем прогресс и выходим из игры в главное меню при нажатии "сохранить и выйти"
saveAndOutButton.onclick = function() {
    saveProgress();
    localStorage.setItem("loadExist", '1');
    endGameCycle();
    pauseMenu.style.display = 'none';
    mainMenu.style.display =  'flex';
    continueButtonAccess();
}

// Восполняем сохранённый прогресс и продолжаем игру при нажатии на "продолжить"
continueGameButton.onclick = function() {
    mainMenu.style.display = 'none';
    gaming.style.display =   'block';
    loadProgress();
    startGameCycle();
}

// Заходим в меню своих настроек при выборе режима "свои настройки"
customModeButton.onclick = function() {
    modeSelection.style.display =  'none';
    changeSettings.style.display = 'flex';
}

// Запускаем игру в режиме "свои настройки"
startCustomGameButton.onclick = function() {
    changeSettings.style.display = 'none';
    gaming.style.display =         'block';
    yourSettings();
    initialValues();
    localStorage.setItem('loadExist', '0');
    startGameCycle();
}

// Выходим из меню своих настроек в меню выбора режима
fromChangeSettingsToModeSelectionButton.onclick = function() {
    changeSettings.style.display = 'none';
    modeSelection.style.display =  'flex';
}

// Выходим из меню конца игры в главное меню
fromGameOverMenuToMainMenuButton.onclick = function() {
    gameOverMenu.style.display = 'none';
    mainMenu.style.display =     'flex';
    initialValues();
    localStorage.setItem('loadExist', '0');
    continueButtonAccess();
}

// Перезапускаем игру из меню конца игры
restartGameButton.onclick = function() {
    gameOverMenu.style.display = 'none';
    gaming.style.display =       'block';
    initialValues();
    localStorage.setItem('loadExist', '0');
    startGameCycle();
}

continueButtonAccess();   // Изначально мы заходим в главное меню, поэтому нужно по необходимости заблокировать кнопку "продолжить"