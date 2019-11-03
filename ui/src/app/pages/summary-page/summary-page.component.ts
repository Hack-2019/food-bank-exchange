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
          quantity: 8,
          name: 'Beet'
      },
      {
          quantity: 8,
          name: 'Cabbage'
      },
      {
          quantity: 8,
          name: 'Beet'
      },
      {
          quantity: 8,
          name: 'Beet'
      },
      {
          quantity: 8,
          name: 'Beet'
      },
      {
          quantity: 8,
          name: 'Beet'
      },
  ]);
  displayedColumns: string[] = ['name', 'quantity'];

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
