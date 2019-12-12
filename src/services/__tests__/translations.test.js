import { PLANT_TYPES, TRANSACTION_STATUSES } from '../../constants';
import { convertPlantType, convertTransactionStatus } from '../translations/enums';

describe('Convert enum plant type into locale label', () => {
    it('should return correct locale label for biomass', () => {
        const biomass = convertPlantType(PLANT_TYPES.biomass);
        expect(biomass).toEqual({
            defaultMessage: 'Biomass',
            id: 'app.plantType.biomass'
        });
    });

    it('should return correct locale label for solar', () => {
        const solar = convertPlantType(PLANT_TYPES.solar);
        expect(solar).toEqual({
            defaultMessage: 'Solar',
            id: 'app.plantType.solar'
        });
    });

    it('should return correct locale label for wind', () => {
        const wind = convertPlantType(PLANT_TYPES.wind);
        expect(wind).toEqual({
            defaultMessage: 'Wind',
            id: 'app.plantType.wind'
        });
    });

    it('should return correct locale label for other types', () => {
        const other = convertPlantType(PLANT_TYPES.other);
        expect(other).toEqual({
            defaultMessage: 'Other',
            id: 'app.plantType.other'
        });
    });
});

describe('Convert enum transaction status into locale label', () => {
    it('should return correct locale label for success status', () => {
        const status = convertTransactionStatus(TRANSACTION_STATUSES.success);
        expect(status).toEqual({
            defaultMessage: 'Success',
            id: 'app.txStatuses.success'
        });
    });

    it('should return correct locale label for fail status', () => {
        const status = convertTransactionStatus(TRANSACTION_STATUSES.fail);
        expect(status).toEqual({
            defaultMessage: 'Failure',
            id: 'app.txStatuses.fail'
        });
    });

    it('should return correct locale label for wait for offer status', () => {
        const status = convertTransactionStatus(TRANSACTION_STATUSES.waitingForOffer);
        expect(status).toEqual({
            defaultMessage: 'Waiting For Offer',
            id: 'app.txStatuses.waitingForOffer'
        });
    });

    it('should return correct locale label for pending status', () => {
        const status = convertTransactionStatus(TRANSACTION_STATUSES.pending);
        expect(status).toEqual({
            defaultMessage: 'Pending',
            id: 'app.txStatuses.pending'
        });
    });

    it('should return correct locale label for other statuses', () => {
        const status = convertTransactionStatus(TRANSACTION_STATUSES.unknown);
        expect(status).toEqual({
            defaultMessage: 'Unknown',
            id: 'app.txStatuses.unknown'
        });
    });
});
