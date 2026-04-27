import React, { useEffect } from 'react';
import { useHistory } from '@docusaurus/router';
import { useDocsSidebar } from '@docusaurus/plugin-content-docs/client';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import DocItem from '@theme-original/DocItem';
import DocScopeHydration from '@site/src/components/DocScopeHydration';
import GiscusComments from './GiscusComments';
import { useDocScopeFilter } from '@site/src/context/DocScopeFilterContext';
import { shouldShowDoc, findFirstVisibleDoc } from '@site/src/context/sidebar-scope-config';

export default function DocItemWrapper(props) {
  const { i18n } = useDocusaurusContext();
  const { version, product } = useDocScopeFilter();
  const history = useHistory();
  const sidebar = useDocsSidebar();

  const docId = props?.content?.metadata?.id || '';
  const visible = shouldShowDoc(docId, version, product);

  useEffect(() => {
    if (!visible && sidebar?.items) {
      const firstDocHref = findFirstVisibleDoc(sidebar.items, version, product);
      if (firstDocHref) {
        const currentSearch = window.location.search;
        history.replace(firstDocHref + currentSearch);
      } else {
        const basePath = i18n.currentLocale === 'en' ? '/rdk_doc_filter/en/' : '/rdk_doc_filter/';
        history.replace(basePath + window.location.search);
      }
    }
  }, [visible, history, sidebar, i18n.currentLocale]);

  if (!visible) {
    return null;
  }

  return (
    <>
      <DocScopeHydration />
      <DocItem {...props} />
      <GiscusComments />
    </>
  );
}
