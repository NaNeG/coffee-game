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
    english: {},
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
    },
};

for (const [langName, langContent] of Object.entries(Languages)) {
    if (langName === 'english') {
        continue;
    }
    Object.setPrototypeOf(langContent, Languages.english);
}