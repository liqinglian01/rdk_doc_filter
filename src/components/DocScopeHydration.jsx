import React, { useLayoutEffect } from 'react';
import { useDocScopeFilter } from '@site/src/context/DocScopeFilterContext';

function matchesScope(spec, version, product) {
  const versions = spec.versions || [];
  const products = spec.products || [];
  const vOk = versions.length === 0 || versions.includes(version);
  const pOk = products.length === 0 || products.includes(product);
  return vOk && pOk;
}

/**
 * 根据当前版本/产品，为 .doc-scope 节点切换 doc-scope--hidden（由 remark-doc-scope 注入）。
 */
export default function DocScopeHydration() {
  const { version, product } = useDocScopeFilter();

  useLayoutEffect(() => {
    const root =
      typeof document !== 'undefined'
        ? document.querySelector('.theme-doc-markdown') ||
          document.querySelector('article.markdown') ||
          document.querySelector('article')
        : null;
    if (!root) {
      return;
    }
    root.querySelectorAll('.doc-scope[data-doc-scope]').forEach((el) => {
      const raw = el.getAttribute('data-doc-scope');
      if (!raw) {
        return;
      }
      try {
        const spec = JSON.parse(raw);
        const show = matchesScope(spec, version, product);
        el.classList.toggle('doc-scope--hidden', !show);
      } catch {
        el.classList.remove('doc-scope--hidden');
      }
    });
  }, [version, product]);

  return null;
}
