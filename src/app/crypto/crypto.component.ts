import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CryptoCurrencyService } from '../shared/crypto-currency.service';
import { Currency, Datajson, Daydata } from '../shared/currency.model';
import { User } from '../shared/user.model';
import { UserService } from '../shared/user.service';
import { WebsocketService } from '../shared/websocket-service.service';

@Component({
  selector: 'app-crypto',
  templateUrl: './crypto.component.html',
  styleUrls: ['./crypto.component.css']
})
export class CryptoComponent implements OnInit, OnDestroy {
  choosenCryptos: Currency[] = [];
  allCryptos: Currency[] = [];
  user = new User()

  constructor(private cryptoService: CryptoCurrencyService, private websocketService: WebsocketService, 
    private toastr: ToastrService, private userService: UserService) { 
  }

  ngOnInit(): void {
    this.websocketService.openWebSocket();                          //Megnyitja a websocket kapcsolatot induláskor
    this.user = this.userService.getUser()
    this.getList();
  }

  ngOnDestroy(): void {
    this.websocketService.closeWebSocket();                         //Bezárárskor lezárjuk a websocketet is
  }

  loadUserCryptos(){
    if(this.user.currencies !== undefined){
      for(let i = 0; i < this.user.currencies.length; i++){
        let currency = this.allCryptos.find(x => x.asset_id== this.user.currencies[i])
        if(currency.name != ""){
          this.choosenCryptos.push(currency)
          this.getDatas(currency)
        }
      }
    }
  }

  async getList(){                                                  //lehívjuk a kripto valuta listát
    this.allCryptos = await this.cryptoService.getCrypto();
    this.loadUserCryptos()
  }

  chooseType(){                                                     //Kiválasztjuk, hogy melyik kriptot választották
    var c = (<HTMLSelectElement>document.getElementById("cryptoCurrencies")).selectedIndex;  
    this.user.currencies.push(this.allCryptos[c].asset_id)          //hozzáadjuk az aktuális user valutáihoz, és elmentjük
    localStorage.setItem(this.user.username, JSON.stringify(this.user))   

    this.choosenCryptos.push(this.allCryptos[c]);                   //kiválaszott index alapján, megkeressük, belerakjuk a kiválasztott listába
    this.getDatas(this.allCryptos[c]);                              //lekérjük a kiválasztott kripto érték adatait
  }

  async getDatas(crypto: Currency){     
    var dateStart = new Date(Date.now() - (7 * 24 * 60 * 60 * 1000));
    var month = dateStart.getMonth() + 1;
    var day = dateStart.getDate();
    var realMonth, realDay: string

    realMonth = month > 10 ? month.toString() : "0" + month
    realDay = day > 10 ? day.toString() : "0" + day
    
    var startdate = dateStart.getFullYear() + "-" + realMonth + "-" + realDay            //1 héttel ezelőtti startdate
    var oneDayData = await this.cryptoService.getDatas(crypto, startdate);               //megkapjuk egy nap érték adatait
    
    crypto.dayDatas = oneDayData;                                                        //elrakjuk a normál adatokat is
    this.dataToJson(oneDayData, crypto);
  }

  dataToJson(data: Daydata[], crypto: Currency){
    for(var i = 0; i < data.length; i++){                                                //Egy napos diagramhoz fontos 
      var oneDataJson = new Datajson();                                                  //adatokat (open, start) egyesével berakjuk a valuta értékhez
      oneDataJson.name = data[i].start.slice(0, 10);
      oneDataJson.value = data[i].open;
      crypto.dayDatasJSON.push(oneDataJson); 
    }
  }

  closeCrypto(index){                                                                   //bezáráskor kivesszük a listából az adott kriptot
    this.choosenCryptos.splice(index, 1); 
    this.user.currencies.splice(index, 1);                                              //kivesszük a fehasználó kriptoi közül is és mentjük
    localStorage.setItem(this.user.username, JSON.stringify(this.user)) 
  }

  DollarToCrypto(dollarValue: number){                                                  //Dollar kriptoértékre konvertáló fv 
    var dollarAmount = (<HTMLInputElement>document.getElementById("amountOfDollar")).value;
    var result = parseInt(dollarAmount) / dollarValue;
    document.getElementById("cryptoValue").textContent = result +"";
  }

  CryptoToDollar(cryptoValue: number){                                                  //Kriptot dollarra konvertáló fv 
    var dollarAmount = (<HTMLInputElement>document.getElementById("amountOfCrypto")).value;
    var result = parseInt(dollarAmount) * cryptoValue;
    document.getElementById("dollarValue").textContent = result +"";
  }



  view: any[] = [1000, 500];                                  //diagram beállítások
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = "Day";
  showYAxisLabel = true;
  yAxisLabel = "USD";

  colorScheme = {
    domain: ['#fc713a', '#fc913a', '#fcb53a', '#fcdf3a', '#fcf23a', '#f2fc3a', '#e2fc3a']
  };

  DiagramData : {                                             //adatok a diagramhoz
    name: string,
    value: number
  }[]

  ShowDiagram(cryptoJSONdata: Datajson[]){                   //diagram adatait tölti be
    this.DiagramData = []
    for(let i = 0; i < cryptoJSONdata.length; i++){
      this.DiagramData.push({name: cryptoJSONdata[i].name, value: cryptoJSONdata[i].value})     
    }
    if(this.DiagramData.length == 0){
      this.toastr.warning("Sajnos az elmúlt napok adatai nincsenek az adatbázisban", "Nincs ilyen adatunk") 
    }
  }
}