import React from 'react';
import OriginalDocSidebar from '@theme-original/DocSidebar';
import { useDocScopeFilter } from '@site/src/context/DocScopeFilterContext';

const SIDEBAR_SCOPE_MAP = {
  'rdk_x5': { versions: ['3.5.0'], products: ['RDK X5'] },
  'rdk_x3': { versions: ['3.0.0'], products: ['RDK X3'] },
};

function matchScope(item, version, product) {
  const id = (item.id || '').toLowerCase();
  const label = (item.label || '').toLowerCase();
  const href = (item.href || '').toLowerCase();
  const docId = (item.docId || '').toLowerCase();

  for (const [key, scope] of Object.entries(SIDEBAR_SCOPE_MAP)) {
    const keyLower = key.toLowerCase();
    if (id.includes(keyLower) || label.includes(keyLower) || href.includes(keyLower) || docId.includes(keyLower)) {
      const vMatch = scope.versions.length === 0 || scope.versions.includes(version);
      const pMatch = scope.products.length === 0 || scope.products.includes(product);
      return vMatch && pMatch;
    }
  }
  return true;
}

function filterItems(items, version, product) {
  if (!items) return items;
  const result = [];
  for (const item of items) {
    if (item.type === 'category' && item.items) {
      const filtered = filterItems(item.items, version, product);
      if (filtered.length > 0) {
        result.push({ ...item, items: filtered });
      }
      continue;
    }
    if (matchScope(item, version, product)) {
      result.push(item);
    }
  }
  return result;
}

export default function DocSidebar(props) {
  const { version, product } = useDocScopeFilter();

  const sidebar = props.sidebar;
  let filteredSidebar;

  if (Array.isArray(sidebar)) {
    filteredSidebar = filterItems(sidebar, version, product);
  } else if (sidebar && sidebar.items) {
    filteredSidebar = { ...sidebar, items: filterItems(sidebar.items, version, product) };
  } else {
    filteredSidebar = sidebar;
  }

  return <OriginalDocSidebar {...props} sidebar={filteredSidebar} />;
}
