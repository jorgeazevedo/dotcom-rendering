import React from 'react';
import { css } from 'emotion';
import { ImageComponent } from '@root/src/web/components/elements/ImageComponent';

import { from } from '@guardian/src-foundations/mq';

const imageCss = {
    inline: css`
        margin-top: 16px;
        margin-bottom: 12px;
    `,

    supporting: css`
        ${from.tablet} {
            position: relative;
            float: left;
            width: 300px;
            margin-top: 6px;
            margin-bottom: 12px;
            margin-right: 20px;
            line-height: 0;
        }
        ${from.leftCol} {
            margin-left: -160px;
        }
        ${from.wide} {
            width: 380px;
            margin-left: -240px;
        }
    `,

    immersive: css`
        ${from.mobileMedium} {
            margin-left: -20px;
            margin-right: -20px;
        }
        ${from.tablet} {
            margin-left: -20px;
            margin-right: -120px;
        }
        ${from.desktop} {
            margin-left: -20px;
            margin-right: -340px;
        }
        ${from.leftCol} {
            margin-left: -180px;
            margin-right: -340px;
        }
        ${from.wide} {
            margin-left: -260px;
            margin-right: -420px;
        }
    `,

    showcase: css`
        position: relative;
        margin-top: 16px;
        margin-bottom: 12px;
        ${from.leftCol} {
            margin-bottom: 16px;
            margin-left: -160px;
        }
        ${from.wide} {
            margin-left: -240px;
        }
    `,

    thumbnail: css`
        float: left;
        clear: left;
        margin-bottom: 0;
        width: 120px;
        margin-right: 20px;
        margin-top: 6px;
        ${from.tablet} {
            width: 140px;
        }
        ${from.wide} {
            margin-left: -240px;
        }
        ${from.leftCol} {
            position: relative;
            margin-left: -160px;
        }
    `,

    // TODO:
    halfWidth: css``,
};

const decidePosition = (role: RoleType) => {
    switch (role) {
        case 'inline':
            return imageCss.inline;
        case 'supporting':
            return imageCss.supporting;
        case 'immersive':
            return imageCss.immersive;
        case 'showcase':
            return imageCss.showcase;
        case 'thumbnail':
            return imageCss.thumbnail;
        case 'halfWidth':
            return imageCss.halfWidth;
        default:
            return imageCss.inline;
    }
};

export const ImageBlockComponent: React.FC<{
    element: ImageBlockElement;
    pillar: Pillar;
    hideCaption?: boolean;
}> = ({ element, pillar, hideCaption }) => {
    const { role } = element;
    return (
        <div className={decidePosition(role)}>
            <ImageComponent
                element={element}
                pillar={pillar}
                hideCaption={hideCaption}
                role={role}
            />
        </div>
    );
};
