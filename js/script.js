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

// По умолчанию скрываем все блоки кроме главного меню
ratingMenu.style.display =     'none';
gaming.style.display =         'none';
modeSelection.style.display =  'none';
changeSettings.style.display = 'none';
pauseMenu.style.display =      'none';

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
    #x;
    #y;
    #width;
    #height;
    #image = new Image();
    #speed;              // скорость движения
    #directionVector;    // единичный вектор направления движения

    constructor (x, y, width, height, image = null, speed = 0, directionVector = [0, 0]) {
        this.#x = x;
        this.#y = y;
        this.#width = width;
        this.#height = height;
        if (image != null) this.#image.src = image;
        this.#speed = speed;
        this.#directionVector = directionVector;
    }

    get getXDirectionVector() {
        return this.#directionVector[0];
    }
    get getYDirectionVector() {
        return this.#directionVector[1];
    }
    set setXDirectionVector(value) {
        this.#directionVector[0] = value;
    }
    set setYDirectionVector(value) {
        this.#directionVector[1] = value;
    }

    get getSpeed() {
        return this.#speed;
    }
    set setSpeed(value) {
        this.#speed = value;
    }

    get getImage() {
        return this.#image;
    }
    set setImage(value) {
        this.#image.src = value;
    }

    get getX() {
        return this.#x;
    }
    set setX(value) {
        this.#x = value;
    }

    get getY() {
        return this.#y;
    }
    set setY(value) {
        this.#y = value;
    }

    get getWidth() {
        return this.#width;
    }

    get getHeight() {
        return this.#height;
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
        const x1 = gameObject1.getX
        const y1 = gameObject1.getY
        const w1 = gameObject1.getWidth
        const h1 = gameObject1.getHeight

        const x2 = gameObject2.getX
        const y2 = gameObject2.getY
        const w2 = gameObject2.getWidth
        const h2 = gameObject2.getHeight

        return this.valuesRectIntersection(x1, y1, w1, h1, x2, y2, w2, h2);
    }

    // Движение объекта в зависимости от его направления
    move() {
        // Находим модуль вектора направления объекта, округляем до сотых
        let vectorModule = Math.round((this.getXDirectionVector ** 2 + this.getYDirectionVector ** 2) ** 0.5 * 100) / 100;
        
        // Делим вектор на модуль чтобы нормализовать его (делаем вектор направления единичным), округляем до сотых
        if (vectorModule != 0) {
            this.#directionVector[0] = Math.round(this.#directionVector[0] / vectorModule * 100) / 100;
            this.#directionVector[1] = Math.round(this.#directionVector[1] / vectorModule * 100) / 100;
        }

        // Двигаем объект в направлении заданном единичным вектором направления со скоростью объекта
        this.setX = this.getX + this.getSpeed * this.getXDirectionVector;
        this.setY = this.getY + this.getSpeed * this.getYDirectionVector;
    }
}

let FPS = 1000 / 25;                                        // Частота кадров
let rateComplications = 3;                                  // Через какие промежутки времени игра будет усложняться (в сек.)
let timeNextComplication = rateComplications * FPS;         // Сколько времени осталось до следующего усложения (в кадрах)

let minutes = 0;                                            // Сколько минут продержался игрок
let seconds = 0;                                            // Сколько секунд продержался игрок
let frames = 0;                                             // Сколько кадров продержался игрок

const player = new gameObject(70, 70, 40, 50, null, 12);    // Объект игрока
let pressA = false;                                         // Какие кнопки нажаты на клавиатуре
let pressD = false;
let pressW = false;
let pressS = false;

player.maxHealth = 5;                                       // Максимальное здоровье игрока
player.health = player.maxHealth;                           // Текущее здоровье игрока

player.ammunitionSize = 30;                                 // Сколько максимально пуль в боезапасе игрока
player.ammunition = player.ammunitionSize;                  // Сколько сейчас пуль в боезапасе игрока

player.isShooting = false;                                  // Стреляет ли игрок
player.RELOAD = 8;                                          // Сколько времени в кадрах требуется для перезарядки
player.reload = 0;                                          // Сколько времени осталось до следующего выстрела
player.bulletSize = 10;                                     // Размер пуль
player.bulletSpeed = 16;                                    // Скорость пуль

const bullets = [];                                         // Массив пуль

const bonuses = [];                                         // Массив бонусов

let minTimeBonus = FPS * 5;                                 // Минимальное и максимальное время появления бонуса
let maxTimeBonus = FPS * 15;

