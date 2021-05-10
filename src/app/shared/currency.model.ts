export class Daydata {
    start: string = "";
    end: string = "";
    open: number = 0;
    close: number = 0;
}

export class Datajson {
    name: string = "";
    value: number = 0;
}
 
export class Currency {
    asset_id: string = "";
    name: string = "";
    data_start: string = "";
    type_is_crypto: number = 0;
    price_usd: number = 0;
    dayDatas: Daydata[] = [];
    dayDatasJSON: Datajson[] = [];

    constructor(){
        asset_id: "";
        name: "";
        data_start: "";
        type_is_crypto: 0;
        price_usd: 0;
    }
}

