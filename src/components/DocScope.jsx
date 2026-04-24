import React from 'react';
import { useDocScopeFilter } from '@site/src/context/DocScopeFilterContext';

/**
 * 根据版本和产品条件显示内容的组件
 * @param {Object} props - 组件属性
 * @param {string} props.versions - 逗号分隔的版本列表
 * @param {string} props.products - 逗号分隔的产品列表
 * @param {React.ReactNode} props.children - 要显示的内容
 */
export default function DocScope({ versions, products, children }) {
  const { version, product } = useDocScopeFilter();

  // 解析版本和产品列表
  const versionList = versions ? versions.split(',').map(v => v.trim()) : [];
  const productList = products ? products.split(',').map(p => p.trim()) : [];

  // 检查是否匹配条件
  const versionMatch = versionList.length === 0 || versionList.includes(version);
  const productMatch = productList.length === 0 || productList.includes(product);

  // 如果不匹配条件，返回 null
  if (!versionMatch || !productMatch) {
    return null;
  }

  // 如果匹配条件，返回子内容
  return <div className="doc-scope">{children}</div>;
}
