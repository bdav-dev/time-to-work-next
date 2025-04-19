import { MaterialSymbols } from "@/icons/MaterialSymbol";


export type PublicTransitTypeIdentifier = 'bus' | 'train' | 'subway' | 'tram';

export type PublicTransitType = {
    identifier: PublicTransitTypeIdentifier,
    displayAs: string,
    nextDepartureText: string,
    icon: MaterialSymbols
}

export class PublicTransitTypes {
    static readonly TRAIN: PublicTransitType = {
        identifier: 'train',
        displayAs: 'Zug',
        nextDepartureText: 'nächster Zug',
        icon: MaterialSymbols.TRAIN
    }
    static readonly BUS: PublicTransitType = {
        identifier: 'bus',
        displayAs: 'Bus',
        nextDepartureText: 'nächster Bus',
        icon: MaterialSymbols.DIRECTIONS_BUS
    }
    static readonly TRAM: PublicTransitType = {
        identifier: 'tram',
        displayAs: 'Straßenbahn',
        nextDepartureText: 'nächste Straßenbahn',
        icon: MaterialSymbols.TRAM
    }
    static readonly SUBWAY: PublicTransitType = {
        identifier: 'subway',
        displayAs: 'U-Bahn',
        nextDepartureText: 'nächste U-Bahn',
        icon: MaterialSymbols.SUBWAY
    }

    static values() {
        return [this.TRAIN, this.BUS, this.TRAM, this.SUBWAY];
    }

    static ofIdentifier(identifier: PublicTransitTypeIdentifier) {
        return this.values().find(publicTransitType => publicTransitType.identifier === identifier)!;
    }
}
