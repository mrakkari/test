import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of, map } from 'rxjs';

export interface Flight {
  id: number;
  ville_depart: string;
  ville_arrivee: string;
  date_depart: string;
  date_arrivee: string;
  prix: number;
  temps_trajet: string;
  places_disponibles?: number;
  compagnie: string;
  heure_depart: string;
  heure_arrivee: string;
  offres: string;
  escales: number;
  bagages: boolean;
  direct: boolean;
}

export interface FlightSearchParams {
  date_depart?: string;
  ville_depart?: string;
  ville_arrivee?: string;
  tri?: 'prix' | 'temps_trajet';
}

export interface FlightSearchResponse {
  flights: Flight[];
  total: number;
}

export interface PriceDateRange {
  date: string;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private readonly baseUrl = '/api';

  constructor(private http: HttpClient) {}

  searchFlights(params: FlightSearchParams): Observable<FlightSearchResponse> {
    let httpParams = new HttpParams();
    
    if (params.date_depart) {
      httpParams = httpParams.set('date_depart', params.date_depart);
    }
    if (params.ville_depart) {
      httpParams = httpParams.set('ville_depart', params.ville_depart);
    }
    if (params.ville_arrivee) {
      httpParams = httpParams.set('ville_arrivee', params.ville_arrivee);
    }
    if (params.tri) {
      httpParams = httpParams.set('tri', params.tri);
    }

    return this.http.get<Flight[]>(`${this.baseUrl}/vols`, { params: httpParams })
      .pipe(
        map(flights => ({
          flights: this.enrichFlightData(flights),
          total: flights.length
        })),
        catchError(error => {
          console.error('Error fetching flights:', error);
          return of(this.getMockFlights(params));
        })
      );
  }

  private enrichFlightData(flights: Flight[]): Flight[] {
    return flights.map(flight => ({
      ...flight,
      compagnie: ['Air France', 'Ryanair', 'EasyJet'][Math.floor(Math.random() * 3)],
      heure_depart: this.formatFlightTime(flight.date_depart),
      heure_arrivee: this.formatFlightTime(flight.date_arrivee),
      offres: 'Multiple',
      escales: Math.floor(Math.random() * 3), // 0, 1, or 2
      bagages: Math.random() > 0.5,
      direct: Math.random() > 0.3 // 70% chance of being direct
    }));
  }

  private getMockFlights(params: FlightSearchParams): FlightSearchResponse {
    const mockFlights: Flight[] = [
      {
        id: 1,
        ville_depart: 'Paris',
        ville_arrivee: 'Lyon',
        date_depart: '2025-01-30T08:00:00',
        date_arrivee: '2025-01-30T09:30:00',
        prix: 120,
        temps_trajet: '1h 30min',
        places_disponibles: 45,
        compagnie: 'Air France',
        heure_depart: '08:00',
        heure_arrivee: '09:30',
        offres: 'Multiple',
        escales: 0,
        bagages: true,
        direct: true
      },
      {
        id: 2,
        ville_depart: 'Paris',
        ville_arrivee: 'Lyon',
        date_depart: '2025-01-30T14:15:00',
        date_arrivee: '2025-01-30T15:45:00',
        prix: 95,
        temps_trajet: '1h 30min',
        places_disponibles: 23,
        compagnie: 'Ryanair',
        heure_depart: '14:15',
        heure_arrivee: '15:45',
        offres: 'Multiple',
        escales: 1,
        bagages: false,
        direct: false
      },
      {
        id: 3,
        ville_depart: 'Lyon',
        ville_arrivee: 'Marseille',
        date_depart: '2025-01-31T10:30:00',
        date_arrivee: '2025-01-31T11:45:00',
        prix: 85,
        temps_trajet: '1h 15min',
        places_disponibles: 67,
        compagnie: 'EasyJet',
        heure_depart: '10:30',
        heure_arrivee: '11:45',
        offres: 'Multiple',
        escales: 0,
        bagages: true,
        direct: true
      },
      {
        id: 4,
        ville_depart: 'Paris',
        ville_arrivee: 'Nice',
        date_depart: '2025-02-01T06:45:00',
        date_arrivee: '2025-02-01T09:00:00',
        prix: 180,
        temps_trajet: '2h 15min',
        places_disponibles: 12,
        compagnie: 'Air France',
        heure_depart: '06:45',
        heure_arrivee: '09:00',
        offres: 'Multiple',
        escales: 2,
        bagages: false,
        direct: false
      },
      {
        id: 5,
        ville_depart: 'Toulouse',
        ville_arrivee: 'Paris',
        date_depart: '2025-02-02T16:20:00',
        date_arrivee: '2025-02-02T17:35:00',
        prix: 145,
        temps_trajet: '1h 15min',
        places_disponibles: 34,
        compagnie: 'Ryanair',
        heure_depart: '16:20',
        heure_arrivee: '17:35',
        offres: 'Multiple',
        escales: 0,
        bagages: true,
        direct: true
      }
    ];

    let filtered = mockFlights;
    
    if (params.ville_depart) {
      filtered = filtered.filter(f => 
        f.ville_depart.toLowerCase().includes(params.ville_depart!.toLowerCase())
      );
    }
    
    if (params.ville_arrivee) {
      filtered = filtered.filter(f => 
        f.ville_arrivee.toLowerCase().includes(params.ville_arrivee!.toLowerCase())
      );
    }

    if (params.tri === 'prix') {
      filtered.sort((a, b) => a.prix - b.prix);
    } else if (params.tri === 'temps_trajet') {
      filtered.sort((a, b) => {
        const timeA = this.parseTimeToMinutes(a.temps_trajet);
        const timeB = this.parseTimeToMinutes(b.temps_trajet);
        return timeA - timeB;
      });
    }

    return {
      flights: filtered,
      total: filtered.length
    };
  }

  getFlightsByDateRange(): Observable<PriceDateRange[]> {
    const mockPrices: PriceDateRange[] = [
      { date: '2025-09-14', price: 95 },
      { date: '2025-09-15', price: 89 },
      { date: '2025-09-16', price: 102 },
      { date: '2025-09-17', price: 88 },
      { date: '2025-09-18', price: 97 },
    ];
    return of(mockPrices);
  }

  private parseTimeToMinutes(timeStr: string): number {
    const matches = timeStr.match(/(\d+)h\s*(\d+)?min/);
    if (!matches) return 0;
    const hours = parseInt(matches[1]) || 0;
    const minutes = parseInt(matches[2]) || 0;
    return hours * 60 + minutes;
  }

  formatFlightTime(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  }

  formatFlightDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  }
}