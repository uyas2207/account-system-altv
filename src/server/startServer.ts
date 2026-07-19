import * as alt from 'alt-server';

console.log('Сервер запустился');

let counter = 0;
const interval = setInterval(() => {
    if(counter < 10){
        console.log('Прогресс',counter);
        counter++;
    }
    else{
        console.log('Конец');
        clearInterval(interval);
    }
}, 1000);

alt.on('consoleCommand', (command, args) => {
    if (command === 'clear'){
        console.log('Очищен интервал');
        clearInterval(interval);
    }
});