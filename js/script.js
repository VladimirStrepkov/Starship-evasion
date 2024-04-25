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

const player = new gameObject(70, 70, 90, 120, null, 6);    // Объект игрока
let pressA = false;                                         // Какие кнопки нажаты на клавиатуре
let pressD = false;
let pressW = false;
let pressS = false;

player.isShooting = false;                                  // Стреляет ли игрок
player.RELOAD = 10;                                         // Сколько времени в кадрах требуется для перезарядки
player.reload = 0;                                          // Сколько времени осталось до следующего выстрела
player.bulletSize = 10;                                     // Размер пуль
player.bulletSpeed = 8;                                     // Скорость пуль

const bullets = [];                                         // Массив пуль

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

    ctx.strokeStyle = "red";         // Отрисовываем объект игрока
    ctx.strokeRect(player.getX, player.getY, player.getWidth, player.getHeight);

    // Отрисовываем пули
    ctx.strokeStyle = 'green';
    for (let i = 0; i < bullets.length; i++) {
        ctx.strokeRect(bullets[i].getX, bullets[i].getY, bullets[i].getWidth, bullets[i].getHeight);
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
        if (pressA) player.setXDirectionVector = -1;           // Меняем направляющий вектор игрока в зависимости от нажатой клавиши
        else if (pressD) player.setXDirectionVector = 1;
        else player.setXDirectionVector = 0;
        if (pressW) player.setYDirectionVector = -1;
        else if (pressS) player.setYDirectionVector = 1;
        else player.setYDirectionVector = 0;

        player.move();       // Двигаем игрока

        if (player.reload > 0) player.reload--;    // Время до следующего выстрела уменьшается (происходит перезарядка)

        // Игрок стреляет если произошла перезарядка и зажата левая кнопка мыши
        if (player.reload == 0 && player.isShooting) {
            bullets.push(new gameObject(player.getX + player.getWidth / 2 - player.bulletSize / 2, player.getY - player.bulletSize, player.bulletSize, player.bulletSize, null, player.bulletSpeed, [0, -1]));
            player.reload = player.RELOAD;
        }

        // Двигаем все пули и удаляем их если они улетели за край экрана
        for (let i = 0; i < bullets.length; i++) {
            bullets[i].move();
            if (bullets[i].getY < -100 - player.bulletSize) {
                bullets.splice(i, 1);
                i--;
            }
        }

        // ОТРИСОВКА КАДРА
        frameDraw();
    }
}

// Процедура запуска игрового цикла
function startGameCycle() {
    gameCycle = setInterval(oneFrameGameCycle, 25);
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