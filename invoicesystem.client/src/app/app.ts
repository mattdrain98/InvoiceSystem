export interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

import { HttpClient } from '@angular/common/http';
import { Component, signal, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit {
  public forecasts: WeatherForecast[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getForecasts();
  }

  async getForecasts() {
    try {
      this.forecasts = await firstValueFrom(this.http.get<WeatherForecast[]>('/weatherforecast'));
    } catch (error) {
      console.error(error);
    }
  }

  protected readonly title = signal('invoicesystem.client');
}
