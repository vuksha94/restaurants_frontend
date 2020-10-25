export class AddRestaurantType {
    name: string;
    description?: string;
    address: string;
    cityId: number;
    photo?: string;

    constructor(name = "", description = "", address = "", cityId = 0) {
        this.name = name;
        this.description = description;
        this.address = address;
        this.cityId = cityId;
    }
}