import React from 'react';
import { css } from 'emotion';
import fetchMock from 'fetch-mock';

import { calloutCampaign } from '@root/fixtures/calloutCampaign';
import { CalloutBlockComponent } from './CalloutBlockComponent';

export default {
    component: CalloutBlockComponent,
    title: 'Components/CalloutBlockComponent',
};

export const Default = () => {
    fetchMock
        .restore()
        .post(
            'https://callouts.code.dev-guardianapis.com/formstack-campaign/submit',
            {
                status: 201,
                body: null,
            },
        );
    return (
        <div
            className={css`
                width: 630px;
                padding: 15px;
            `}
        >
            <CalloutBlockComponent callout={calloutCampaign} pillar="news" />
        </div>
    );
};
Default.story = { name: 'default' };
