import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UnitService } from 'src/app/core/services/unit.service';
import { Unit } from 'src/app/core/models/unit.model';

@Component({
  selector: 'app-unit-list',
  templateUrl: './unit-list.component.html',
  styleUrls: ['./unit-list.component.scss'],
})
export class UnitListComponent {
  units: Unit[] = [];
  logementId?: number;

  constructor(private unitService: UnitService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const logementIdParam = this.route.snapshot.paramMap.get('logementId');

    if (logementIdParam) {
      this.logementId = Number(logementIdParam);
      this.unitService.getByLogement(this.logementId).subscribe(data => {
        this.units = data;
      });
    } else {
      this.unitService.getAllUnits().subscribe(data => {
        this.units = data;
      });
    }
  }
}
