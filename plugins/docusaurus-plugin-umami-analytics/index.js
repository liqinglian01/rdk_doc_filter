const path = require("path");

const PLUGIN_GLOBAL = "__UMAMI_DOCUSAURUS__";

/**
 * Umami analytics with SPA-friendly manual pageviews and custom events.
 * @param {import('@docusaurus/types').LoadContext} _context
 * @param {{
 *   websiteId: string;
 *   src?: string;
 *   enableScroll?: boolean;
 *   enableCopy?: boolean;
 *   enableToc?: boolean;
 *   enableSearch?: boolean;
 *   enableReadComplete?: boolean;
 * }} options
 */
module.exports = function umamiAnalyticsPlugin(_context, options) {
  const {
    websiteId,
    src = "https://umami.is/script.js",
    enableScroll = true,
    enableCopy = true,
    enableToc = true,
    enableSearch = true,
    enableReadComplete = true,
  } = options;

  return {
    name: "docusaurus-plugin-umami-analytics",
    injectHtmlTags() {
      if (!websiteId) {
        return {};
      }
      const safeOpts = JSON.stringify({
        enableScroll,
        enableCopy,
        enableToc,
        enableSearch,
        enableReadComplete,
      });
      return {
        headTags: [
          {
            tagName: "script",
            innerHTML: `window.${PLUGIN_GLOBAL}=${safeOpts};`,
          },
          {
            tagName: "script",
            attributes: {
              defer: true,
              "data-website-id": websiteId,
              "data-auto-track": "false",
              src,
            },
          },
        ],
      };
    },
    getClientModules() {
      if (!websiteId) {
        return [];
      }
      return [path.resolve(__dirname, "client")];
    },
  };
};
