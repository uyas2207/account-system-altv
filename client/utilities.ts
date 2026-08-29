import * as alt from 'alt-client';
import native from 'natives'
//const native = require('natives'); // вместо import * as native from 'natives'; что бы для ts не нужно было добавлять декларацию

export function wait(ms: number){
    return new Promise(resolve => alt.setTimeout(resolve, ms));
}

//вызов гташных уведмолени с помощью нативок 
export function drawNotification(message: string, autoHide = false) {
    native.beginTextCommandThefeedPost('STRING');
    native.addTextComponentSubstringPlayerName(message);
    const notificationId = native.endTextCommandThefeedPostTicker(false, false);
    // Таймер для скрытия уведомления через 3 секунды если кроме текста сообщения передали true
    if (autoHide) {
        alt.setTimeout(() => {
            native.thefeedRemoveItem(notificationId);
        }, 3000);
    }
}