module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:9000/Article?url=https://www.theguardian.com/commentisfree/2020/feb/08/hungary-now-for-the-new-right-what-venezuela-once-was-for-the-left#noads'],
      startServerCommand: 'NODE_ENV=production DISABLE_LOGGING_AND_METRICS=true node dist/frontend.server.js',
      numberOfRuns: '6',
      puppeteerScript: './scripts/lighthouse/puppeteer-script.js',
      settings: {
        onlyCategories: "accessibility,best-practices,performance,seo",
      }
    },
    upload: {
      target: 'temporary-public-storage',
    },
    assert: {
      assertions: {
        'categories:accessibility': ['error', {minScore: 0.96}]
      }
    }
  },
};
