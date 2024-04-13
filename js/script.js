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

// Находится ли игра на паузе
let isGamePause = false;

// Игровой цикл (интервал)
let gameCycle = null;

// Что будет происходить каждое повторение игрового цикла
function oneFrameGameCycle() {
    // Игра будет продолжаться если она не на паузе
    if (!isGamePause) {
        console.log("Игра идёт");
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