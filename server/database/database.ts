import { Generated, Kysely, MysqlDialect, ParseJSONResultsPlugin } from 'kysely';
import { createPool } from 'mysql2';

import * as alt from 'alt-server';

export interface Database {
    account: Account;
    vehicles: Vehicles;
}

export interface Account {
    accountId: Generated<number>;
    login: string;
    password: string;
    registrationDate: Generated<Date>;
    money: number;
}
/*
CREATE TABLE account (
    accountId INT AUTO_INCREMENT PRIMARY KEY,
    login VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    registrationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    money INT
);
*/
export interface Vehicles {
    vehId: Generated<number>;
    ownerId: number;
    model: number; 
    mainColour:  alt.RGBA | any;
    secondaryColour: alt.RGBA | any;
    registrationNumber: string | null;
    price: number | null;    
}
/* 
CREATE TABLE vehicles (
    vehId INT AUTO_INCREMENT PRIMARY KEY,
    ownerId INT NOT NULL,
    model INT NOT NULL,
    mainColour VARCHAR(50) NOT NULL,
    secondaryColour VARCHAR(50) NOT NULL,
    registrationNumber VARCHAR(50) UNIQUE,
    price INT,
    CONSTRAINT vehicle_owner FOREIGN KEY (ownerId) REFERENCES account(accountId) ON DELETE CASCADE
); 
*/

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
    },
    plugins: [new ParseJSONResultsPlugin()]
});