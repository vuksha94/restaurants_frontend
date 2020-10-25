import { TableType } from './TableType';
export class ReservationType {
    id?: number;
    tableId?: number;
    name?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    statusId?: number;
    fromTime?: string;
    untillTime?: string;
    reservationDate?: string;
    status?: StatusDesc;
    table?: TableType;
}

export class StatusDesc {
    id?: number;
    description?: string;
    code?: number;
}