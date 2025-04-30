import { Component, OnInit, ViewChild } from '@angular/core';
import { LogementService } from '../../core/services/logement.service';
import { Logement } from '../../core/models/logement.model';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

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

  // Pie chart
  pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' }
    }
  };
  pieChartData: ChartData<'pie', number[], string> = {
    labels: [],
    datasets: [{ data: [] }]
  };
  pieChartType: ChartType = 'pie';

  // Bar chart
  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    scales: { y: { beginAtZero: true } }
  };
  barChartData: ChartData<'bar', number[], string> = {
    labels: [],
    datasets: [{ data: [], label: 'Price' }]
  };
  barChartType: ChartType = 'bar';

  constructor(private logementService: LogementService) {}

  ngOnInit(): void {
    this.fetchLogements();
  }

  fetchLogements() {
    this.logementService.getAllLogements().subscribe({
      next: (data) => {
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

        // Update bar chart
        this.barChartData = {
          labels: data.slice(0, 5).map(log => log.titre),
          datasets: [{ data: data.slice(0, 5).map(log => log.price), label: 'Price' }]
        };

        // Trigger chart update
      },
      error: (err) => {
        console.error('Error fetching logements:', err);
      }
    });
  }
}