export class WorkingTime {
    restourantId: number;
    dayOfWeekId: number;
    openingTime: string;
    closingTime: string;

    isWorking?: boolean;

    constructor(dayOfWeekId = 0, restourantId = 0, openingTime = "", closingTime = "", isWorking = false) {
        this.restourantId = restourantId;
        this.dayOfWeekId = dayOfWeekId;
        this.openingTime = openingTime;
        this.closingTime = closingTime;
        this.isWorking = isWorking;
    }
}