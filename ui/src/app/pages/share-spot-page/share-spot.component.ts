import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {MarketplaceEntry, MarketplaceNeed, MarketplaceProvider} from "../../../../../core/models/marketplace/marketplace"
import {Stock, StockItem} from "../../../../../core/models/store";
import {AuthService} from "../../auth/auth.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-share-spot',
  templateUrl: './share-spot.component.html',
  styleUrls: ['./share-spot.component.css']
})
export class ShareSpotComponent implements OnInit {

  canProvideDataSource = new MatTableDataSource(
    [
      <CanProvide>{foodName: "Loading...", neededQuantity: 0, ownedQuantity: 0, needyUsername: "Loading..."}
    ]
  );
  canProvideDataSourceDisplayedColumns: string[] = ['foodName', 'neededQuantity', 'ownedQuantity', 'needyUsername'];

  canReceiveDataSource= new MatTableDataSource(
    [
      <CanReceive>{foodName: "Loading...", offeredQuantity: 0, providerUsername: "Loading...", requiredQuantity: 0}
    ]
  );
  canReceiveDataSourceDisplayedColumns: string[] = ['foodName', 'offeredQuantity', 'providerUsername', 'requiredQuantity'];

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  httpOptions = {
    withCredentials: true
  };

  constructor(private http: HttpClient, private auth: AuthService) { }

  ngOnInit() {
    this.loadMarketplace();
  }

  loadMarketplace(): void {
    this.http.get<MarketplaceEntry[]>("http://" + environment.server + "/marketplace/list", this.httpOptions).subscribe((entries: MarketplaceEntry[]) => {
      console.log("I'm here")
      this.http.get<Stock>("http://" + environment.server + "/stock/list", this.httpOptions).subscribe((stock: Stock) => {
        let curUser = this.auth.getAuthenticatedUser();

        let canProvide: CanProvide[] = [];

        let usersNeeds: {foodName: string, quantity: number, userNeed: MarketplaceNeed}[] = [];
        let canReceive: CanReceive[] = [];

        entries.forEach((entry) => {
          console.log(entry);
          entry.needs.forEach(need => {
            // @ts-ignore
            if (need != "") {
              console.log("test" + need + "523");
              if (need.username == curUser) {
                usersNeeds.push({foodName: entry.foodName, quantity: need.quantity, userNeed: need});
              } else {
                let usersStock = stock.foods.find((food) => food.name == entry.foodName);
                if (usersStock.quantity >= 0) {
                  canProvide.push({
                    foodName: entry.foodName,
                    neededQuantity: need.quantity,
                    needyUsername: need.username,
                    ownedQuantity: usersStock.quantity
                  });
                }
              }
            }
          });
        });

        entries.forEach((entry) => {
          let matchingNeed = usersNeeds.find(need => need.foodName);
          if (matchingNeed) {
            entry.providers.forEach(provider => {
              console.log("ggds" + provider);
              if (provider.username != curUser) {
                canReceive.push({foodName: entry.foodName, offeredQuantity: provider.quantity, providerUsername: provider.username, requiredQuantity: matchingNeed.userNeed.quantity});
              }
            });
          }
        });
        this.canProvideDataSource.data = canProvide;
        this.canReceiveDataSource.data = canReceive;
      });
    });
  }
}

interface CanProvide {
  foodName: string;
  neededQuantity: number;
  needyUsername: string;
  ownedQuantity: number;
}

interface CanReceive {
  foodName: string;
  offeredQuantity: number;
  requiredQuantity: number;
  providerUsername: string;
}
