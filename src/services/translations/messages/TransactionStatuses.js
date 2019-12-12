import { defineMessages } from 'react-intl';

const messages = defineMessages({
    success: {
        id: 'app.txStatuses.success',
        defaultMessage: 'Success'
    },
    fail: {
        id: 'app.txStatuses.fail',
        defaultMessage: 'Failure'
    },
    pending: {
        id: 'app.txStatuses.pending',
        defaultMessage: 'Pending'
    },
    waitingForOffer: {
        id: 'app.txStatuses.waitingForOffer',
        defaultMessage: 'Waiting For Offer'
    },
    unknown: {
        id: 'app.txStatuses.unknown',
        defaultMessage: 'Unknown'
    }
});

export default messages;
