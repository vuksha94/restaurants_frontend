import { NonWorkingDayType } from "./NonWorkingDayType";
import { OpeningDetails } from "./OpeningDetails";
import { TableType } from "./TableType";
import { WorkingTime } from "./WorkingTime";

export class RestourantInfoType {
    id?: number;
    name?: string;
    description?: string;
    address?: string;
    city?: string;
    photo?: string;

    openingDetails?: OpeningDetails | null; // null ako nisu ubacena u bazu radna vremena po danima
    workingTimes?: WorkingTime[];
    nonWorkingDays?: NonWorkingDayType[];
    tables?: TableType[];
}