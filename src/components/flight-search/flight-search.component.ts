import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarComponent } from '../../lib/shared/calendar/calendar.component';
import { PriceCalendarComponent } from '../price-calendar/price-calendar.component';
import { FilterSidebarComponent } from '../filter-sidebar/filter-sidebar.component';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { FlightService, Flight, FlightSearchParams, FlightSearchResponse } from '../../services/flight.service';

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
    <!-- Landing Page View -->
    <div *ngIf="!hasSearched()" class="bg-slate-800 min-h-screen">
      <!-- Header -->
      <div class="bg-slate-800 px-4 sm:px-6 lg:px-8 py-6">
        <div class="max-w-7xl mx-auto">
          <div class="flex items-center justify-between mb-8">
            <div class="flex items-center">
              <svg class="w-8 h-8 text-white mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
              </svg>
              <span class="text-white text-xl font-bold">Skyscanner</span>
            </div>
            <div class="flex items-center space-x-4 text-white text-sm">
              <span class="cursor-pointer hover:text-blue-300">Help</span>
              <span class="cursor-pointer hover:text-blue-300">🌐</span>
              <span class="cursor-pointer hover:text-blue-300">❤️</span>
              <span class="cursor-pointer hover:text-blue-300">👤</span>
              <span class="cursor-pointer hover:text-blue-300">Log in</span>
            </div>
          </div>

          <!-- Navigation Tabs -->
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

          <!-- Main Heading -->
          <div class="mb-12">
            <h1 class="text-4xl md:text-5xl font-bold text-white mb-2">
              Millions of cheap flights. One simple search.
            </h1>
          </div>

          <!-- Trip Type Selector -->
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

          <!-- Search Form -->
          <div class="grid grid-cols-1 lg:grid-cols-6 gap-4 mb-6">
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

          <!-- Additional Options -->
          <div class="flex flex-wrap gap-4 mb-8 text-sm text-white">
            <label class="flex items-center">
              <input type="checkbox" class="mr-2 rounded">
              Add nearby airports
            </label>
            <label class="flex items-center">
              <input type="checkbox" class="mr-2 rounded">
              Add nearby airports
            </label>
            <label class="flex items-center">
              <input type="checkbox" class="mr-2 rounded">
              Direct flights
            </label>
          </div>

          <!-- Search Button -->
          <div class="flex justify-center mb-8">
            <button
              type="button"
              class="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg px-16 py-4 rounded-lg transition-colors duration-200"
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

          <!-- Price Tracking Banner -->
          <div class="flex items-center justify-between bg-slate-700 rounded-lg p-4">
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

      <!-- Hero Section -->
      <div class="relative">
        <div class="h-96 bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-500 flex items-center justify-center">
          <div class="text-center text-white">
            <h2 class="text-3xl font-bold mb-4">Explore every destination</h2>
            <button class="bg-white text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Search flights everywhere
            </button>
          </div>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="bg-white py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-8">Booking flights with Skyscanner</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-4">
              <div class="border-b border-gray-200 pb-4">
                <h3 class="font-medium text-gray-900">How does Skyscanner work?</h3>
              </div>
              <div class="border-b border-gray-200 pb-4">
                <h3 class="font-medium text-gray-900">How can I find the cheapest flight using Skyscanner?</h3>
              </div>
              <div class="border-b border-gray-200 pb-4">
                <h3 class="font-medium text-gray-900">Where should I book a flight to right now?</h3>
              </div>
            </div>
            <div class="space-y-4">
              <div class="border-b border-gray-200 pb-4">
                <h3 class="font-medium text-gray-900">Does Skyscanner do hotels too?</h3>
              </div>
              <div class="border-b border-gray-200 pb-4">
                <h3 class="font-medium text-gray-900">What about car hire?</h3>
              </div>
              <div class="border-b border-gray-200 pb-4">
                <h3 class="font-medium text-gray-900">What's a Price Alert?</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Results Page View -->
    <div *ngIf="hasSearched()" class="bg-gray-100 min-h-screen">
      <!-- Header with Search Summary -->
      <div class="bg-blue-900 px-4 sm:px-6 lg:px-8 py-3">
        <div class="max-w-7xl mx-auto">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <button (click)="goBack()" class="text-white mr-4 p-2 rounded-full hover:bg-blue-800 bg-blue-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </button>
              <div class="text-white">
                <span class="font-medium text-lg">{{ getSearchSummary() }}</span>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Price Calendar -->
      <div class="bg-white border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex items-center justify-center space-x-2 overflow-x-auto">
            <button
              *ngFor="let priceDate of priceDates()"
              (click)="selectPriceDate(priceDate)"
              [class]="getPriceDateClasses(priceDate)"
              class="min-w-0 flex-shrink-0 px-4 py-3 text-center transition-all duration-200 rounded-lg">
              <div class="text-sm font-medium mb-1">{{ priceDate.day }}</div>
              <div class="text-lg font-bold">{{ priceDate.price }}€</div>
            </button>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <!-- Filter Sidebar -->
          <div class="lg:col-span-1">
            <!-- Price Alerts -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
              <div class="flex items-center mb-3">
                <svg class="w-5 h-5 mr-2 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2L3 7v11a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V7l-7-5z"/>
                </svg>
                <span class="text-sm font-medium text-gray-900">Recevoir des alertes prix</span>
              </div>
              <div class="text-sm text-gray-600">44 résultats</div>
            </div>

            <!-- Sort Options -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
              <div class="flex items-center justify-between mb-3">
                <span class="text-sm font-medium text-gray-900">Trier par</span>
                <button class="flex items-center text-sm text-blue-600 font-medium">
                  Le meilleur
                  <svg class="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Escales Filter -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
              <button 
                (click)="toggleFilterSection('escales')"
                class="flex items-center justify-between w-full text-left mb-4">
                <h3 class="text-lg font-semibold text-gray-900">Escales</h3>
                <svg 
                  class="w-4 h-4 transform transition-transform duration-200"
                  [class.rotate-180]="!showFilterSections().escales"
                  fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
                </svg>
              </button>

              <div *ngIf="showFilterSections().escales" class="space-y-3">
                <label class="flex items-center">
                  <input 
                    type="checkbox" 
                    [checked]="filters().direct"
                    (change)="onDirectChange($event)"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3">
                  <span class="text-sm">
                    <div class="font-medium text-gray-900">Direct</div>
                    <div class="text-gray-500">à partir de 79€</div>
                  </span>
                </label>

                <label class="flex items-center">
                  <input 
                    type="checkbox" 
                    [checked]="filters().oneStop"
                    (change)="onOneStopChange($event)"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3">
                  <span class="text-sm">
                    <div class="font-medium text-gray-900">1 escale</div>
                    <div class="text-gray-500">à partir de 104€</div>
                  </span>
                </label>

                <label class="flex items-center">
                  <input 
                    type="checkbox" 
                    [checked]="filters().multipleStops"
                    (change)="onMultipleStopsChange($event)"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3">
                  <span class="text-sm">
                    <div class="font-medium text-gray-900">2+ escales</div>
                    <div class="text-gray-500">à partir de 373€</div>
                  </span>
                </label>
              </div>
            </div>

            <!-- Departure Time Filter -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
              <button 
                (click)="toggleFilterSection('heuresDepart')"
                class="flex items-center justify-between w-full text-left mb-4">
                <h3 class="text-lg font-semibold text-gray-900">Heures de départ</h3>
                <svg 
                  class="w-4 h-4 transform transition-transform duration-200"
                  [class.rotate-180]="!showFilterSections().heuresDepart"
                  fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
                </svg>
              </button>

              <div *ngIf="showFilterSections().heuresDepart" class="px-2">
                <div class="flex justify-between text-sm text-gray-500 mb-2">
                  <span>Aller</span>
                </div>
                <div class="flex justify-between text-sm text-gray-900 mb-4">
                  <span>{{ formatTime(departureTime().min) }}</span>
                  <span>{{ formatTime(departureTime().max) }}</span>
                </div>
                
                <div class="relative">
                  <input 
                    type="range" 
                    [min]="0" 
                    [max]="1439"
                    [value]="departureTime().min"
                    (input)="onDepartureMinChange($event)"
                    class="absolute w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer slider">
                  <input 
                    type="range" 
                    [min]="0" 
                    [max]="1439"
                    [value]="departureTime().max"
                    (input)="onDepartureMaxChange($event)"
                    class="absolute w-full h-2 bg-transparent appearance-none cursor-pointer slider">
                </div>
              </div>
            </div>

            <!-- Journey Duration Filter -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <button 
                (click)="toggleFilterSection('dureeVoyage')"
                class="flex items-center justify-between w-full text-left mb-4">
                <h3 class="text-lg font-semibold text-gray-900">Durée du voyage</h3>
                <svg 
                  class="w-4 h-4 transform transition-transform duration-200"
                  [class.rotate-180]="!showFilterSections().dureeVoyage"
                  fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
                </svg>
              </button>

              <div *ngIf="showFilterSections().dureeVoyage" class="px-2">
                <div class="flex justify-between text-sm text-gray-900 mb-4">
                  <span>{{ formatDuration(journeyDuration().min) }}</span>
                  <span>{{ formatDuration(journeyDuration().max) }}</span>
                </div>
                
                <div class="relative">
                  <input 
                    type="range" 
                    [min]="180" 
                    [max]="2640"
                    [value]="journeyDuration().min"
                    (input)="onJourneyMinChange($event)"
                    class="absolute w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer slider">
                  <input 
                    type="range" 
                    [min]="180" 
                    [max]="2640"
                    [value]="journeyDuration().max"
                    (input)="onJourneyMaxChange($event)"
                    class="absolute w-full h-2 bg-transparent appearance-none cursor-pointer slider">
                </div>
              </div>
            </div>
          </div>

          <!-- Main Content -->
          <div class="lg:col-span-3">
            <!-- Sort Options -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-6">
                  <div class="text-center">
                    <div class="bg-blue-900 text-white px-4 py-2 rounded text-sm font-medium">Le meilleur</div>
                    <div class="text-lg font-bold">79 €</div>
                    <div class="text-xs text-gray-500">2 h 55</div>
                  </div>
                  <div class="text-center">
                    <div class="text-sm font-medium text-gray-600 px-4 py-2">Le moins cher</div>
                    <div class="text-lg font-bold">79 €</div>
                    <div class="text-xs text-gray-500">2 h 55</div>
                  </div>
                  <div class="text-center">
                    <div class="text-sm font-medium text-gray-600 px-4 py-2">Le plus rapide</div>
                    <div class="text-lg font-bold">96 €</div>
                    <div class="text-xs text-gray-500">2 h 50</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Flight Cards -->
            <div class="space-y-4" *ngIf="filteredFlights().length > 0">
              <div *ngFor="let flight of filteredFlights()" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div class="flex items-center justify-between">
                  <!-- Flight Details -->
                  <div class="flex-1">
                    <div class="flex items-center justify-between mb-4">
                      <div class="text-sm text-gray-600 font-medium">{{ flight.compagnie }}</div>
                      <div class="flex items-center space-x-2">
                        <div class="text-sm text-gray-500">{{ flight.offres }} offres dès</div>
                        <button class="text-gray-400 hover:text-red-500">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div class="flex items-center space-x-8">
                      <!-- Departure -->
                      <div class="text-center">
                        <div class="text-xl font-bold text-gray-900">{{ flight.heure_depart }}</div>
                        <div class="text-sm text-gray-600 font-medium">{{ getAirportCode(flight.ville_depart) }}</div>
                      </div>

                      <!-- Flight Duration and Route -->
                      <div class="flex-1 flex flex-col items-center">
                        <div class="text-xs text-gray-500 mb-1">{{ formatFlightDuration(flight.temps_trajet) }}</div>
                        <div class="w-full flex items-center justify-center relative">
                          <div class="h-px bg-gray-300 flex-1"></div>
                          <svg class="w-4 h-4 text-blue-500 mx-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                          </svg>
                          <div class="h-px bg-gray-300 flex-1"></div>
                        </div>
                        <div class="text-xs text-green-600 mt-1 font-medium">{{ flight.direct ? 'Direct' : flight.escales + ' escale' + (flight.escales > 1 ? 's' : '') }}</div>
                      </div>

                      <!-- Arrival -->
                      <div class="text-center">
                        <div class="text-xl font-bold text-gray-900">{{ flight.heure_arrivee }}</div>
                        <div class="text-sm text-gray-600 font-medium">{{ getAirportCode(flight.ville_arrivee) }}</div>
                      </div>
                    </div>

                    <!-- Additional Info -->
                    <div class="mt-4 flex items-center text-xs text-gray-500">
                      <svg class="w-4 h-4 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z"/>
                        <path d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"/>
                      </svg>
                      <span>{{ flight.bagages ? 'Bagages inclus' : 'Aucun bagage en soute inclus' }}</span>
                    </div>
                  </div>

                  <!-- Price and Action -->
                  <div class="ml-8 text-right">
                    <div class="text-2xl font-bold text-gray-900 mb-1">{{ flight.prix }} €</div>
                    <div class="text-xs text-gray-500 mb-4">
                      Non-remboursable<br>
                      Échangeable moyennant des frais
                    </div>
                    <button class="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                      Voir →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- No Results -->
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

      <!-- Right Sidebar - Hotel Ads -->
      <div class="fixed right-4 top-1/2 transform -translate-y-1/2 w-80 space-y-4 hidden xl:block">
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-2">Vous avez trouvé votre vol ?</h3>
          <h4 class="text-lg font-bold text-gray-900 mb-4">Trouvez maintenant votre hôtel</h4>
          <p class="text-sm text-gray-600 mb-4">Accédez aux résultats des meilleurs sites d'hôtels ici, sur Skyscanner.</p>
          <button class="w-full bg-blue-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-800 transition-colors">
            Découvrir les hôtels
          </button>
          <div class="mt-4 text-xs text-gray-500">
            ven. 7 mars-sam. 8 mars
          </div>
        </div>

        <div class="bg-blue-600 rounded-lg shadow-lg p-6 text-white">
          <h3 class="text-lg font-bold mb-2">Location de voiture à Djerba</h3>
          <p class="text-sm mb-4">Ne vous arrêtez pas aux vols, trouvez également de bonnes affaires sur les véhicules.</p>
          <div class="flex items-center justify-between">
            <div>
              <div class="text-lg font-bold">Location de voiture dès</div>
              <div class="text-2xl font-bold">24 € par jour</div>
            </div>
            <button class="bg-white text-blue-600 p-3 rounded-full hover:bg-gray-100 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Calendar Modal -->
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
    ville_depart: '',
    ville_arrivee: '',
    date_depart: '',
    date_retour: '',
    travellers: { adults: 1, cabinClass: 'Economy' }
  });
  showCalendar = signal(false);
  calendarType = signal<'depart' | 'return' | null>(null);
  isLoading = signal(false);
  searchResults = signal<FlightSearchResponse | null>(null);
  errorMessage = signal<string | null>(null);
  hasSearched = signal(false);
  filters = signal<FilterOptions>({
    escales: ['direct', '1', '2+'],
    heuresDepart: { min: 0, max: 1439 },
    dureeVoyage: { min: 180, max: 2640 }
  });
  showFilterSections = signal({
    escales: true,
    heuresDepart: true,
    dureeVoyage: true
  });
  departureTime = signal({
    min: 0,
    max: 1439
  });
  journeyDuration = signal({
    min: 180,
    max: 2640
  });
  priceDates = signal([
    { day: '4 mars', price: 94, date: '2025-03-04', isSelected: false },
    { day: '5 mars', price: 94, date: '2025-03-05', isSelected: false },
    { day: '6 mars', price: 94, date: '2025-03-06', isSelected: false },
    { day: '7 mars', price: 79, date: '2025-03-07', isSelected: true },
    { day: '8 mars', price: 106, date: '2025-03-08', isSelected: false },
    { day: '9 mars', price: 85, date: '2025-03-09', isSelected: false },
    { day: '10 mars', price: 82, date: '2025-03-10', isSelected: false }
  ]);

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
        this.hasSearched.set(true);
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

  getSearchSummary(): string {
    const params = this.searchParams();
    return `${params.ville_depart} - ${params.ville_arrivee} • ${params.travellers.adults} adulte, ${params.travellers.cabinClass}`;
  }

  goBack(): void {
    this.hasSearched.set(false);
    this.searchResults.set(null);
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  toggleFilterSection(section: string) {
    const current = this.showFilterSections();
    this.showFilterSections.set({
      ...current,
      [section]: !current[section as keyof typeof current]
    });
  }

  onDirectChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.filters.update(current => ({ ...current, direct: target.checked }));
  }

  onOneStopChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.filters.update(current => ({ ...current, oneStop: target.checked }));
  }

  onMultipleStopsChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.filters.update(current => ({ ...current, multipleStops: target.checked }));
  }

  onDepartureMinChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.departureTime.update(current => ({ ...current, min: parseInt(target.value) }));
  }

  onDepartureMaxChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.departureTime.update(current => ({ ...current, max: parseInt(target.value) }));
  }

  onJourneyMinChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.journeyDuration.update(current => ({ ...current, min: parseInt(target.value) }));
  }

  onJourneyMaxChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.journeyDuration.update(current => ({ ...current, max: parseInt(target.value) }));
  }

  formatTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  formatDuration(minutes: number): string {
    const hours = minutes / 60;
    return `${hours.toFixed(1)} heures`;
  }

  formatFlightDuration(duration: string): string {
    const matches = duration.match(/(\d+)h\s*(\d+)?min/);
    if (!matches) return duration;
    
    const hours = parseInt(matches[1]) || 0;
    const minutes = parseInt(matches[2]) || 0;
    
    return `${hours} h ${minutes.toString().padStart(2, '0')}`;
  }

  getAirportCode(city: string): string {
    const codes: { [key: string]: string } = {
      'Paris': 'ORY',
      'Lyon': 'LYS',
      'Marseille': 'MRS',
      'Nice': 'NCE',
      'Toulouse': 'TLS',
      'Djerba': 'DJE'
    };
    return codes[city] || city.substring(0, 3).toUpperCase();
  }

  getPriceDateClasses(priceDate: any): string {
    let classes = 'cursor-pointer';
    
    if (priceDate.isSelected) {
      classes += ' bg-blue-900 text-white';
    } else {
      classes += ' text-gray-700 bg-gray-100 hover:bg-gray-200';
    }

    return classes;
  }

  selectPriceDate(priceDate: any) {
    const updated = this.priceDates().map(pd => ({
      ...pd,
      isSelected: pd.date === priceDate.date
    }));
    
    this.priceDates.set(updated);
    this.searchParams.update(params => ({ ...params, date_depart: priceDate.date }));
  }
}