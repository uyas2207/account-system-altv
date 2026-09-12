import * as alt from 'alt-server';

import { AccountDBService } from './DataBase_classes/AccountDBService';

interface IPlayerSession {
    accountId: number;
    login: string;
}

export class AccountManager {
    //map которая хранит в себе игроков которые в данный момент находятся на сервере и которые вошли в аккаунт
    private allLoginnedPlayers: Map <alt.Player, IPlayerSession> = new Map <alt.Player, IPlayerSession>();
    
    constructor( private readonly accountDBService: AccountDBService){
        //this.test();
    }

    async onAccountEnterAttempt(player: alt.Player, playerLogin: string, playerPassword: string){
        
        if(this.allLoginnedPlayers.has(player)){
            throw new Error('Вы уже вошли в аккаунт');
        }
        if(this.allLoginnedPlayers.values().some(session => session.login === playerLogin)){
            throw new Error('Данный аккаунт уже используется');
        }

        const currentPlayerDBData = await this.accountDBService.checkAccountLogin(playerLogin);
        
        if( (currentPlayerDBData === undefined) || (currentPlayerDBData.password !== playerPassword)){
            throw new Error('Введен некорректный логин или пароль');
        }
        
        this.allLoginnedPlayers.set(player, {
            accountId: currentPlayerDBData.accountId,
            login: playerLogin
        });
    }

    async onAccountRegisterAttempt(player: alt.Player, playerLogin: string, playerPassword: string, playerRepeatPassword: string){
        if( await this.accountDBService.checkAccountLogin(playerLogin) !== undefined){
            throw new Error('Данный логин не достпуен');
        }
        if(playerPassword !== playerRepeatPassword){
            throw new Error('Пароли на совпадают');
        }

       // try {
        await this.accountDBService.insertNewRow({login: playerLogin, password: playerPassword, money: 10000 /* не забыть вынести в конфиг */});
        //автоматичский вход в аккаунт если игрок только что зарегестрировался
        this.onAccountEnterAttempt(player, playerLogin, playerPassword);

 //       } catch (error) {
   //         throw new Error('Произошла ошибка при добавлении аккаунта в базу данных');
     //   }
    }

    onAccountVehsAttempt(player: alt.Player){
        const currentPlayerAccountId = this.requestPlayerAccountId(player);
        console.log("currentPlayerAccountId",currentPlayerAccountId)
        return currentPlayerAccountId;
    }

    async requestPlayerDBData(player: alt.Player){
/*         if(!this.allLoginnedPlayers.has(player)){
            throw new Error('Для этого дейтсвия необходимой войти в аккаунт');
        }

        const currentPlayer = this.allLoginnedPlayers.get(player);
        //Почему то ts жалуется на то что currentPlayer.accountId может быть undefined, хотя была проверка на allLoginnedPlayers.has 
        //и после этого взят currentPlayer, а currentPlayer не может существовать без accountId и без login 
        //и что бы ts не выдавал ошибку на ситуацию которой не должно быть сделал currentPlayer!.accountId
        const currentPlayerDBData = await this.accountDBService.getRowByPrimaryKey(currentPlayer!.accountId); */
        const currentPlayerAccountId = this.requestPlayerAccountId(player);
        const currentPlayerDBData = await this.accountDBService.getRowByPrimaryKey(currentPlayerAccountId!);
        if(!currentPlayerDBData){
            throw new Error('Не удалось получить данные об игроке');
        }
        return currentPlayerDBData;
    }

    requestPlayerAccountId(player: alt.Player){
        if(!this.allLoginnedPlayers.has(player)){
            throw new Error('Для этого дейтсвия необходимой войти в аккаунт');
        }
        const currentPlayerAccountId = this.allLoginnedPlayers.get(player)?.accountId;
        if(!currentPlayerAccountId){
            throw new Error('Не удалось получить игрока с таким ID');
        }
        return currentPlayerAccountId;
    }

    async changePlayerMoney(accountId: number, money: number){
        try {
            await this.accountDBService.updateMoneyByPrimaryKey(accountId, money);
        } catch (error) {
            
        }
    }

    checkIsPlayerLoggedIn(player: alt.Player){
       return this.allLoginnedPlayers.has(player);
    }

    //дебаг команда, команда потом убрать
    printAllLoginnedPlayers(){
        alt.log('Весь allLoginnedPlayers');
        this.allLoginnedPlayers.forEach((value, key) => {
            alt.log(`Ключ: ${(key)}`);
            alt.log('value:', (value));
        });
    }
}