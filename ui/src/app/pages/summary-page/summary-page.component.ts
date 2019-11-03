import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-summary-page',
  templateUrl: './summary-page.component.html',
  styleUrls: ['./summary-page.component.css']
})
export class SummaryPageComponent implements OnInit {

  dataSource = new MatTableDataSource([
      {
          url: 'https://i0.wp.com/images-prod.healthline.com/hlcmsresource/images/AN_images/AN172-Beets-1296x728-Header.jpg?w=1155',
          quantity: 8,
          name: 'Beet'
      },
      {
          url: 'https://pcdn.columbian.com/wp-content/uploads/2019/08/0830_met_cabbage-1226x0-c-default.jpg',
          quantity: 8,
          name: 'Cabbage'
      },
      {
          url: 'https://i0.wp.com/images-prod.healthline.com/hlcmsresource/images/AN_images/AN172-Beets-1296x728-Header.jpg?w=1155',
          quantity: 8,
          name: 'Beet'
      },
      {
          url: 'https://i0.wp.com/images-prod.healthline.com/hlcmsresource/images/AN_images/AN172-Beets-1296x728-Header.jpg?w=1155',
          quantity: 8,
          name: 'Beet'
      },
      {
          url: 'https://i0.wp.com/images-prod.healthline.com/hlcmsresource/images/AN_images/AN172-Beets-1296x728-Header.jpg?w=1155',
          quantity: 8,
          name: 'Beet'
      },
      {
          url: 'https://i0.wp.com/images-prod.healthline.com/hlcmsresource/images/AN_images/AN172-Beets-1296x728-Header.jpg?w=1155',
          quantity: 8,
          name: 'Beet'
      },
  ]);
  displayedColumns: string[] = ['image', 'name', 'quantity',];

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  user: string;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.user = this.auth.getAuthenticatedUser();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

}
