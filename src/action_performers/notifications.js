import { dispatcher } from '../store';

export function performPushNotification(data) {
    return dispatcher.dispatchAction('PUSH_NOTIFICATION', { timestamp: Date.now(), ...data }, null, false, []);
}
