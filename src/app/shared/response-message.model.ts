export class ResponseMessage {
    price_high: number;
    price_low: number;

    constructor(high: number, low: number){
        this.price_high = high;
        this.price_low = low;
    }
}
