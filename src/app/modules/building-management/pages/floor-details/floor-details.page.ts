import { Component, OnInit, Input, SimpleChanges, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilitiesService } from '../../../../core/services/utilities.service';

@Component({
  selector: 'app-floor-details',
  templateUrl: './floor-details.page.html',
  styleUrls: ['./floor-details.page.scss']
})
export class FloorDetailsPage implements OnInit {
  @Input() floorId: any;
  index = this.activatedRoute.snapshot.queryParams['selectedIndex'];
  selectedIndex = 0;
  navLinks = [
    {
      label: 'Data',
      index: 0
    }, {
      label: 'Layout',
      index: 1
    }
  ]

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private _UtilitiesService: UtilitiesService,
  ) { 

  }

  ngOnInit() {
    if(this.index) {
      this.selectedIndex = this.index;
    }
  }

  selectedTabChange(e) {
    this.selectedIndex = e.index;
  }
}
