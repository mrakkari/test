import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarComponent } from '../../lib/shared/calendar/calendar.component';
import { PriceCalendarComponent } from '../price-calendar/price-calendar.component';
import { FilterSidebarComponent } from '../filter-sidebar/filter-sidebar.component';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { FlightService, Flight, FlightSearchParams, FlightSearchResponse } from '../../services/flight.service';

interface ShowSections {
  escales: boolean;
  heuresDepart: boolean;
  dureeVoyage: boolean;
}

interface FilterOptions {
  escales: string[];
  heuresDepart: { min: number; max: number };
  dureeVoyage: { min: number; max: number };
}

@Component({
  selector: 'app-flight-search',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    CalendarComponent, 
    PriceCalendarComponent, 
    FilterSidebarComponent, 
    FlightCardComponent
  ],
  template: `
    <div class="bg-slate-800 min-h-screen">
      <div class="bg-slate-800 px-4 sm:px-6 lg:px-8 py-6">
        <div class="max-w-7xl mx-auto">
          <div class="flex items-center justify-between mb-8">
            <div class="flex items-center">
              <svg class="w-8 h-8 text-white mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
              </svg>
              <span class="text-white text-xl font-bold">Skyscanner</span>
            </div>
            <div class="flex items-center space-x-4 text-white">
              <span class="cursor-pointer hover:text-blue-300">Help</span>
              <span class="cursor-pointer hover:text-blue-300">English (UK) • Tunisia • EUR</span>
              <span class="cursor-pointer hover:text-blue-300">❤️</span>
              <span class="cursor-pointer hover:text-blue-300">Log in</span>
            </div>
          </div>

          <div class="flex space-x-4 mb-8">
            <div class="nav-tab active">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
              </svg>
              Flights
            </div>
            <div class="nav-tab inactive">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V6H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/>
              </svg>
              Hotels
            </div>
            <div class="nav-tab inactive">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
              </svg>
              Car hire
            </div>
          </div>

          <div class="mb-8">
            <h1 class="text-4xl md:text-5xl font-bold text-white mb-2">
              Find the best flight deals anywhere
            </h1>
          </div>

          <div class="mb-6">
            <div class="inline-flex bg-slate-700 rounded-lg p-1">
              <button class="px-4 py-2 rounded-md bg-slate-600 text-white text-sm font-medium">
                Return
                <svg class="w-4 h-4 ml-1 inline" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-6 gap-4 mb-2">
            <div class="search-input-group">
              <div class="search-input-label">From</div>
              <input
                type="text"
                [(ngModel)]="searchParams().ville_depart"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Country, city or airport"
              />
            </div>

            <div class="swap-button lg:block hidden">
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
              </svg>
            </div>

            <div class="search-input-group">
              <div class="search-input-label">To</div>
              <input
                type="text"
                [(ngModel)]="searchParams().ville_arrivee"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Country, city or airport"
              />
            </div>

            <div class="search-input-group">
              <div class="search-input-label">Depart</div>
              <button 
                type="button" 
                class="w-full px-4 py-3 border border-gray-300 rounded-lg text-left text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                (click)="openCalendar('depart')"
              >
                {{ searchParams().date_depart || 'Depart date' }}
              </button>
            </div>

            <div class="search-input-group">
              <div class="search-input-label">Return</div>
              <button 
                type="button" 
                class="w-full px-4 py-3 border border-gray-300 rounded-lg text-left text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                (click)="openCalendar('return')"
              >
                {{ searchParams().date_retour || 'Add date' }}
              </button>
            </div>

            <div class="search-input-group">
              <div class="search-input-label">Travellers and cabin class</div>
              <button 
                type="button" 
                class="w-full px-4 py-3 border border-gray-300 rounded-lg text-left text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {{ searchParams().travellers.adults }} Adult, {{ searchParams().travellers.cabinClass }}
              </button>
            </div>
          </div>

          <div class="flex flex-wrap gap-4 mb-6 text-sm text-white">
            <label class="flex items-center">
              <input type="checkbox" class="mr-2">
              Add nearby airports
            </label>
            <label class="flex items-center">
              <input type="checkbox" class="mr-2">
              Add nearby airports
            </label>
            <label class="flex items-center">
              <input type="checkbox" class="mr-2">
              Direct flights
            </label>
          </div>

          <div class="flex justify-end mb-6">
            <button
              type="button"
              class="btn-primary text-lg px-12"
              (click)="searchFlights()"
              [disabled]="isLoading() || !isSearchValid()"
            >
              <span *ngIf="!isLoading()">Search</span>
              <span *ngIf="isLoading()" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </span>
            </button>
          </div>

          <div class="flex items-center justify-between bg-slate-700 rounded-lg p-4 mt-6">
            <div class="flex items-center text-white">
              <svg class="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span>Access price tracking features to help you save</span>
            </div>
            <button class="bg-white text-slate-800 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Log in
            </button>
          </div>
        </div>
      </div>

      <div class="bg-gray-50 min-h-screen">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <!-- Filter Sidebar -->
            <app-filter-sidebar 
              (filtersChanged)="applyFilters($event)"
            ></app-filter-sidebar>

            <!-- Main Content -->
            <div class="lg:col-span-3">
              <!-- Price Calendar -->
              <app-price-calendar 
                [selectedDate]="searchParams().date_depart"
                (dateSelected)="onPriceDateSelected($event)"
              ></app-price-calendar>

              <!-- Flight Cards -->
              <div class="mt-6 space-y-4" *ngIf="filteredFlights().length > 0">
                <app-flight-card 
                  *ngFor="let flight of filteredFlights()"
                  [flight]="flight"
                ></app-flight-card>
              </div>
              <div *ngIf="filteredFlights().length === 0 && !isLoading()" class="text-center py-12">
                <div class="mb-4">
                  <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A10.003 10.003 0 0124 26c4.21 0 7.813 2.602 9.288 6.286M30 14a6 6 0 11-12 0 6 6 0 0112 0zm12 6a4 4 0 11-8 0 4 4 0 018 0zm-28 0a4 4 0 11-8 0 4 4 0 018 0z"/>
                  </svg>
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun vol trouvé</h3>
                <p class="text-gray-600">Essayez de modifier vos critères de recherche.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div 
        *ngIf="showCalendar()"
        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
        (click)="showCalendar.set(false)"
      >
        <div (click)="stopPropagation($event)" class="w-full max-w-md">
          <app-calendar 
            [initialDate]="getInitialDate()"
            (dateSelected)="onDateSelected($event)"
            (cancelled)="showCalendar.set(false)"
          ></app-calendar>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .nav-tab {
      @apply flex items-center px-4 py-2 rounded-md text-sm font-medium text-white hover:text-blue-300;
    }

    .nav-tab.active {
      @apply bg-slate-600;
    }

    .nav-tab.inactive {
      @apply text-gray-400;
    }

    .search-input-group {
      @apply relative;
    }

    .search-input-label {
      @apply text-xs text-gray-600 mb-1;
    }

    .swap-button {
      @apply flex items-center justify-center bg-white p-2 border border-gray-300 rounded-md;
    }

    .btn-primary {
      @apply bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors;
    }

    .flight-card {
      @apply bg-white rounded-lg border border-gray-200 p-4;
    }
  `]
})
export class FlightSearchComponent {
  searchParams = signal<any>({
    ville_depart: 'Tunisia (TN)',
    travellers: { adults: 1, cabinClass: 'Economy' }
  });
  showCalendar = signal(false);
  calendarType = signal<'depart' | 'return' | null>(null);
  isLoading = signal(false);
  searchResults = signal<FlightSearchResponse | null>(null);
  errorMessage = signal<string | null>(null);
  filters = signal<FilterOptions>({
    escales: ['direct', '1', '2+'],
    heuresDepart: { min: 0, max: 1439 },
    dureeVoyage: { min: 180, max: 2640 }
  });

