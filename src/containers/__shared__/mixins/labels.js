const labelsMixin = Base =>
    class extends Base {
        constructor(...args) {
            super(...args);

            this.context = { intl: {} };
        }

        prepareLabels(messages, values) {
            const { formatMessage } = this.context.intl;
            const entries = Object.keys(messages).map(key => [key, messages[key]]);

            return entries.reduce((labels, [labelName, messageDescriptor]) => {
                return {
                    ...labels,
                    [labelName]: formatMessage(messageDescriptor, values)
                };
            }, {});
        }
    };

export default labelsMixin;
