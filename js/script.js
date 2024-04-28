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

// По умолчанию скрываем все блоки кроме главного меню
ratingMenu.style.display =     'none';
gaming.style.display =         'none';
modeSelection.style.display =  'none';
changeSettings.style.display = 'none';
pauseMenu.style.display =      'none';
gameOverMenu.style.display =   'none';

// Заходим в меню рейтинга
ratingMenuButton.onclick = function() {
    mainMenu.style.display =   'none';
    ratingMenu.style.display = 'flex';
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
    image = new Image();
    speed;              // скорость движения
    directionVector;    // единичный вектор направления движения

    constructor (x = 0, y = 0, width = 1, height = 1, image = null, speed = 0, directionVector = [0, 0]) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        if (image != null) this.image.src = image;
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

    static getImage(obj) {
        return obj.image;
    }
    static setImage(obj, value) {
        obj.image.src = value;
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

let playerWidth = 40;                                       // Ширина и высота игрока
let playerHeight = 50;

// Объект игрока
let player = new gameObject(1280/2 - playerWidth/2, 720/2 - playerHeight/2, playerWidth, playerHeight, null, playerSpeed);

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

// Отслеживание нажатия левой кнопки мыши
document.addEventListener("mousedown", function(event) {
    if (event.button == 0) {
        player.isShooting = true;
    }
})

document.addEventListener("mouseup", function(event) {
    if (event.button == 0) {
        player.isShooting = false;
    }
})


// Процедура отрисовки кадра
function frameDraw() {
    ctx.fillStyle = '#1d242f';
    ctx.fillRect(0, 0, 1280, 720);   // Перед тем как рисовать новый кадр, стираем старый (закрашиваем)

    // ОТРИСОВКА ИГРОВЫХ ОБЪЕКТОВ

    ctx.fillStyle = "white";         // Отрисовываем объект игрока
    ctx.fillRect(gameObject.getX(player), gameObject.getY(player), gameObject.getWidth(player), gameObject.getHeight(player));

    // Отрисовываем бонусы
    for (let i = 0; i < bonuses.length; i++) {
        if (bonuses[i].type == 'health') ctx.fillStyle = 'red';  // Выбираем цвет в зависимости от типа бонуса
        else ctx.fillStyle = '#80DAEB';
        
        ctx.fillRect(gameObject.getX(bonuses[i]), gameObject.getY(bonuses[i]), gameObject.getWidth(bonuses[i]), gameObject.getHeight(bonuses[i]));
    }

    // Отрисовываем пули
    ctx.fillStyle = '#80DAEB';
    for (let i = 0; i < bullets.length; i++) {
        ctx.fillRect(gameObject.getX(bullets[i]), gameObject.getY(bullets[i]), gameObject.getWidth(bullets[i]), gameObject.getHeight(bullets[i]));
    }

    // Отрисовываем астероиды
    ctx.fillStyle = 'grey';
    for (let i = 0; i < asteroids.length; i++) {
        ctx.fillRect(gameObject.getX(asteroids[i]), gameObject.getY(asteroids[i]), gameObject.getWidth(asteroids[i]), gameObject.getHeight(asteroids[i]));
    }

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
    player = new gameObject(1280/2 - playerWidth/2, 720/2 - playerHeight/2, playerWidth, playerHeight, null, playerSpeed);

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
}

// Процедура блокирующая кнопку "продолжить" если нет сохранений, и делающая её доступной если сохранения есть
function continueButtonAccess() {
    if (Number.parseInt(localStorage.getItem("loadExist")) != 1) continueGameButton.disabled = true;
    else continueGameButton.disabled = false;
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

        gameObject.move(player);       // Двигаем игрока

        // Не даём игроку выйти за пределы экрана
        if (gameObject.getX(player) < 0) gameObject.setX(player, 0);
        else if (gameObject.getX(player) + gameObject.getWidth(player) > 1280) gameObject.setX(player, 1280 - gameObject.getWidth(player));
        if (gameObject.getY(player) < 0) gameObject.setY(player, 0);
        else if (gameObject.getY(player) + gameObject.getHeight(player) > 720) gameObject.setY(player, 720 - gameObject.getHeight(player));

        if (player.reload > 0) player.reload--;    // Время до следующего выстрела уменьшается (происходит перезарядка)

        // Игрок стреляет если произошла перезарядка и зажата левая кнопка мыши и есть пули в боезапасе
        if (player.reload == 0 && player.isShooting && player.ammunition > 0) {
            bullets.push(new gameObject(gameObject.getX(player) + gameObject.getWidth(player) / 2 - player.bulletSize / 2, gameObject.getY(player) - player.bulletSize, player.bulletSize, player.bulletSize, null, player.bulletSpeed, [0, -1]));
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

            asteroids.push(new gameObject(startX, -100, sizeAsteroid, sizeAsteroid, null, speedAsteroid, directionVectorAsteroid));
            asteroids[asteroids.length - 1].strength = strengthAsteroid;
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
                player.health--;
                asteroids[i].strength = 0;
            }
        }

        // Уничтожение пули (удаление её из массива пуль)
        for (let i = 0; i < bullets.length; i++) {
            if (bullets[i].destroy) {
                bullets.splice(i, 1);
                i--;
            }
        }

        // Уничтожение астероида (удаление его из массива астероидов)
        for (let i = 0; i < asteroids.length; i++) {
            if (asteroids[i].strength <= 0) {
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

            bonuses.push(new gameObject(bonusX, -100, 50, 50, null, 6, [0, 1]));
            bonuses[bonuses.length - 1].destroy = false;                         // Уничтожить ли бонус (при подбирании игроком или вылете за пределы экрана)
            if (bonusType == 0) bonuses[bonuses.length - 1].type = 'health';     // Тип бонуса (восстанавливает здоровье или боезапас)
            else bonuses[bonuses.length - 1].type = 'ammunition';
        }

        // Двигаем бонусы и уничтожаем их при вылете за пределы экрана
        for (let i = 0; i < bonuses.length; i++) {
            gameObject.move(bonuses[i]);
            if (gameObject.getY(bonuses[i]) > 1000) bonuses[i].destroy = true;
        }

        // Отслеживаем столкновения бонусов с игроком
        for (let i = 0; i < bonuses.length; i++) {
            if (gameObject.linkRectIntersection(player, bonuses[i])) {
                if (bonuses[i].type == 'health') player.health = player.maxHealth;   // В зависимости от типа бонуса восстанавливаем игроку здоровье или боезапас
                else player.ammunition = player.ammunitionSize;
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
    initialValues();
    localStorage.setItem('loadExist', '0');   // Мы начинаем новую игру, поэтому сохранений больше нет
    startGameCycle();
}

// Отслеживание нажатия клавиш на клавиатуре
document.addEventListener('keydown', function(event) {
    // Эти нажатия клавиш отслеживаются только если игровой цикл запущен
    if (gameCycle != null) {
        // Ставим игру на паузу или выходим из паузы
        if (event.code === 'Escape') {
            if (isGamePause) {
                gaming.style.display =    'block';
                pauseMenu.style.display = 'none';
            } else {
                gaming.style.display =    'none';
                pauseMenu.style.display = 'flex';
            }
            isGamePause = !isGamePause;
        }
    }
})

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