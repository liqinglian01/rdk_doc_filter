import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";

const PLUGIN_GLOBAL = "__UMAMI_DOCUSAURUS__";

function getOptions() {
  if (typeof window !== "undefined" && window[PLUGIN_GLOBAL]) {
    return window[PLUGIN_GLOBAL];
  }
  return {
    enableScroll: true,
    enableCopy: true,
    enableToc: true,
    enableSearch: true,
    enableReadComplete: true,
  };
}

const pageState = {
  maxScroll: -1,
  readComplete: false,
  /** @type {Set<number>} */
  reportedDepths: new Set(),
};

function scrollMetrics() {
  const doc = document.documentElement;
  const denom = doc.scrollHeight - window.innerHeight;
  if (denom <= 0) {
    return { percent: 100, ratio: 1 };
  }
  const ratio = window.scrollY / denom;
  return { percent: Math.round(ratio * 100), ratio };
}

function onScroll() {
  const opts = getOptions();
  const { percent, ratio } = scrollMetrics();

  if (opts.enableScroll && percent > pageState.maxScroll) {
    pageState.maxScroll = percent;
    for (const milestone of [25, 50, 75, 100]) {
      if (percent >= milestone && !pageState.reportedDepths.has(milestone)) {
        pageState.reportedDepths.add(milestone);
        window.umami?.track("scroll_depth", { percent: milestone });
      }
    }
  }

  if (opts.enableReadComplete && !pageState.readComplete && ratio > 0.9) {
    pageState.readComplete = true;
    window.umami?.track("read_complete");
  }
}

let listenersBound = false;

function ensureListeners() {
  if (listenersBound || !ExecutionEnvironment.canUseDOM) {
    return;
  }
  listenersBound = true;

  window.addEventListener("scroll", onScroll, { passive: true });

  document.addEventListener(
    "click",
    (e) => {
      if (!getOptions().enableToc) {
        return;
      }
      const a = e.target.closest?.(".table-of-contents__link");
      if (a) {
        window.umami?.track("toc_click", {
          text: a.innerText,
          href: a.getAttribute("href"),
        });
      }
    },
    true,
  );

  document.addEventListener(
    "keydown",
    (e) => {
      if (!getOptions().enableSearch || e.key !== "Enter") {
        return;
      }
      const t = e.target;
      if (t?.matches?.('input[type="search"]')) {
        window.umami?.track("search", { keyword: t.value });
      }
    },
    true,
  );

  document.addEventListener("copy", () => {
    if (!getOptions().enableCopy) {
      return;
    }
    window.umami?.track("copy");
  });
}

export function onRouteUpdate({ location }) {
  if (!ExecutionEnvironment.canUseDOM) {
    return;
  }

  pageState.maxScroll = -1;
  pageState.readComplete = false;
  pageState.reportedDepths.clear();

  ensureListeners();

  window.umami?.track("pageview", {
    path: location.pathname,
  });

  requestAnimationFrame(() => {
    onScroll();
  });
}
