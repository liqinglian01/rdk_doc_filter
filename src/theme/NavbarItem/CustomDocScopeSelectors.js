import React from 'react';
import { useLocation } from '@docusaurus/router';
import DocScopeSelectors from '@site/src/components/DocScopeSelectors';

export default function NavbarItemCustomDocScopeSelectors() {
  const location = useLocation();
  
  const isHomePage = location.pathname === '/' || location.pathname === '/rdk_doc_filter/' || location.pathname === '/rdk_doc_filter';
  
  if (isHomePage) {
    return null;
  }
  
  return (
    <div className="navbar__item">
      <DocScopeSelectors />
    </div>
  );
}