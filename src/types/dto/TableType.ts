import { TableDescType } from "./TableDescType";
import { RestourantInfoType } from "./RestaurantInfoType";

export interface TableType {
    id?: number;
    restourantId?: number;
    tableNumber?: number;
    descriptionId?: number;
    description?: TableDescType;
    capacity?: number;
    maxHoursAvailable?: number;
    restourant?: RestourantInfoType;
}