import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Flight } from '../../services/flight.service';

@Component({
  selector: 'app-flight-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flight-card bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4">
      <div class="flex items-center justify-between">
        <!-- Flight Details -->
        <div class="flex-1">
          <div class="flex items-center justify-between mb-4">
            <div class="text-sm text-gray-600">{{ flight.compagnie }}</div>
            <div class="flex items-center space-x-2">
              <div class="text-sm text-blue-600 font-medium">{{ flight.offres }} offres dès</div>
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
              <div class="text-xs text-gray-500 mb-1">{{ flight.temps_trajet }}</div>
              <div class="w-full flex items-center justify-center relative">
                <div class="h-px bg-gray-300 flex-1"></div>
                <svg class="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12L8 10l2-2 2 2-2 2z"/>
                </svg>
                <div class="h-px bg-gray-300 flex-1"></div>
              </div>
              <div class="text-xs text-blue-600 mt-1">{{ flight.direct ? 'Direct' : flight.escales + ' escale(s)' }}</div>
            </div>

            <!-- Arrival -->
            <div class="text-center">
              <div class="text-xl font-bold text-gray-900">{{ flight.heure_arrivee }}</div>
              <div class="text-sm text-gray-600 font-medium">{{ flight.ville_arrivee }}</div>
            </div>
          </div>

          <!-- Additional Info -->
          <div class="mt-4 flex items-center text-xs text-gray-500">
            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>{{ flight.bagages ? 'Bagages inclus' : 'Aucun bagage en soute inclus' }}</span>
          </div>
        </div>

        <!-- Price and Action -->
        <div class="ml-8 text-right">
          <div class="text-2xl font-bold text-gray-900 mb-1">{{ flight.prix }}€</div>
          <div class="text-xs text-gray-500 mb-4">
            Non-remboursable<br>
            Échangeable moyennant des frais
          </div>
          <button class="btn-primary px-6 py-2 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            Voir →
          </button>
        </div>
      </div>
    </div>
  `
})
export class FlightCardComponent {
  @Input() flight!: Flight;
}