export class NonWorkingDayType {
    restourantId: number;
    descriptionId: number;
    date: string;
    constructor(restourantId = 0, descriptionId = 0, date = "") {
        this.restourantId = restourantId;
        this.descriptionId = descriptionId;
        this.date = date;
    }
}