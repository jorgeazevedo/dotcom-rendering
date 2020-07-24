import * as path from 'path';
import express, { Request, Response } from 'express';
import fetch from 'node-fetch';

import compression from 'compression';

import { dist, port, siteName, statik } from '@root/scripts/frontend/config';
import { log, warn } from '@root/scripts/env/log';
import {
    render as renderAMPArticle,
    renderPerfTest as renderAMPArticlePerfTest,
} from '@root/src/amp/server/render';
import {
    render as renderArticle,
    renderPerfTest as renderArticlePerfTest,
} from '@root/src/web/server/render';

import {
    getGuardianConfiguration,
    GuardianConfiguration,
} from './aws/aws-parameters';
import { recordBaselineCloudWatchMetrics } from './aws/metrics-baseline';
import { logger } from './logging';

// this export is the function used by webpackHotServerMiddleware in /scripts/frontend-dev-server
export default (options: any) => {
    if ('amp' in options) {
        return renderAMPArticle;
    }

    return renderArticle;
};

const buildUrlFromQueryParam = (req: Request) => {
    // Supports urls such as:
    // http://localhost:9000/Article?url=https://www.theguardian.com/commentisfree/2020/feb/08/hungary-now-for-the-new-right-what-venezuela-once-was-for-the-left
    // Note. This is the same as how dev-server.js works
    const DEFAULT_URL =
        'https://www.theguardian.com/money/2017/mar/10/ministers-to-criminalise-use-of-ticket-tout-harvesting-software';
    const url = new URL(req.query.url || DEFAULT_URL);
    // searchParams will only work for the first set of query params because 'url' is already a query param itself
    const searchparams = url.searchParams && url.searchParams.toString();
    // Reconstruct the parsed url adding .json?dcr which we need to force dcr to return json
    return `${url.origin}${url.pathname}.json?dcr=true&${searchparams}`;
};

const buildUrlFromPath = (req: Request) => {
    // Supports urls such as:
    // http://localhost:9000/tv-and-radio/2020/apr/26/normal-people-review-sally-rooney-bbc-hulu
    // Note. Defaults to using production frontend
    return `https://www.theguardian.com${req.url}.json?dcr=true`;
};

// this is the actual production server
if (process.env.NODE_ENV === 'production') {
    logger.info('dotcom-rendering is GO.');
    if(false)
    getGuardianConfiguration('prod')
        .then((config: GuardianConfiguration) => {
            log(`loaded ${config.size()} configuration parameters`);
        })
        .catch((err: any) => {
            warn('Failed to get configuration. Bad AWS credentials?');
            warn(err);
        });

    const app = express();

    app.use(express.json({ limit: '50mb' }));
    app.use(compression());

    app.get('/_healthcheck', (req: Request, res: Response) => {
        res.status(200).send('OKAY');
    });

    // if running prod server locally, serve local assets
    if (!process.env.GU_PUBLIC) {
        app.use(
            `/static/${siteName}`,
            express.static(path.relative(__dirname, statik)),
        );

        app.use('/assets', express.static(path.relative(__dirname, dist)));
    }

    app.post('/Article', renderArticle);
    app.post('/AMPArticle', renderAMPArticle);

    app.get('/Article', async (req: Request, res: Response) => {
        // Eg. http://localhost:9000/Article?url=https://www.theguardian.com/commentisfree/...
        try {
            const url = buildUrlFromQueryParam(req);
            const { html, ...config } = await fetch(url).then((article) =>
                article.json(),
            );

            req.body = config;
            return renderArticle(req, res);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
    });

    app.get('/AMPArticle', async (req: Request, res: Response) => {
        // Eg. http://localhost:9000/AMPArticle?url=https://www.theguardian.com/commentisfree/...
        try {
            const url = buildUrlFromQueryParam(req);
            const { html, ...config } = await fetch(url).then((article) =>
                article.json(),
            );

            req.body = config;
            return renderAMPArticle(req, res);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
    });

    app.use('/ArticlePerfTest', renderArticlePerfTest);
    app.use('/AMPArticlePerfTest', renderAMPArticlePerfTest);

    app.get('/', (req: Request, res: Response) => {
        try {
            res.send(`
                <!DOCTYPE html>
                <html>
                <body>
                    <ul>
                        <li><a href="/Article">Article</a></li>
                        <li><a href="/AMPArticle">⚡️Article</a></li>
                        <li><a href="/ArticlePerfTest">⚡Article (perf test example)</a></li>
                        <li><a href="/AMPArticlePerfTest">⚡️Article (perf test example)</a></li>
                    </ul>
                    <ul>
                        <li><a href="/ArticlePerfTest">⚡Article (perf test example)</a></li>
                        <li><a href="/AMPArticlePerfTest">⚡️Article (perf test example)</a></li>
                    </ul>
                </body>
                </html>
            `);
        } catch (e) {
            res.status(500).send(`<pre>${e.stack}</pre>`);
        }
    });

    // express requires all 4 args here:
    app.use((err: any, req: any, res: any, next: any) => {
        res.status(500).send(`<pre>${err.stack}</pre>`);
    });

if(false)
    setInterval(() => {
        recordBaselineCloudWatchMetrics();
    }, 10 * 1000);

    app.listen(port);
    // eslint-disable-next-line no-console
    console.log(`Started production server on port ${port}`);
    console.log('ready');
}
