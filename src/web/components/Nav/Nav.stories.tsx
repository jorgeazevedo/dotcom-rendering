import React from 'react';
import {
    brandBackground,
    brandBorder,
} from '@guardian/src-foundations/palette';

import { Section } from '@frontend/web/components/Section';

import { Display } from '@root/src/lib/display';
import { nav } from './Nav.mock';
import { Nav } from './Nav';

export default {
    component: Nav,
    title: 'Components/Nav',
};

export const StandardStory = () => {
    return (
        <Section
            showSideBorders={true}
            borderColour={brandBorder.primary}
            showTopBorder={false}
            padded={false}
            backgroundColour={brandBackground.primary}
        >
            <Nav
                pillar="news"
                display={Display.Standard}
                nav={nav}
                subscribeUrl=""
                edition="UK"
            />
        </Section>
    );
};
StandardStory.story = { name: 'standard' };

export const ImmersiveStory = () => {
    return (
        <Section
            showSideBorders={false}
            borderColour={brandBorder.primary}
            showTopBorder={false}
            padded={false}
            backgroundColour={brandBackground.primary}
        >
            <Nav
                pillar="news"
                display={Display.Immersive}
                nav={nav}
                subscribeUrl=""
                edition="UK"
            />
        </Section>
    );
};
ImmersiveStory.story = { name: 'immersive' };
