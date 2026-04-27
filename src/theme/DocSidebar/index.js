import React from 'react';
import OriginalDocSidebar from '@theme-original/DocSidebar';
import { useDocScopeFilter } from '@site/src/context/DocScopeFilterContext';
import { shouldShowInSidebar } from '@site/src/context/sidebar-scope-config.js';

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
    if (shouldShowInSidebar(item, version, product)) {
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
