import React from 'react';
import { css } from 'emotion';
import { textSans, palette } from '@guardian/src-foundations';
import { until } from '@guardian/src-utilities';
import { MainImageComponent } from '@frontend/web/components/elements/MainImageComponent';

const captionFont = css`
    ${textSans({ level: 1 })};
    color: ${palette.neutral[46]};
`;

const mainMedia = css`
    min-height: 1px;
    /*
    Thank you IE11, broken in stasis for all eternity.

    https://github.com/philipwalton/flexbugs/issues/75#issuecomment-161800607
    */

    margin-bottom: 14px;

    ${until.tablet} {
        margin: 0;
        order: -1;

        figcaption {
            display: none;
        }
    }

    img {
        flex: 0 0 auto; /* IE */
        width: 100%;
        height: 100%;
    }

    figcaption {
        ${captionFont};
    }
`;

function renderElement(element: CAPIElement, pillar: Pillar, i: number) {
    switch (element._type) {
        case 'model.dotcomrendering.pageElements.ImageBlockElement':
            return (
                <MainImageComponent key={i} element={element} pillar={pillar} />
            );
        default:
            return null;
    }
}

export const MainMedia: React.FC<{
    elements: CAPIElement[];
    pillar: Pillar;
}> = ({ elements, pillar }) => (
    <div className={mainMedia}>
        {elements.map((element, i) => renderElement(element, pillar, i))}
    </div>
);
