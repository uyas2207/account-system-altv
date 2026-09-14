import { Selectable, Generated, Kysely, MysqlDialect, Updateable } from 'kysely';
import { createPool } from 'mysql2';

export interface Database {
    account: AccountTable;
    vehicles: VehiclesTable;
}

export interface AccountTable {
    accountId: Generated<number>;
    login: string;
    password: string;
    registrationDate: Generated<Date>;
    money: number;
}

export type Account = Selectable<AccountTable>;
//export type AccountUpdate = Updateable<AccountTable>;
/*
CREATE TABLE account (
    accountId INT AUTO_INCREMENT PRIMARY KEY,
    login VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    registrationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    money INT NOT NULL
);
*/
export interface VehiclesTable {
    vehId: Generated<number>;
    ownerId: number;
    model: string; 
    primaryColor:  number;
    secondaryColor: number;
    registrationNumber: string | null;
    price: number | null;    
}

export type Vehicles = Selectable<VehiclesTable>;
export type VehiclesUpdate = Updateable<VehiclesTable>;
/* 
CREATE TABLE vehicles (
    vehId INT AUTO_INCREMENT PRIMARY KEY,
    ownerId INT NOT NULL,
    model VARCHAR(50) NOT NULL,
    primaryColor INT NOT NULL,
    secondaryColor INT NOT NULL,
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
    }
});