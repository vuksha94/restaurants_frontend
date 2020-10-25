export class UserType {
    id: number;
    email: string;
    restaurantId: number

    constructor(id: number, email: string, restaurantId: number) {
        this.id = id;
        this.email = email;
        this.restaurantId = restaurantId;
    }
}