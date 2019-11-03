import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {MarketplaceEntry, MarketplaceNeed, MarketplaceProvider} from "../../../../../core/models/marketplace/marketplace"
import {Stock, StockItem} from "../../../../../core/models/store";
import {AuthService} from "../../auth/auth.service";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-share-spot',
  templateUrl: './share-spot.component.html',
  styleUrls: ['./share-spot.component.css']
})
export class ShareSpotComponent implements OnInit {

  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['foodName', 'neededQuantity', 'ownedQuantity', 'needyUsername'];

  httpOptions = {
    withCredentials: true
  };

  constructor(private http: HttpClient, private auth: AuthService) { }

  ngOnInit() {
    this.loadMarketplace();
  }

  loadMarketplace(): void {
    this.http.get<MarketplaceEntry[]>("http://" + environment.server + "/marketplace/list", this.httpOptions).subscribe((entries: MarketplaceEntry[]) => {
      this.http.get<Stock>("http://" + environment.server + "/stock/list", this.httpOptions).subscribe((stock: Stock) => {
        let curUser = this.auth.getAuthenticatedUser();

        let canProvide: {foodName: string, neededQuantity: number, needyUsername: string, ownedQuantity}[] = [];

        let usersNeeds: {foodName: string, quantity: number, userNeed: MarketplaceNeed}[] = [];
        let canReceive: {foodName: string, offeredQuantity: number, providerUsername: string, userNeed: MarketplaceNeed}[] = [];

        entries.forEach((entry) => {
          entry.needs.forEach(need => {
            if (need.username == curUser) {
              usersNeeds.push({foodName: entry.foodName, quantity: need.quantity, userNeed: need});
            } else {
              let usersStock = stock.foods.find((food) => food.name == entry.foodName);
              if (usersStock.quantity >= 0) {
                canProvide.push({foodName: entry.foodName, neededQuantity: need.quantity, needyUsername: need.username, ownedQuantity: usersStock.quantity});
              }
            }
          });
        });

        entries.forEach((entry) => {
          let matchingNeed = usersNeeds.find(need => need.foodName);
          entry.providers.forEach(provider => {
            canReceive.push({foodName: entry.foodName, offeredQuantity: provider.quantity, providerUsername: provider.username, userNeed: matchingNeed.userNeed});
          });
        });

        this.dataSource.data.push(usersNeeds);
      });
    });
  }
}
