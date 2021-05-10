import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Currency, Daydata } from './currency.model';

@Injectable({
  providedIn: 'root'
})
export class CryptoCurrencyService {
  actualCurr: Currency;
  actualData: Daydata;
  list: Currency[] = [];
  data: Daydata[] = [];
  readonly rootURL = "https://rest.coinapi.io/v1/assets?apikey=4F45CA92-D460-4764-A280-060AF156CCF6";

  constructor(private http: HttpClient) {
  }

  async getCrypto() {
    this.list.length = 0;
    await fetch(this.rootURL)
      .then(a => a.json())
      .then(response => {
        for (var i = 0; i < 11820; i++) {                             //lekérjük az adatokat
          if (response[i].type_is_crypto == 1) {                     
            this.actualCurr = new Currency();
            this.actualCurr.asset_id = response[i].asset_id;
            this.actualCurr.name = response[i].name;
            this.actualCurr.data_start = response[i].data_start;  

            var match = JSON.stringify(response[i]).includes("price_usd");      //ha nincs USD-ben megadot értéke, akkor ez 0
            if (!match) {
              this.actualCurr.price_usd = 0;
            }
            else {
              this.actualCurr.price_usd = response[i].price_usd;
            }
            this.actualCurr.dayDatas = [];                                      //üres listák később töltjük fel őket
            this.actualCurr.dayDatasJSON = [];

            this.list.push(this.actualCurr);
          }
        }
      });
    return this.list;
  }

  async getDatas(crypto: Currency, startDate: string) {
    this.data.length = 0;
    await fetch("https://rest.coinapi.io/v1/ohlcv/" + crypto.asset_id + "/USD/history?apikey=4F45CA92-D460-4764-A280-060AF156CCF6&period_id=1DAY&time_start=" + startDate + "T00:00:00")
      .then(a => a.json())
      .then(response => {
        for (var i = 0; i < 7; i++) {                                   //lekérjük az elmült egy hét adatait
          this.actualData = new Daydata();                              //és elmentjük őket
          this.actualData.start = response[i].time_period_start;
          this.actualData.end = response[i].time_period_end;
          this.actualData.open = response[i].price_open;
          this.actualData.close = response[i].price_close;

          this.data.push(this.actualData);
        }
      });
    return this.data;
  }
}
