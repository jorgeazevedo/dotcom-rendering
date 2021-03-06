describe('Elements', function () {
    describe('AMP', function () {
        // Based on examples from this blog post about working with iframes in Cypress
        // https://www.cypress.io/blog/2020/02/12/working-with-iframes-in-cypress/
        const getAmpIframeBody = (iframeSelector) => {
            // get the iframe > document > body
            // and retry until the body element is not empty
            return (
                cy
                    .get(iframeSelector)
                    .its('0.contentDocument.body')
                    .should('not.be.empty')
                    // wraps "body" DOM element to allow
                    // chaining more Cypress commands, like ".find(...)"
                    // https://on.cypress.io/wrap
                    .then(cy.wrap)
            );
        };

        it('should render the corona interactive atom embed', function () {
            cy.visit(
                'AMPArticle?url=https://www.theguardian.com/world/2020/apr/24/new-mother-dies-of-coronavirus-six-days-after-giving-birth',
            );

            getAmpIframeBody(
                'amp-iframe[data-cy="atom-embed-url"] > iframe',
            ).contains('Data from PHE');
        });

        it('should render the counted interactive embed', function () {
            cy.visit(
                'AMPArticle?url=https://www.theguardian.com/us-news/2015/nov/05/police-tasers-deaths-the-counted',
            );

            const ampIframeSelector =
                'amp-iframe[src="https://interactive.guim.co.uk/embed/2015/10/2015-10-counted-table/"]';

            cy.get(ampIframeSelector).scrollIntoView({
                duration: 300,
                offset: { top: -100, left: 0 },
            });

            getAmpIframeBody(`${ampIframeSelector} > iframe`).contains(
                'Deaths after Taser use: the findings',
            );
        });
    });

    describe('WEB', function () {
        it('should render the page as expected', function () {
            cy.viewport('iphone-x');
            const iphoneXWidth = 375;
            let hasElementTooWide = false;

            cy.visit(
                'Article?url=https://www.theguardian.com/commentisfree/2020/jun/30/conservatives-cowboy-builders-boris-johnson',
            );

            const pageHasXOverflow = (docWidth) => {
                const scrollbarWidth = 15; // Chrome scrollbar is 15px...
                return cy.get('*').each(($el) => {
                    if (
                        !$el.is('script') && // Remove script elements from check...
                        $el.outerWidth() > docWidth - scrollbarWidth
                    ) {
                        // This is brittle but if we're in here then we're trouble anyway
                        // hopefully it shows some context for where the problem comes from
                        // but you probably are going to want to be running Cypress locally
                        cy.log(
                            `Element is wider than document: ${$el[0].classList[0]} in parent ${$el[0].parentElement.classList[0]}`,
                        );
                        hasElementTooWide = true;
                    }
                });
            };

            cy.wrap(null).then(() =>
                pageHasXOverflow(iphoneXWidth).then(
                    () => expect(hasElementTooWide).to.be.false,
                ),
            );
        });

        it('should render the instagram embed', function () {
            // https://www.cypress.io/blog/2020/02/12/working-with-iframes-in-cypress/
            const getIframeBody = () => {
                return cy
                    .get('div[data-cy="instagram-embed"] > iframe')
                    .its('0.contentDocument.body')
                    .should('not.be.empty')
                    .then(cy.wrap);
            };
            cy.visit(
                'Article?url=https://www.theguardian.com/media/2018/aug/29/flat-tummy-instagram-women-appetite-suppressant-lollipops',
            );

            getIframeBody().contains('View More on Instagram');
        });

        it('should render the embed', function () {
            const getIframeBody = () => {
                return cy
                    .get('div[data-cy="embed-block"] > div > iframe')
                    .its('0.contentDocument.body')
                    .should('not.be.empty')
                    .then(cy.wrap);
            };
            cy.visit(
                'Article?url=https://www.theguardian.com/sport/blog/2015/dec/02/the-joy-of-six-sports-radio-documentaries',
            );

            getIframeBody().contains('radiolab');
        });
        it('should render the soundcloud embed', function () {
            const getIframeBody = () => {
                return cy
                    .get('div[data-cy="soundcloud-embed"] > iframe')
                    .its('0.contentDocument.body')
                    .should('not.be.empty')
                    .then(cy.wrap);
            };
            cy.visit(
                'Article?url=https://www.theguardian.com/music/2020/jan/31/elon-musk-edm-artist-first-track-dont-doubt-ur-vibe',
            );

            getIframeBody().contains('Cookie policy');
        });

        it('should render the football embed', function () {
            const getBody = () => {
                return cy
                    .get('div[data-cy="football-table-embed"]')
                    .should('not.be.empty')
                    .then(cy.wrap);
            };
            cy.visit(
                'Article?url=https://www.theguardian.com/football/2020/jun/10/premier-league-restart-preview-no-5-burnley',
            );

            getBody().contains('Liverpool');
        });

        it('should render the affiliate disclaimer block', function () {
            const getBody = () => {
                return cy
                    .get('[data-cy="affiliate-disclaimer"]')
                    .should('not.be.empty')
                    .then(cy.wrap);
            };
            cy.visit(
                'Article?url=https://www.theguardian.com/music/2020/jun/15/pet-shop-boys-where-to-start-in-their-back-catalogue',
            );

            getBody().contains('affiliate links');
        });
    });
});
