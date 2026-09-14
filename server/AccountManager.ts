import * as alt from 'alt-server';
import { defaultParameters } from './config/VehConfig'
import { Account } from './database/database'

import { AccountDBService } from './DataBase_classes/AccountDBService';

interface IPlayerSession {
    accountId: number;
    login: string;
}

export class AccountManager {
    //map которая хранит в себе игроков которые в данный момент находятся на сервере и которые вошли в аккаунт
    private allLoginnedPlayers: Map <alt.Player, IPlayerSession> = new Map <alt.Player, IPlayerSession>();
    
    constructor( private readonly accountDBService: AccountDBService){
    }

    async onAccountEnterAttempt(player: alt.Player, playerLogin: string, playerPassword: string): Promise<void> {
        
        if(this.allLoginnedPlayers.has(player)){
            throw new Error('Вы уже находитесь в аккаунте');
        }
        if(this.allLoginnedPlayers.values().some(session => session.login === playerLogin)){
            throw new Error('Данный аккаунт уже используется');
        }

        const currentPlayerDBData = await this.accountDBService.getDataByAccountLogin(playerLogin);
        
        if( (!currentPlayerDBData) || (currentPlayerDBData.password !== playerPassword)){
            throw new Error('Введен некорректный логин или пароль');
        }
        
        this.allLoginnedPlayers.set(player, {
            accountId: currentPlayerDBData.accountId,
            login: playerLogin
        });
    }

    async onAccountRegisterAttempt(player: alt.Player, playerLogin: string, playerPassword: string, playerRepeatPassword: string): Promise<void> {
        if( await this.accountDBService.getDataByAccountLogin(playerLogin) !== undefined){
            throw new Error('Данный логин не достпуен');
        }
        if(playerPassword !== playerRepeatPassword) {
            throw new Error('Пароли на совпадают');
        }

        await this.accountDBService.insertNewRow({login: playerLogin, password: playerPassword, money: defaultParameters.defaultAccountMoney});
        //автоматичский вход в аккаунт если игрок только что зарегестрировался
        await this.onAccountEnterAttempt(player, playerLogin, playerPassword);
    }

    onAccountVehsAttempt(player: alt.Player): number {
        const currentPlayerAccountId = this.requestPlayerAccountId(player);
        console.log("currentPlayerAccountId",currentPlayerAccountId)
        return currentPlayerAccountId;
    }

    async requestPlayerDBData(player: alt.Player): Promise<Account | undefined> {
        const currentPlayerAccountId = this.requestPlayerAccountId(player);
        const currentPlayerDBData = await this.accountDBService.getRowByPrimaryKey(currentPlayerAccountId!);
        if(!currentPlayerDBData){
            throw new Error('Не удалось получить данные об игроке');
        }
        return currentPlayerDBData;
    }

    requestPlayerAccountId(player: alt.Player): number {
        if(!this.allLoginnedPlayers.has(player)){
            throw new Error('Для этого дейтсвия необходимой войти в аккаунт');
        }
        const currentPlayerAccountId = this.allLoginnedPlayers.get(player)?.accountId;
        if(!currentPlayerAccountId){
            throw new Error('Не удалось получить игрока с таким ID');
        }
        return currentPlayerAccountId;
    }

    checkIsPlayerLoggedIn(player: alt.Player): boolean {
       return this.allLoginnedPlayers.has(player);
    }

    accountExit(player: alt.Player): void {
        if(!this.checkIsPlayerLoggedIn(player)){
            return;
        }
        this.allLoginnedPlayers.delete(player);     
    }

    //дебаг команда, команда потом убрать
    printAllLoginnedPlayers(): void {
        alt.log('Весь allLoginnedPlayers');
        this.allLoginnedPlayers.forEach((value, key) => {
            alt.log(`Ключ: ${(key)}`);
            alt.log('value:', (value));
        });
    }
}