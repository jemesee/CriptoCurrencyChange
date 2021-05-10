import { Injectable } from "@angular/core";
import { ResponseMessage } from "./response-message.model";

@Injectable()
export class WebsocketService {

  webSocket: WebSocket
  responses: ResponseMessage[] = [];

  constructor() {  }

  public openWebSocket(){                     //kapcsolat megnyitása
    this.webSocket = new WebSocket("ws://ws-sandbox.coinapi.io/v1/");

    this.webSocket.onopen = (event) => {
      console.log('Open: ', event);
    };

    this.webSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      let resp = new ResponseMessage(data.price_high, data.price_low)
      this.responses.push(resp);
    };

    this.webSocket.onclose = (event) => {
      console.log('Close: ', event);
    };
  }

  private requestMessage = {
    type: "hello",
    apikey: "4F45CA92-D460-4764-A280-060AF156CCF6",
    heartbeat: "true",
    subscribe_data_type: "ohlcv",
    subscribe_filter_asset_id: ["BTC"],
    subscribe_filter_period_id: ["1MIN"]
  }

  public sendMessage(){                           //hello üzenet küldése
    this.webSocket.send(JSON.stringify(this.requestMessage));
  }

  public closeWebSocket() {                       //kapcsolat bezárása
    this.webSocket.close();
  }
}