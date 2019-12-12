import * as persistenceStore from '../../services/browserStorage';
import { usersReducer, initialState } from '../users';

const { ACTIONS } = fixtures();

describe('Users reducer:', () => {
    beforeEach(() => {
        persistenceStore.setToken = jest.fn();
        persistenceStore.clearToken = jest.fn();
    });

    describe('Pending cases:', () => {
        it('should handle REGISTRATION', () => {
            const result = usersReducer(initialState, ACTIONS.registration.pending);
            expect(result.registration.loading).toEqual(true);
            expect(result.registration.error).toEqual(null);
            expect(result.registration.data).toEqual({});
        });

        it('should handle LOGIN', () => {
            const result = usersReducer(initialState, ACTIONS.login.pending);
            expect(result.login.loading).toEqual(true);
            expect(result.login.error).toEqual(null);
            expect(result.login.data).toEqual({});
            expect(persistenceStore.setToken.mock.calls.length).toEqual(0);
        });

        it('should handle LOGOUT', () => {
            const result = usersReducer(initialState, ACTIONS.logout.pending);
            expect(result.logout.loading).toEqual(true);
            expect(result.logout.error).toEqual(null);
            expect(result.logout.data).toEqual({});
            expect(persistenceStore.clearToken.mock.calls.length).toEqual(0);
        });

        it('should handle GET_USER_DATA', () => {
            const result = usersReducer(initialState, ACTIONS.getUserData.pending);
            expect(result.profile.loading).toEqual(true);
            expect(result.profile.error).toEqual(null);
            expect(result.profile.data).toEqual({ user: { contract: {} } });
        });

        it('should handle UPDATE_USER_DATA', () => {
            const result = usersReducer(initialState, ACTIONS.updateUserData.pending);
            expect(result.updatedProfile.loading).toEqual(true);
            expect(result.updatedProfile.error).toEqual(null);
            expect(result.updatedProfile.data).toEqual({ user: {} });
        });

        it('should handle RESET_USER_PASSWORD', () => {
            const result = usersReducer(initialState, ACTIONS.resetPassword.pending);
            expect(result.resetPassword.loading).toEqual(true);
            expect(result.resetPassword.error).toEqual(null);
            expect(result.resetPassword.data).toEqual({});
        });

        it('should handle CREATE_RESET_PASSWORD_TOKEN', () => {
            const result = usersReducer(initialState, ACTIONS.createResetPasswordToken.pending);
            expect(result.createdPasswordToken.loading).toEqual(true);
            expect(result.createdPasswordToken.error).toEqual(null);
            expect(result.createdPasswordToken.data).toEqual({});
        });

        it('should handle VERIFY_RESET_PASSWORD_TOKEN', () => {
            const result = usersReducer(initialState, ACTIONS.verifyResetPasswordToken.pending);
            expect(result.verifiedPasswordToken.loading).toEqual(true);
            expect(result.verifiedPasswordToken.error).toEqual(null);
            expect(result.verifiedPasswordToken.data).toEqual({});
        });
    });

    describe('Error cases:', () => {
        it('should handle REGISTRATION', () => {
            const result = usersReducer(initialState, ACTIONS.registration.fail);
            expect(result.registration.loading).toBeFalsy();
            expect(result.registration.error).toEqual(ACTIONS.registration.fail.error);
            expect(result.registration.data).toEqual({});
        });

        it('should handle LOGIN', () => {
            const result = usersReducer(initialState, ACTIONS.login.fail);
            expect(result.login.loading).toEqual(false);
            expect(result.login.error).toEqual(ACTIONS.login.fail.error);
            expect(result.login.data).toEqual({});
            expect(persistenceStore.setToken.mock.calls.length).toEqual(0);
        });

        it('should handle LOGOUT', () => {
            const result = usersReducer(initialState, ACTIONS.logout.fail);
            expect(result.logout.loading).toEqual(false);
            expect(result.logout.error).toEqual('Error Message');
            expect(result.logout.data).toEqual({});
            expect(persistenceStore.clearToken.mock.calls.length).toEqual(1);
        });

        it('should handle GET_USER_DATA', () => {
            const result = usersReducer(initialState, ACTIONS.getUserData.fail);
            expect(result.profile.loading).toEqual(false);
            expect(result.profile.error).toEqual('Error Message');
            expect(result.profile.data).toEqual({ user: { contract: {} } });
        });

        it('should handle UPDATE_USER_DATA', () => {
            const result = usersReducer(initialState, ACTIONS.updateUserData.fail);
            expect(result.updatedProfile.loading).toEqual(false);
            expect(result.updatedProfile.error).toEqual('Error Message');
            expect(result.updatedProfile.data).toEqual({ user: {} });
        });

        it('should handle RESET_USER_PASSWORD', () => {
            const result = usersReducer(initialState, ACTIONS.resetPassword.fail);
            expect(result.resetPassword.loading).toEqual(false);
            expect(result.resetPassword.error).toEqual('Error Message');
            expect(result.resetPassword.data).toEqual({});
        });

        it('should handle CREATE_RESET_PASSWORD_TOKEN', () => {
            const result = usersReducer(initialState, ACTIONS.createResetPasswordToken.fail);
            expect(result.createdPasswordToken.loading).toEqual(false);
            expect(result.createdPasswordToken.error).toEqual('Error Message');
            expect(result.createdPasswordToken.data).toEqual({});
        });

        it('should handle VERIFY_RESET_PASSWORD_TOKEN', () => {
            const result = usersReducer(initialState, ACTIONS.verifyResetPasswordToken.fail);
            expect(result.verifiedPasswordToken.loading).toEqual(false);
            expect(result.verifiedPasswordToken.error).toEqual('Error Message');
            expect(result.verifiedPasswordToken.data).toEqual({});
        });
    });

    describe('Success cases:', () => {
        it('should handle REGISTRATION', () => {
            const result = usersReducer(initialState, ACTIONS.registration.success);
            expect(result.registration.loading).toBeFalsy();
            expect(result.registration.error).toEqual(null);
            expect(result.registration.data).toEqual(ACTIONS.registration.success.payload.user);
        });

        it('should handle LOGIN', () => {
            const result = usersReducer(initialState, ACTIONS.login.success);
            expect(result.login.loading).toEqual(false);
            expect(result.login.error).toEqual(null);
            expect(result.login.data).toEqual(ACTIONS.login.success.payload);
            expect(persistenceStore.setToken.mock.calls.length).toEqual(1);
            const [[token]] = persistenceStore.setToken.mock.calls;
            expect(token).toEqual(ACTIONS.login.success.payload.authentication.authenticationToken);
        });

        it('should handle LOGOUT', () => {
            const result = usersReducer(initialState, ACTIONS.logout.success);
            expect(result.logout.loading).toEqual(false);
            expect(result.logout.error).toEqual(null);
            expect(result.logout.data).toEqual(ACTIONS.logout.success.payload);
            expect(persistenceStore.clearToken.mock.calls.length).toEqual(1);
        });

        it('should handle GET_USER_DATA', () => {
            const result = usersReducer(initialState, ACTIONS.getUserData.success);
            expect(result.profile.loading).toEqual(false);
            expect(result.profile.error).toEqual(null);
            expect(result.profile.data).toEqual(ACTIONS.getUserData.success.payload);
        });

        it('should handle UPDATE_USER_DATA', () => {
            const result = usersReducer(initialState, ACTIONS.updateUserData.success);
            expect(result.updatedProfile.loading).toEqual(false);
            expect(result.updatedProfile.error).toEqual(null);
            expect(result.updatedProfile.data).toEqual({ user: ACTIONS.updateUserData.success.payload });
        });

        it('should handle RESET_USER_PASSWORD', () => {
            const result = usersReducer(initialState, ACTIONS.resetPassword.success);
            expect(result.resetPassword.loading).toEqual(false);
            expect(result.resetPassword.error).toEqual(null);
            expect(result.resetPassword.data).toEqual({ ...ACTIONS.resetPassword.success.payload });
        });

        it('should handle CREATE_RESET_PASSWORD_TOKEN', () => {
            const result = usersReducer(initialState, ACTIONS.createResetPasswordToken.success);
            expect(result.createdPasswordToken.loading).toEqual(false);
            expect(result.createdPasswordToken.error).toEqual(null);
            expect(result.createdPasswordToken.data).toEqual({ ...ACTIONS.createResetPasswordToken.success.payload });
        });

        it('should handle VERIFY_RESET_PASSWORD_TOKEN', () => {
            const result = usersReducer(initialState, ACTIONS.verifyResetPasswordToken.success);
            expect(result.verifiedPasswordToken.loading).toEqual(false);
            expect(result.verifiedPasswordToken.error).toEqual(null);
            expect(result.verifiedPasswordToken.data).toEqual({ ...ACTIONS.verifyResetPasswordToken.success.payload });
        });
    });
});

