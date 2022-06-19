export const volumeRussianTranslation = {
    'small': 'малый',
    'medium': 'средний',
    'large': 'большой'
};

export const gameModesRussianTranslation = {
    'classic': 'Классика',
    'arcade': 'Аркада',
    'infinite': 'Бесконечный',
};

export const Languages = {
    english: {
        XML98Y: 'XML-98Y',
        OSU727: 'OSU-727',
        JAN1K5: 'JAN-1K5',
        KFP607: 'KFP-607',
        YMD255: 'YMD-255',
        NNCH1S: 'NNC-H1S',
        AME114: 'AME-114',
        NNG153: 'NNG-153',
        IRS397: 'IRS-397',
        NKR434: 'NKR-434',
    },
    russian : {
        mistakeCounterText: mistakesCount => 'Ошибок: ' + mistakesCount,
        orderText: (name, volume) => `Заказ: ${name} ${volumeRussianTranslation[volume]}`,
        totalScoreText: value => 'Очки: ' + value,
        orderScoreText: value => 'Очки за заказ: ' + value,
        streakText: value => 'Серия: ' + value,
        completedOrdersCountText: value => 'Выполнено заказов: ' + value,
        successPercentageText: percentage => `Процент успеха: ${percentage}%`,
        timerText: time => 'Время: ' + time,
        startText: 'Старт',
        nicknamePlaceholder: 'Ваш ник:',
        backButtonText: 'Назад',
        recipesButtonText: 'Рецепты',
        leaderboardButtonText: 'Таблица лидеров',
        nextStateButtonText: 'Далее',
        restartStateButtonText: 'Сброс этапа',
        finishButtonText: 'Выход',
        goMenuButtonText: 'Меню',
        restartButtonText: 'Заново',
        fillStateText: 'Наполнение',
        fillStateToppingTitle: 'Добавки',
        fillStateFillingTitle: 'Основы',
        mixStateText: 'Смешивание',
        pourStateText: 'Разлив',
        pourStateStopButtonText: 'Стоп',
        finalStateText: 'Результат',

        coffee: 'Кофе',
        tea: 'Чай',
        juice: 'Сок',
        milk: 'Молоко',
        chocolate: 'Шоколад',
        fizzyWater: 'Газировка',
        caramel: 'Карамель',
        lemon: 'Лемон',
        mint: 'Мята',
        uranium: 'Уран',
        void: 'Пустота',
        nakirium: 'Накириум',
        chicken: 'Курица???',
        concrete: 'Бетон',
        mucacium: 'Мукациум',
        antimatter: 'Кориум',
        emotions: 'Эмоции',
        magma: 'Магма',
        classic: 'Классика',
        arcade: 'Аркада',
        infinite: 'Бесконечный',

        Atheneum: 'Атенеум',
        GoldenEden: 'Золотой Эдем',
        NightOfSpinningStars: 'Ночь кружащихся звезд',
        CaramelCones: 'Карамельные шишки',
        LunarAlley: 'Лунная аллея',
        FarReefFoam: 'Пена дальнего рифа',
        FoggyGarden: 'Туманный сад',
        BrightCrown: 'Яркая корона',
        GuardNote: 'Стража Нота',
        JoyfulLaughter: 'Радостный смех',
        SourSheen: 'Кислый блеск',
        ScientistsLunch: 'Полдник ученого',
        LoveVerses: 'Любовные стихи',
        GrayValleySunset: 'Закат серой долины',
        TheSweetnessOfTheCiderLake: 'Сладость сидрового озера',
        DawnDew: 'Рассветная роса',
        EvrasGift: 'Подарок Эвра',
        SnowCoveredHugs: 'Заснеженные объятья',
        BirchJuice: 'Березовый сок',
        StrokeOfTheNight: 'Штрих ночи',
        TwilightHaze: 'Сумеречная мгла',
    },
};

for (const [langName, langContent] of Object.entries(Languages)) {
    if (langName === 'english') {
        continue;
    }
    Object.setPrototypeOf(langContent, Languages.english);
}