import { Route } from 'react-router-dom';
import { extendRoute } from '../routes';

extendRoute(Route);

describe('Url parameters Service', () => {
    const context = Reflect.apply(
        Route.prototype.getChildContext,
        {
            context: {
                router: {
                    route: { location: { search: '?username=demo@example.com&otherParam=test&anotherParam=&rest' } }
                }
            },
            props: {},
            state: {}
        },
        []
    );

    it('should return correct query param value date', () => {
        expect(context.router.getQueryParam('username')).toBe('demo@example.com');
        expect(context.router.getQueryParam('someOther')).toBe('');
        expect(context.router.getQueryParam('otherParam')).toBe('test');
        expect(context.router.getQueryParam('anotherParam')).toBe('');
        expect(context.router.getQueryParam('rest')).toBe('');
        expect(context.router.getQueryParam(null)).toBe('');
        expect(context.router.getQueryParam()).toBe('');
    });
});
