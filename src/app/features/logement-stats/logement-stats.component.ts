import { Component, OnInit } from '@angular/core';
import { LogementService } from 'src/app/core/services/logement.service';
import { Logement } from 'src/app/core/models/logement.model';
import { ChartData, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-logement-stats',
  templateUrl: './logement-stats.component.html',
  styleUrls: ['./logement-stats.component.scss']
})
export class LogementStatsComponent implements OnInit {
  logements: Logement[] = [];
  totalLogements: number = 0;
  logementTypeCounts: Record<string, number> = {};
  averagePrice: number = 0;

  // Pie chart variables
  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
  };  
  pieChartLabels: string[] = [];
  pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [{ data: [] }]
  };
  pieChartType: ChartType = 'pie';

  // Bar chart variables
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
  };
  barChartLabels: string[] = [];
  barChartData: ChartData<'bar', number[], string> = {
    labels: [],
    datasets: [{ data: [] }]
  };

  constructor(private logementService: LogementService) {}

  ngOnInit(): void {
    this.fetchLogements();
  }

  fetchLogements() {
    this.logementService.getAllLogements().subscribe((data) => {
      this.logements = data;
      this.totalLogements = data.length;

      const counts: Record<string, number> = {};
      let priceSum = 0;

      data.forEach((log) => {
        counts[log.type] = (counts[log.type] || 0) + 1;
        priceSum += log.price;
      });

      this.logementTypeCounts = counts;
      this.averagePrice = priceSum / this.totalLogements;

      // Update pie chart
      this.pieChartData = {
        labels: Object.keys(counts),
        datasets: [{ data: Object.values(counts), label: 'Types' }]
      };

      // Update bar chart (latest 5 logements)
      this.barChartData = {
        labels: data.slice(0, 5).map((log) => log.titre),
        datasets: [
          { data: data.slice(0, 5).map((log) => log.price), label: 'Price' }
        ]
      };
    });
  }
}
