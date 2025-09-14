import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Flight } from '../../services/flight.service';

@Component({
  selector: 'app-flight-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flight-card bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
              <div class="text-sm text-gray-600 font-medium">{{ flight.ville_depart }}</div>
            </div>

            <!-- Flight Duration and Route -->
            <div class="flex-1 flex flex-col items-center">
              <div class="text-xs text-gray-500 mb-1">{{ formatDuration(flight.temps_trajet) }}</div>
              <div class="w-full flex items-center justify-center relative">
                <div class="h-px bg-gray-300 flex-1"></div>
                <svg class="w-4 h-4 text-blue-500 mx-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                </svg>
                <div class="h-px bg-gray-300 flex-1"></div>
              </div>
              <div class="text-xs text-blue-600 mt-1 font-medium">{{ flight.direct ? 'Direct' : flight.escales + ' escale' + (flight.escales > 1 ? 's' : '') }}</div>
            </div>

            <!-- Arrival -->
            <div class="text-center">
              <div class="text-xl font-bold text-gray-900">{{ flight.heure_arrivee }}</div>
              <div class="text-sm text-gray-600 font-medium">{{ flight.ville_arrivee }}</div>
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
          <button class="bg-slate-800 hover:bg-slate-900 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Voir →
          </button>
        </div>
      </div>
    </div>
  `
})
export class FlightCardComponent {
  @Input() flight!: Flight;

  formatDuration(duration: string): string {
    // Convert "1h 30min" to "2 h 55" format
    const matches = duration.match(/(\d+)h\s*(\d+)?min/);
    if (!matches) return duration;
    
    const hours = parseInt(matches[1]) || 0;
    const minutes = parseInt(matches[2]) || 0;
    
    return `${hours} h ${minutes.toString().padStart(2, '0')}`;
  }
}