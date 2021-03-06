import express from 'express';
import { extract as extractNAV } from '@root/src/model/extract-nav';

import { document } from '@root/src/web/server/document';
import { validateAsCAPIType } from '@root/src/model/validate';
import { addDropCaps } from '@root/src/model/add-dropcaps';
import { addHighlights } from '@root/src/model/add-highlights';
import { enhancePhotoEssay } from '@root/src/model/enhance-photoessay';
import { extract as extractGA } from '@root/src/model/extract-ga';
import { bodyJSON } from '@root/src/model/exampleBodyJSON';

export const render = ({ body }: express.Request, res: express.Response) => {
    try {
        const withDropCaps: CAPIType = addDropCaps(body);
        const withHighlights: CAPIType = addHighlights(withDropCaps);
        const withEssayEnhancement: CAPIType = enhancePhotoEssay(
            withHighlights,
        );
        const CAPI: CAPIType = validateAsCAPIType(withEssayEnhancement);

        const resp = document({
            data: {
                CAPI: {
                    ...CAPI,
                    config: {
                        ...CAPI.config,
                        isDev: process.env.NODE_ENV !== 'production',
                    },
                },
                site: 'frontend',
                page: 'Article',
                NAV: extractNAV(CAPI.nav),
                GA: extractGA(CAPI),
                linkedData: CAPI.linkedData,
            },
        });

        res.status(200).send(resp);
    } catch (e) {
        res.status(500).send(`<pre>${e.stack}</pre>`);
    }
};

export const renderPerfTest = (req: express.Request, res: express.Response) => {
    req.body = JSON.parse(bodyJSON);
    render(req, res);
};
