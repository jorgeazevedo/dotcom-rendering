import React from 'react';
import { css } from 'emotion';

const MOSTVIEWED_STICKY_HEIGHT = 1059;

// Styling the data island root so it stetches to cover the full height available in the container.
// Requires us to subtract the height of its sibbling in the container (StickyAd).
const stretchWrapperHeight = css`
    display: flex;
    flex-direction: column;
    height: ${`calc(100% - ${MOSTVIEWED_STICKY_HEIGHT}px)`};
`;

export const MostViewedRightIsland = () => (
    <div id="most-viewed-right" className={stretchWrapperHeight} />
);