  constructor(private flightService: FlightService) {}

  openCalendar(type: 'depart' | 'return') {
    this.calendarType.set(type);
    this.showCalendar.set(true);
  }

  getInitialDate(): Date {
    const type = this.calendarType();
    const dateStr = type === 'depart' ? this.searchParams().date_depart : this.searchParams().date_retour;
    return dateStr ? new Date(dateStr) : new Date();
  }

  onDateSelected(date: string) {
    const type = this.calendarType();
    if (type === 'depart') {
      this.searchParams.update(params => ({ ...params, date_depart: date }));
    } else if (type === 'return') {
      if (!this.searchParams().date_depart) {
        this.errorMessage.set('Please select departure date first.');
        this.showCalendar.set(false);
        return;
      }
      const departDate = new Date(this.searchParams().date_depart);
      const returnDate = new Date(date);
      if (returnDate <= departDate) {
        this.errorMessage.set('Return date must be after departure date.');
        this.showCalendar.set(false);
        return;
      }
      this.searchParams.update(params => ({ ...params, date_retour: date }));
    }
    this.showCalendar.set(false);
    this.searchFlights();
  }

  onPriceDateSelected(date: string) {
    this.searchParams.update(params => ({ ...params, date_depart: date }));
    this.searchFlights();
  }

  applyFilters(newFilters: FilterOptions) {
    this.filters.set(newFilters);
  }

  searchFlights() {
    if (!this.searchParams().ville_depart || !this.searchParams().ville_arrivee || !this.searchParams().date_depart || !this.searchParams().date_retour) {
      this.errorMessage.set('Veuillez remplir tous les champs (départ, arrivée, date de départ et date de retour).');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.flightService.searchFlights(this.searchParams()).subscribe({
      next: (response) => {
        this.searchResults.set(response);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Une erreur est survenue lors de la recherche. Veuillez réessayer.');
        this.isLoading.set(false);
        console.error('Search error:', error);
      }
    });
  }

  filteredFlights(): Flight[] {
    const results = this.searchResults()?.flights || [];
    const filters = this.filters();

    return results.filter(flight => {
      const isEscalesMatch = filters.escales.includes(flight.direct ? 'direct' : flight.escales.toString() + '+');
      const departureMinutes = this.parseTimeToMinutes(flight.heure_depart);
      const isTimeMatch = departureMinutes >= filters.heuresDepart.min && departureMinutes <= filters.heuresDepart.max;
      const durationMinutes = this.parseTimeToMinutes(flight.temps_trajet);
      const isDurationMatch = durationMinutes >= filters.dureeVoyage.min && durationMinutes <= filters.dureeVoyage.max;

      return isEscalesMatch && isTimeMatch && isDurationMatch;
    });
  }

  private parseTimeToMinutes(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + (minutes || 0);
  }

  isSearchValid(): boolean {
    return !!this.searchParams().ville_depart && !!this.searchParams().ville_arrivee && !!this.searchParams().date_depart && !!this.searchParams().date_retour;
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }
}