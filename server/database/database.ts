import { Generated, Kysely, MysqlDialect, JSONColumnType, ColumnType } from 'kysely';
import { createPool } from 'mysql2';
import {ICustomColor} from '../types/IVehiclesConfig'
export interface Database {
    account: {
        accountId: Generated<number>;
        login: string;
        password: string;
        registrationDate: Generated<Date>;
        money: number;
    };
/*
CREATE TABLE account (
    accountId INT AUTO_INCREMENT PRIMARY KEY,
    login VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    registrationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    money INT
);
*/
    vehicles: {
        vehId: Generated<number>;
        ownerId: number;
        model: string;
        mainColour:  ColumnType<ICustomColor>;
        secondaryColour: ColumnType<ICustomColor>;
        registrationNumber: string | null;
    };
}
/* 
CREATE TABLE vehicles (
    vehId INT AUTO_INCREMENT PRIMARY KEY,
    ownerId INT NOT NULL,
    model VARCHAR(50) NOT NULL,
    mainColour VARCHAR(50) NOT NULL,
    secondaryColour VARCHAR(50) NOT NULL,
    registrationNumber VARCHAR(50) UNIQUE,
    CONSTRAINT vehicle_owner FOREIGN KEY (ownerId) REFERENCES account(accountId) ON DELETE CASCADE
); 
*/

//    FOREIGN KEY (ownerId) REFERENCES account(id),

export const db = new Kysely<Database>({
    dialect: new MysqlDialect({
        pool: createPool({
            host: '127.0.0.1',
            port: 3306,
            user: 'root',
            database: 'test',
        })
    }),
    log: (event) => {
        if (event.level === 'query') {
            console.log('SQL:', event.query.sql);
            console.log('Parameters:', event.query.parameters);
        }
    }
});