// Время до появления следующего бонуса
let timeBonus = RandN(minTimeBonus, maxTimeBonus + 1, true);

const asteroids = [];                                       // Массив астероидов

let startSpawnRateAsteroids = 25;                           // Начальная и конечная частота появления астероидов
let finishSpawnRateAsteroids = 5;

let spawnRateAsteroids = startSpawnRateAsteroids;           // Текущая частота появления астероидов
let timeNextAsteroid = spawnRateAsteroids;                  // Время до появления следующего астероида

let startMinSpeedAsteroid = 1;                              // Минимальная и максимальная скорость астероидов в начале
let startMaxSpeedAsteroid = 8;

let finishMinSpeedAsteroid = 7;                             // Минимальная и максимальная скорость астероидов в конце
let finishMaxSpeedAsteroid = 20;

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
    ctx.fillRect(player.getX, player.getY, player.getWidth, player.getHeight);

    // Отрисовываем бонусы
    for (let i = 0; i < bonuses.length; i++) {
        if (bonuses[i].type == 'health') ctx.fillStyle = 'red';  // Выбираем цвет в зависимости от типа бонуса
        else ctx.fillStyle = '#80DAEB';
        
        ctx.fillRect(bonuses[i].getX, bonuses[i].getY, bonuses[i].getWidth, bonuses[i].getHeight);
    }

    // Отрисовываем пули
    ctx.fillStyle = '#80DAEB';
    for (let i = 0; i < bullets.length; i++) {
        ctx.fillRect(bullets[i].getX, bullets[i].getY, bullets[i].getWidth, bullets[i].getHeight);
    }

    // Отрисовываем астероиды
    ctx.fillStyle = 'grey';
    for (let i = 0; i < asteroids.length; i++) {
        ctx.fillRect(asteroids[i].getX, asteroids[i].getY, asteroids[i].getWidth, asteroids[i].getHeight);
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
        if (pressA) player.setXDirectionVector = -1;
        else if (pressD) player.setXDirectionVector = 1;
        else player.setXDirectionVector = 0;
        if (pressW) player.setYDirectionVector = -1;
        else if (pressS) player.setYDirectionVector = 1;
        else player.setYDirectionVector = 0;

        player.move();       // Двигаем игрока

        // Не даём игроку выйти за пределы экрана
        if (player.getX < 0) player.setX = 0;
        else if (player.getX + player.getWidth > 1280) player.setX = 1280 - player.getWidth;
        if (player.getY < 0) player.setY = 0;
        else if (player.getY + player.getHeight > 720) player.setY = 720 - player.getHeight;

        if (player.reload > 0) player.reload--;    // Время до следующего выстрела уменьшается (происходит перезарядка)

        // Игрок стреляет если произошла перезарядка и зажата левая кнопка мыши и есть пули в боезапасе
        if (player.reload == 0 && player.isShooting && player.ammunition > 0) {
            bullets.push(new gameObject(player.getX + player.getWidth / 2 - player.bulletSize / 2, player.getY - player.bulletSize, player.bulletSize, player.bulletSize, null, player.bulletSpeed, [0, -1]));
            bullets[bullets.length - 1].destroy = false;     // Уничтожается ли пуля (при попадании в астероид и вылет за границы экрана)
            player.reload = player.RELOAD;
            player.ammunition--;
        }

        // Двигаем все пули и уничтожаем их если они улетели за край экрана
        for (let i = 0; i < bullets.length; i++) {
            bullets[i].move();
            if (bullets[i].getY < -100 - player.bulletSize) {
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
            asteroids[i].move();
            if (asteroids[i].getY > 1000) {
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
            bonuses[i].move();
            if (bonuses[i].getY > 1000) bonuses[i].destroy = true;
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
    }
}

// Процедура запуска игрового цикла
function startGameCycle() {
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
    endGameCycle();
    pauseMenu.style.display = 'none';
    mainMenu.style.display =  'flex';
}

// Восполняем сохранённый прогресс и продолжаем игру при нажатии на "продолжить"
continueGameButton.onclick = function() {
    mainMenu.style.display = 'none';
    gaming.style.display =   'block';
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
    startGameCycle();
}

// Выходим из меню своих настроек в меню выбора режима
fromChangeSettingsToModeSelectionButton.onclick = function() {
    changeSettings.style.display = 'none';
    modeSelection.style.display =  'flex';
}