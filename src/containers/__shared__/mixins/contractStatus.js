import { CONTRACT_STATUSES, CONTRACT_STATUS_KEYS_FOR_SAVE_METERING } from '../../../constants';

const contractStatusMixin = Base =>
    class extends Base {
        validateContractStatus(statusCode) {
            return statusCode === CONTRACT_STATUSES.active || statusCode === CONTRACT_STATUSES.terminated;
        }
        validateContractStatusKeyForSaveMeterReadings(statusKey) {
            return CONTRACT_STATUS_KEYS_FOR_SAVE_METERING.indexOf(statusKey) !== -1;
        }
    };

export default contractStatusMixin;
