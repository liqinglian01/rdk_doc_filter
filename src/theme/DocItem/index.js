import React from 'react';
import DocItem from '@theme-original/DocItem';
import DocScopeHydration from '@site/src/components/DocScopeHydration';
import GiscusComments from './GiscusComments';

export default function DocItemWrapper(props) {
  return (
    <>
      <DocScopeHydration />
      <DocItem {...props} />
      <GiscusComments />
    </>
  );
}