function fixtures() {
    const ACTIONS = {
        registration: {
            success: {
                type: 'REGISTRATION',
                payload: {
                    user: {
                        BIC: 'BELADEBEXXX',
                        IBAN: null,
                        basePrice: 49.08,
                        birthday: '2018-08-29',
                        city: 'Berlin',
                        country: 'Germany',
                        currentProducerId: 1,
                        email: 'powerchain@example.com',
                        firstName: 'PowerChain',
                        id: 35,
                        lastBillAmount: '35,60',
                        lastBillAvailable: true,
                        lastBillDate: 'April',
                        lastName: 'Producer',
                        ledger: 'ethereumRopsten',
                        postcode: '10115',
                        street: 'Your-street',
                        streetNumber: '5',
                        workingPrice: 24.19
                    }
                },
                error: null,
                loading: false
            },
            fail: {
                type: 'REGISTRATION',
                payload: null,
                error: {
                    message: 'server error',
                    code: -1,
                    extra: null
                },
                loading: false
            },
            pending: {
                type: 'REGISTRATION',
                payload: null,
                error: null,
                loading: true
            }
        },
        login: {
            success: {
                type: 'LOGIN',
                payload: {
                    authentication: {
                        authenticationToken: 'DC124947VDE435FVA&23',
                        expiresAt: 999999
                    }
                },
                error: null,
                loading: false
            },
            fail: {
                type: 'LOGIN',
                payload: null,
                error: {
                    message: 'Error message',
                    code: -1,
                    extra: null
                },
                loading: false
            },
            pending: {
                type: 'LOGIN',
                payload: null,
                error: null,
                loading: true
            }
        },
        logout: {
            success: {
                type: 'LOGOUT',
                payload: { status: 'ok' },
                error: null,
                loading: false
            },
            fail: {
                type: 'LOGOUT',
                payload: null,
                error: 'Error Message',
                loading: false
            },
            pending: {
                type: 'LOGOUT',
                payload: null,
                error: null,
                loading: true
            }
        },
        getUserData: {
            success: {
                type: 'GET_USER_DATA',
                payload: {
                    user: {
                        id: 0,
                        firstName: 'string',
                        lastName: 'string',
                        email: 'string',
                        currentProducerId: '1234567',
                        currentProducerName: 'Peter Producer',
                        currentProducerPicture: '/plantImg/peter_producer.jpg',
                        lastBillAvailable: true,
                        lastBillAmount: '35.24',
                        lastBillDate: 'December;',
                        userStatus: 'string'
                    }
                },
                error: null,
                loading: false
            },
            fail: {
                type: 'GET_USER_DATA',
                payload: null,
                error: 'Error Message',
                loading: false
            },
            pending: {
                type: 'GET_USER_DATA',
                payload: null,
                error: null,
                loading: true
            }
        },
        updateUserData: {
            success: {
                type: 'UPDATE_USER_DATA',
                payload: {
                    id: 0,
                    firstName: 'string',
                    address: 'Huyssenallee 2, 45128 Essen',
                    dateOfBirth: 'Jan 11, 1987',
                    name: 'John Smith',
                    email: 'johnsmith@gmail.com',
                    bankAccountNumber: '11122333455556666666',
                    lastName: 'string',
                    currentProducerId: '1234567',
                    currentProducerName: 'Peter Producer',
                    currentProducerPicture: '/plantImg/peter_producer.jpg',
                    lastBillAvailable: true,
                    lastBillAmount: '35.24',
                    lastBillDate: 'December;',
                    userStatus: 'string'
                },
                error: null,
                loading: false
            },
            fail: {
                type: 'UPDATE_USER_DATA',
                payload: null,
                error: 'Error Message',
                loading: false
            },
            pending: {
                type: 'UPDATE_USER_DATA',
                payload: null,
                error: null,
                loading: true
            }
        },
        resetPassword: {
            success: {
                type: 'RESET_USER_PASSWORD',
                payload: {
                    updated: true
                },
                error: null,
                loading: false
            },
            fail: {
                type: 'RESET_USER_PASSWORD',
                payload: null,
                error: 'Error Message',
                loading: false
            },
            pending: {
                type: 'RESET_USER_PASSWORD',
                payload: null,
                error: null,
                loading: true
            }
        },
        createResetPasswordToken: {
            success: {
                type: 'CREATE_RESET_PASSWORD_TOKEN',
                payload: {
                    created: true
                },
                error: null,
                loading: false
            },
            fail: {
                type: 'CREATE_RESET_PASSWORD_TOKEN',
                payload: null,
                error: 'Error Message',
                loading: false
            },
            pending: {
                type: 'CREATE_RESET_PASSWORD_TOKEN',
                payload: null,
                error: null,
                loading: true
            }
        },
        verifyResetPasswordToken: {
            success: {
                type: 'VERIFY_RESET_PASSWORD_TOKEN',
                payload: {
                    valid: true
                },
                error: null,
                loading: false
            },
            fail: {
                type: 'VERIFY_RESET_PASSWORD_TOKEN',
                payload: null,
                error: 'Error Message',
                loading: false
            },
            pending: {
                type: 'VERIFY_RESET_PASSWORD_TOKEN',
                payload: null,
                error: null,
                loading: true
            }
        }
    };
    return { ACTIONS };
}
