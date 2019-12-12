import Producer from './Producer';
import { Producer as messages } from '../../services/translations/messages';
import { convertPlantType } from '../../services/translations/enums';

function prepareProducerInfoProps(translate, producer, user = {}) {
    return {
        labels: {
            name: translate(messages.name),
            price: translate(messages.price),
            marketPrice: translate(messages.marketPrice),
            energyType: translate(messages.energyType),
            annualProduction: translate(messages.annualProduction),
            purchased: translate(messages.purchased),
            capacity: translate(messages.capacity),
            selectedSince: translate(messages.selectedSince),
            ethereumAddress: translate(messages.ethereumAddress),
            location: translate(messages.location)
        },
        details: {
            name: producer.name,
            marketPrice: user.workingPrice,
            price: producer.price,
            energyType: translate(convertPlantType(producer.plantType)),
            annualProduction: producer.annualProduction,
            purchased: producer.purchased,
            capacity: producer.capacity,
            selectedSince: producer.dates,
            ethereumAddress: producer.ethereumAddress,
            location: producer.location,
            status: producer.status
        },
        description: producer.description,
        picture: producer.picture
    };
}

export default Producer;
// Common
export { prepareProducerInfoProps };
