import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { makeRe } from 'minimatch';

@Component({
  selector: 'app-summary-page',
  templateUrl: './summary-page.component.html',
  styleUrls: ['./summary-page.component.css']
})
export class SummaryPageComponent implements OnInit {

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['image', 'name', 'quantity',];

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  user: string;

  constructor(private auth: AuthService, private http: HttpClient) {}

  async ngOnInit() {
    this.user = this.auth.getAuthenticatedUser();

    this.dataSource = await this.getData();

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  async getData(): Promise<MatTableDataSource<any>> {
    return new Promise(async (resolve) => {
      const stock = this.makeRequest('stock/list');
      const food = this.makeRequest('food/list');

      const foods = (await stock).foods;

      foods.forEach(async element => {
          element.url = this.getUrlFor(element.name, await food);
      });

      resolve(new MatTableDataSource(foods));
    });
  }

  getUrlFor(name: string, food: any): string {
    let ret: string;
    food.forEach(element => {
      if (element.name === name) {
        ret = element.url;
      }
    });
    return ret;
  }

  makeRequest(endpoint: string): Promise<any> {
      return new Promise((resolve) => {
        this.http.get(`http://${environment.server}/${endpoint}`, {withCredentials: true}).subscribe((resp) => {
            resolve(resp);
        });
      });
  }

}
