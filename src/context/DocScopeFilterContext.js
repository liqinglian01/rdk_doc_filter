import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { useHistory, useLocation } from '@docusaurus/router';

/** 版本 → 该产品线下拉可选的产品名（与正文 :::doc_scope 中 products 字符串一致） */
export const VERSION_PRODUCT_MATRIX = {
  '3.0.0': ['RDK X3', 'RDK X3 Module'],
  '3.5.0': ['RDK X5', 'RDK X5 Module'],
  '4.0.5': ['RDK S100'],
  '5.0.1': ['RDK S600'],
  '6.0.0': ['RDK S700'],
};

const DEFAULT_VERSION = '3.0.0';
const DEFAULT_PRODUCT = VERSION_PRODUCT_MATRIX[DEFAULT_VERSION][0];

const defaultCtx = {
  version: DEFAULT_VERSION,
  product: DEFAULT_PRODUCT,
  setVersion: () => {},
  setProduct: () => {},
  matrix: VERSION_PRODUCT_MATRIX,
};

export const DocScopeFilterContext = createContext(defaultCtx);

export function useDocScopeFilter() {
  return useContext(DocScopeFilterContext);
}

function normalizeVersionFromQuery(v) {
  if (v && VERSION_PRODUCT_MATRIX[v]) {
    return v;
  }
  return DEFAULT_VERSION;
}

/**
 * 仅从 URL 派生，不用 useState + effect 与 replace 做二次同步，避免和 Docusaurus PendingNavigation 与路由更新竞态，
 * 出现版本/产品总回到 3.0.0 + RDK X3、下拉「像被固定」的现象。
 */
function parseFilter(search) {
  const normalized = !search
    ? ''
    : search.startsWith('?')
      ? search.slice(1)
      : search;
  const q = new URLSearchParams(normalized);
  if (q.get('v')) {
    const v = normalizeVersionFromQuery(q.get('v'));
    const list = VERSION_PRODUCT_MATRIX[v];
    const pRaw = q.get('p');
    const p = pRaw && list.includes(pRaw) ? pRaw : list[0];
    return { version: v, product: p };
  }
  return { version: DEFAULT_VERSION, product: DEFAULT_PRODUCT };
}

function replaceSearch(history, location, nextSearch) {
  const search = nextSearch && nextSearch.length ? (nextSearch.startsWith('?') ? nextSearch : `?${nextSearch}`) : '';
  if (location.search === search) {
    return;
  }
  history.replace({
    pathname: location.pathname,
    search,
    hash: location.hash,
    state: location.state,
  });
}

export function DocScopeFilterProvider({ children }) {
  const location = useLocation();
  const history = useHistory();

  const { version, product } = useMemo(
    () => parseFilter(location.search),
    [location.search],
  );

  const setVersion = useCallback(
    (v) => {
      const newV = normalizeVersionFromQuery(v);
      const list = VERSION_PRODUCT_MATRIX[newV] || VERSION_PRODUCT_MATRIX[DEFAULT_VERSION];
      const nextP = list[0];
      const next = new URLSearchParams(location.search);
      next.set('v', newV);
      next.set('p', nextP);
      replaceSearch(history, location, `?${next.toString()}`);
    },
    [location, history],
  );

  const setProduct = useCallback(
    (p) => {
      const { version: v } = parseFilter(location.search);
      const list = VERSION_PRODUCT_MATRIX[v];
      if (!list?.includes(p)) {
        return;
      }
      const next = new URLSearchParams(location.search);
      next.set('v', v);
      next.set('p', p);
      replaceSearch(history, location, `?${next.toString()}`);
    },
    [location, history],
  );

  const value = useMemo(
    () => ({
      version,
      product,
      setVersion,
      setProduct,
      matrix: VERSION_PRODUCT_MATRIX,
    }),
    [version, product, setVersion, setProduct],
  );

  return <DocScopeFilterContext.Provider value={value}>{children}</DocScopeFilterContext.Provider>;
}
