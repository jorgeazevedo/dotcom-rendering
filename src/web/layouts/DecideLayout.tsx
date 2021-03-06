import React from 'react';

import { Display } from '@root/src/lib/display';
import { StandardLayout } from './StandardLayout';
import { ShowcaseLayout } from './ShowcaseLayout';
import { CommentLayout } from './CommentLayout';
import { ImmersiveLayout } from './ImmersiveLayout';

type Props = {
    CAPI: CAPIType;
    NAV: NavType;
};

const decideDisplay = (CAPI: CAPIType): Display => {
    if (CAPI.isImmersive) return Display.Immersive;
    if (CAPI.pageType.hasShowcaseMainElement) return Display.Showcase;
    return Display.Standard;
};

const decidePillar = (CAPI: CAPIType): Pillar => {
    // We override the pillar to be opinion on Comment news pieces
    if (CAPI.designType === 'Comment' && CAPI.pillar === 'news')
        return 'opinion';
    return CAPI.pillar;
};

export const DecideLayout = ({ CAPI, NAV }: Props) => {
    const display: Display = decideDisplay(CAPI);
    const pillar: Pillar = decidePillar(CAPI);
    const { designType } = CAPI;

    switch (display) {
        case Display.Immersive: {
            switch (designType) {
                case 'Comment':
                case 'GuardianView':
                    return (
                        <ImmersiveLayout
                            CAPI={CAPI}
                            NAV={NAV}
                            display={Display.Immersive}
                            designType={designType}
                            pillar={pillar}
                        />
                    );
                case 'Feature':
                case 'Review':
                case 'Interview':
                case 'Live':
                case 'Media':
                case 'PhotoEssay':
                case 'Analysis':
                case 'Article':
                case 'SpecialReport':
                case 'Recipe':
                case 'MatchReport':
                case 'GuardianLabs':
                case 'Quiz':
                case 'AdvertisementFeature':
                case 'Immersive':
                    return (
                        <ImmersiveLayout
                            CAPI={CAPI}
                            NAV={NAV}
                            display={Display.Immersive}
                            designType={designType}
                            pillar={pillar}
                        />
                    );
            }
            break;
        }
        case Display.Showcase: {
            switch (designType) {
                case 'Comment':
                case 'GuardianView':
                    return (
                        <CommentLayout
                            CAPI={CAPI}
                            NAV={NAV}
                            display={Display.Showcase}
                            designType={designType}
                            pillar={pillar}
                        />
                    );
                case 'Feature':
                case 'Review':
                case 'Interview':
                case 'Live':
                case 'Media':
                case 'PhotoEssay':
                case 'Analysis':
                case 'Article':
                case 'SpecialReport':
                case 'Recipe':
                case 'MatchReport':
                case 'GuardianLabs':
                case 'Quiz':
                case 'AdvertisementFeature':
                case 'Immersive':
                    return (
                        <ShowcaseLayout
                            CAPI={CAPI}
                            NAV={NAV}
                            display={Display.Showcase}
                            designType={designType}
                            pillar={pillar}
                        />
                    );
            }
            break;
        }
        case Display.Standard:
        default: {
            switch (designType) {
                case 'Comment':
                case 'GuardianView':
                    return (
                        <CommentLayout
                            CAPI={CAPI}
                            NAV={NAV}
                            display={Display.Standard}
                            designType={designType}
                            pillar={pillar}
                        />
                    );
                case 'Feature':
                case 'Review':
                case 'Interview':
                case 'Live':
                case 'Media':
                case 'PhotoEssay':
                case 'Analysis':
                case 'Article':
                case 'SpecialReport':
                case 'Recipe':
                case 'MatchReport':
                case 'GuardianLabs':
                case 'Quiz':
                case 'AdvertisementFeature':
                case 'Immersive':
                    return (
                        <StandardLayout
                            CAPI={CAPI}
                            NAV={NAV}
                            display={Display.Standard}
                            designType={designType}
                            pillar={pillar}
                        />
                    );
            }
            break;
        }
    }
};
