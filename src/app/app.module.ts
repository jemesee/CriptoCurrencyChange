import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { importType } from '@angular/compiler/src/output/output_ast';
import { MatTabsModule } from '@angular/material/tabs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CryptoComponent } from './crypto/crypto.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { RouterModule } from '@angular/router';
import { WebsocketService } from './shared/websocket-service.service';
import { ToastrModule } from 'ngx-toastr';
import { CryptoCurrencyService } from './shared/crypto-currency.service';
import { UserService } from './shared/user.service';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CryptoComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatTabsModule,
    NgbModule,
    FormsModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot([
      { path: '', component: LoginComponent },
      { path: 'login', component: LoginComponent },
      { path: 'crypto', component: CryptoComponent }
    ]),
    NgxChartsModule
  ],
  exports: [MatTabsModule],
  providers: [WebsocketService, CryptoCurrencyService, UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
