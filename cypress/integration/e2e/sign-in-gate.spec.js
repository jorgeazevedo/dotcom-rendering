/* eslint-disable no-undef */
/* eslint-disable func-names */

describe('Sign In Gate Tests', function () {
    const setArticleCount = (n) => {
        // set article count for today to be n
        localStorage.setItem(
            'gu.history.dailyArticleCount',
            JSON.stringify({
                value: [
                    {
                        day: Math.floor(Date.now() / 86400000),
                        count: n,
                    },
                ],
            }),
        );
    };

    const setMvtCookie = (str) => {
        cy.setCookie('GU_mvt_id_local', str, {
            log: true,
        });
    };

    // helper method over the cypress visit method to avoid having to repeat the same url by setting a default
    // can override the parameter if required
    const visitArticle = (
        url = 'https://www.theguardian.com/games/2018/aug/23/nier-automata-yoko-taro-interview',
    ) => {
        cy.visit(`Article?url=${url}`);
    };

    // as the sign in gate is lazy loaded, we need to scroll to the rough position where it
    // will be inserted to make it visible
    // can override position if required
    const scrollToGateForLazyLoading = (roughPosition = 1000) => {
        cy.scrollTo(0, roughPosition, { duration: 500 });
    };

    // we call visit and scroll for most test, so this wrapper combines the two
    // while preserving the ability to set the parameters if required
    const visitArticleAndScrollToGateForLazyLoad = ({
        url,
        roughPosition,
    } = {}) => {
        visitArticle(url);
        scrollToGateForLazyLoading(roughPosition);
    };

    const getCMPiFrame = () => {
        return cy
            .get('#sp_message_container_106842')
            .then(cy.wrap)
            .get('iframe')
            .its('2.contentDocument.body')
            .should('not.be.empty')
            .then(cy.wrap);
    };

    describe('SignInGateMain', function () {
        beforeEach(function () {
            // sign in gate main runs from 0-900000 MVT IDs, so 500 forces user into test
            setMvtCookie('500');

            // set article count to be min number to view gate
            setArticleCount(3);
        });

        it('should load the sign in gate', function () {
            visitArticleAndScrollToGateForLazyLoad();

            cy.get('[data-cy=sign-in-gate-main]').should('be.visible');
        });

        it('should not load the sign in gate if the user has not read at least 3 article in a day', function () {
            setArticleCount(1);

            visitArticleAndScrollToGateForLazyLoad();

            cy.get('[data-cy=sign-in-gate-main]').should('not.be.visible');
        });

        it('should not load the sign in gate if the user is signed in', function () {
            // use GU_U cookie to determine if user is signed in
            cy.setCookie(
                'GU_U',
                'MCwCFHbDHWevL_GqgH0CcbeDWp4N9kR5AhQ2lD3zMjjbKJAgC7FUDtc18Ac8BA',
                { log: true },
            );

            visitArticleAndScrollToGateForLazyLoad();

            // when using GU_U cookie, there is an issue with the commercial.dcr.js bundle
            // causing a URI Malformed error in cypress
            // we use this uncaught exception in this test to catch this and continue the rest of the test
            cy.on('uncaught:exception', () => {
                done();
                return false;
            });

            cy.get('[data-cy=sign-in-gate-main]').should('not.be.visible');
        });

        it('should not load the sign in gate if the user has already dismissed the gate', function () {
            localStorage.setItem(
                'gu.prefs.sign-in-gate',
                '{"SignInGateMain-main-variant-1":"2020-07-22T08:25:05.567Z"}',
            );

            visitArticleAndScrollToGateForLazyLoad();

            cy.get('[data-cy=sign-in-gate-main]').should('not.be.visible');
        });

        it('should not load the sign in gate if the article is not a valid section (membership)', function () {
            visitArticleAndScrollToGateForLazyLoad({
                url:
                    'https://www.theguardian.com/membership/2018/nov/15/support-guardian-readers-future-journalism',
            });

            cy.get('[data-cy=sign-in-gate-main]').should('not.be.visible');
        });

        it('should not load the sign in gate on a device with an ios9 user agent string', function () {
            // can't use visitArticleAndScrollToGateForLazyLoad for this method as overriding user agent
            cy.visit(
                'Article?url=https://www.theguardian.com/games/2018/aug/23/nier-automata-yoko-taro-interview',
                {
                    onBeforeLoad: (win) => {
                        Object.defineProperty(win.navigator, 'userAgent', {
                            value:
                                'Mozilla/5.0 (iPad; CPU OS 9_0 like Mac OS X) AppleWebKit/601.1.17 (KHTML, like Gecko) Version/8.0 Mobile/13A175 Safari/600.1.4',
                        });
                    },
                },
            );
            scrollToGateForLazyLoading();

            cy.get('[data-cy=sign-in-gate-main]').should('not.be.visible');
        });

        it('should remove gate when the dismiss button is clicked', function () {
            visitArticleAndScrollToGateForLazyLoad();

            cy.get('[data-cy=sign-in-gate-main]').should('be.visible');

            cy.get('[data-cy=sign-in-gate-main_dismiss]').click();

            cy.get('[data-cy=sign-in-gate-main]').should('not.be.visible');
        });

        it('register button should contain profile.theguardian.com href', function () {
            visitArticleAndScrollToGateForLazyLoad();

            cy.get('[data-cy=sign-in-gate-main]').should('be.visible');

            cy.get('[data-cy=sign-in-gate-main_register]')
                .invoke('attr', 'href')
                .should('contains', 'profile.theguardian.com');
        });

        it('sign in link should contain profile.theguardian.com href', function () {
            visitArticleAndScrollToGateForLazyLoad();

            cy.get('[data-cy=sign-in-gate-main]').should('be.visible');

            cy.get('[data-cy=sign-in-gate-main_signin]')
                .invoke('attr', 'href')
                .should('contains', 'profile.theguardian.com');
        });

        it('should show cmp ui when privacy settings link is clicked', function () {
            visitArticleAndScrollToGateForLazyLoad();

            cy.get('[data-cy=sign-in-gate-main]').should('be.visible');

            cy.get('[data-cy=sign-in-gate-main_privacy]').click();

            cy.contains('privacy settings');
        });
    });

    describe('SignInGatePatientia', function () {
        beforeEach(function () {
            // sign in gate patientia runs from 999901-1000000 MVT IDs, so 999901 forces user into test variant
            setMvtCookie('999901');

            // set article count to be min number to view gate
            setArticleCount(3);
        });

        it('should load the sign in gate', function () {
            visitArticleAndScrollToGateForLazyLoad();

            cy.get('[data-cy=sign-in-gate-patientia]').should('be.visible');
        });

        it('should remove gate when the dismiss button is clicked', function () {
            visitArticleAndScrollToGateForLazyLoad();

            cy.get('[data-cy=sign-in-gate-patientia]').should('be.visible');

            cy.get('[data-cy=sign-in-gate-patientia_dismiss]').click();

            cy.get('[data-cy=sign-in-gate-patientia]').should('not.be.visible');
        });
    });
});
