//данные которые необходимы для заспавненного игроком авто
export interface ISpawnedVehicleData {
    vehicleId: number;
    vehOwnerId: number;
    DespawnTimeoutId: number | null;
}