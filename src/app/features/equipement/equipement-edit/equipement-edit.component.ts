import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EquipementService } from 'src/app/core/services/equipement.service';
import { Equipement } from 'src/app/core/models/equipement.model';

@Component({
  selector: 'app-equipement-edit',
  templateUrl: './equipement-edit.component.html',
  styleUrls: ['./equipement-edit.component.scss'],
})
export class EquipementEditComponent implements OnInit {
  equipement: Equipement = { name: '' };
  isEdit = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private equipementService: EquipementService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.equipementService.getById(+id).subscribe((data) => (this.equipement = data));
    }
  }

  onSubmit() {
    if (this.equipement.id) {
      this.equipementService.update(this.equipement.id, this.equipement).subscribe(() => {
        // Navigate to the equipment list page after update
        this.router.navigate(['/admin/equipement/list']);
      });
    }
  }
}
