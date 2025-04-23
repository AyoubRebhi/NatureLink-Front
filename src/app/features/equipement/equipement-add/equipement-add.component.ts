import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EquipementService } from 'src/app/core/services/equipement.service';
import { Equipement } from 'src/app/core/models/equipement.model';

@Component({
  selector: 'app-equipement-add',
  templateUrl: './equipement-add.component.html',
  styleUrls: ['./equipement-add.component.scss'],  // Add your custom styles here
})
export class EquipementAddComponent implements OnInit {
  equipement: Equipement = { name: '' };
  isEdit = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private equipementService: EquipementService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.equipementService.getById(+id).subscribe((data) => (this.equipement = data));
    }
  }

  onSubmit() {
    if (this.isEdit && this.equipement.id) {
      this.equipementService.update(this.equipement.id, this.equipement).subscribe(() => {
        // Navigate to the equipment list page after update
        this.router.navigate(['/admin/equipement/list']);
      });
    } else {
      this.equipementService.create(this.equipement).subscribe(() => {
        // Navigate to the equipment list page after creation
        this.router.navigate(['/admin/equipement/list']);
      });
    }}
}
