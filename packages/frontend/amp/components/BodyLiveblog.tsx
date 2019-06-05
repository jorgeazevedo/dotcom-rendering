import React from 'react';
import { InnerContainer } from '@frontend/amp/components/InnerContainer';
import { Elements } from '@frontend/amp/components/Elements';
import { css } from 'emotion';
import { ArticleModel } from '@frontend/amp/pages/Article';
import { TopMeta } from '@frontend/amp/components/TopMeta';
import { SubMeta } from '@frontend/amp/components/SubMeta';
import { getToneType, StyledTone } from '@frontend/amp/lib/tag-utils';
import { pillarPalette } from '@frontend/lib/pillars';
import { palette } from '@guardian/pasteup/palette';
import { KeyEvents } from '@frontend/amp/components/KeyEvents';
import { headline, textSans } from '@guardian/pasteup/typography';
import { blockLink } from '@frontend/amp/lib/block-link';

// TODO check if liveblog background colours are more complex - like regular
// article is

// TODO add styling for ul and blockquote
const body = (pillar: Pillar, tone: StyledTone) => css`
    background-color: ${palette.neutral[97]};
    ${bulletStyle(pillar)}

    p {
        font-size: 16px;
    }

    h2 {
        ${headline(4)};
        font-weight: 500;
        margin-block-start: 0.83em;
        margin-block-end: 0.83em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
    }

    ${listItemStyle(pillar)}
`;

// TODO move into shared place and also add list styling and blockquote etc.
const bulletStyle = (pillar: Pillar) => css`
    .bullet {
        color: transparent;
        font-size: 1px;
    }

    .bullet:before {
        display: inline-block;
        content: '';
        border-radius: 6px;
        height: 12px;
        width: 12px;
        margin-right: 2px;
        background-color: ${pillarPalette[pillar].main};
        margin-left: 0px;
    }
`;

const listItemStyle = (pillar: Pillar) => css`
    li {
        margin-bottom: 0.8em;
    }
    li:before {
        display: inline-block;
        content: '';
        border-radius: 0.375rem;
        height: 0.75rem;
        width: 0.75rem;
        margin-right: 0.25rem;
        background-color: ${palette.neutral[60]};
    }
`;

const blockStyle = (pillar: Pillar) => css`
    padding: 6px 10px 12px;
    background-color: ${palette.neutral[100]};
    border-top: 1px solid ${pillarPalette[pillar].dark};
    border-bottom: 1px solid ${palette.neutral[93]};
    margin-bottom: 12px;
    blockquote {
        margin-left: 40px;
    }
`;

const blockCreatedOnStyle = (pillar: Pillar) => css`
    color: ${palette.neutral[7]};
    line-height: 2rem;
    margin-bottom: 10px;
    text-decoration: none;
    font-weight: bold;
`;

const lastUpdatedStyle = css`
    ${textSans(1)};
    color: ${palette.neutral[60]};
    text-align: right;
    padding-right: 15px;
`;

// TODO ad handling (currently done in elements, which is wrong, so let's lift
// that out and have an Ad element type we match against
const Blocks: React.SFC<{
    blocks: Block[];
    pillar: Pillar;
    edition: Edition;
    section?: string;
    contentType: string;
    switches: Switches;
    commercialProperties: CommercialProperties;
    url: string;
}> = ({
    blocks,
    pillar,
    edition,
    section,
    contentType,
    switches,
    commercialProperties,
    url,
}) => {
    // TODO add last updated for blocks to show here
    const transformedBlocks = blocks.map(block => {
        return (
            <div
                id={block.id}
                data-sort-time={block.createdOn}
                key={block.id}
                className={blockStyle(pillar)}
            >
                {block.createdOnDisplay && (
                    <a
                        className={blockCreatedOnStyle(pillar)}
                        href={blockLink(url, block.id)}
                    >
                        {block.createdOnDisplay}
                    </a>
                )}
                {block.title && <h2>{block.title}</h2>}
                <Elements
                    pillar={pillar}
                    elements={block.elements}
                    // stuff for ads
                    edition={edition}
                    section={section}
                    contentType={contentType}
                    switches={switches}
                    commercialProperties={commercialProperties}
                    isImmersive={false}
                />
                {block.lastUpdatedDisplay && (
                    <div className={lastUpdatedStyle}>
                        Updated at {block.lastUpdatedDisplay}
                    </div>
                )}
            </div>
        );
    });

    return <>{transformedBlocks}</>;
};

const Pagination: React.SFC<{
    pagination?: Pagination;
    guardianURL: string;
}> = ({ pagination, guardianURL }) => {
    const link = (url: string, suffix?: string): JSX.Element => {
        if (!suffix) {
            return <></>;
        }

        return <a href={url + suffix}>{suffix}</a>;
    };

    if (!pagination) {
        return null;
    }

    return (
        <div>
            {link(guardianURL, pagination.newest)}
            {link(guardianURL, pagination.newer)}
            <div>
                Page {pagination.currentPage} of {pagination.totalPages}
            </div>
            {link(guardianURL, pagination.older)}
            {link(guardianURL, pagination.oldest)}
        </div>
    );
};

export const Body: React.FC<{
    pillar: Pillar;
    data: ArticleModel;
    config: ConfigType;
}> = ({ pillar, data, config }) => {
    const tone = getToneType(data.tags);
    const url = `${data.guardianBaseURL}/${data.pageId}`;
    const isFirstPage = data.pagination
        ? data.pagination.currentPage === 1
        : false;

    return (
        <InnerContainer className={body(pillar, tone)}>
            <TopMeta tone={tone} data={data} />
            <KeyEvents events={data.keyEvents} pillar={pillar} url={url} />
            {!isFirstPage && (
                <Pagination guardianURL={url} pagination={data.pagination} />
            )}
            <amp-live-list
                id="live-blog-entries-7ea0dbef"
                data-max-items-per-page="20"
            >
                <button update="" on="tap:my-live-list.update">
                    You have updates
                </button>
                <div items="">
                    <Blocks
                        pillar={pillar}
                        blocks={data.blocks}
                        // stuff for ads
                        edition={data.editionId}
                        section={data.sectionName}
                        contentType={data.contentType}
                        switches={config.switches}
                        commercialProperties={data.commercialProperties}
                        url={url}
                    />
                </div>
            </amp-live-list>
            <Pagination guardianURL={url} pagination={data.pagination} />
            <SubMeta
                sections={data.subMetaSectionLinks}
                keywords={data.subMetaKeywordLinks}
                pillar={pillar}
                sharingURLs={data.sharingUrls}
                pageID={data.pageId}
                isCommentable={data.isCommentable}
                guardianBaseURL={data.guardianBaseURL}
            />
        </InnerContainer>
    );
};