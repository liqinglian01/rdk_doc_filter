import React from 'react';
import { useDocScopeFilter } from '@site/src/context/DocScopeFilterContext';

/**
 * 比较两个版本号
 * @param {string} v1 版本1
 * @param {string} v2 版本2
 * @returns {number} -1: v1 < v2, 0: v1 == v2, 1: v1 > v2
 */
function compareVersions(v1, v2) {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
  
  const maxLength = Math.max(parts1.length, parts2.length);
  
  for (let i = 0; i < maxLength; i++) {
    const p1 = parts1[i] || 0;
    const p2 = parts2[i] || 0;
    
    if (p1 < p2) return -1;
    if (p1 > p2) return 1;
  }
  
  return 0;
}

/**
 * 解析版本范围表达式
 * @param {string} versionStr 版本字符串
 * @returns {object} 版本配置对象
 */
function parseVersionExpression(versionStr) {
  if (!versionStr || typeof versionStr !== 'string') {
    return null;
  }
  
  const trimmed = versionStr.trim();
  
  // 匹配操作符和版本号
  const match = trimmed.match(/^(>=|<=|>|<)?\s*(\d+(?:\.\d+)*)$/);
  
  if (!match) {
    return null;
  }
  
  const operator = match[1] || '';
  const version = match[2];
  
  return {
    operator,
    version
  };
}

/**
 * 检查版本是否匹配配置
 * @param {string} currentVersion 当前版本
 * @param {Array} versionConfigs 版本配置数组
 * @returns {boolean} 是否匹配
 */
function matchVersion(currentVersion, versionConfigs) {
  if (!versionConfigs || versionConfigs.length === 0) {
    return true; // 没有版本限制，默认匹配
  }
  
  for (const config of versionConfigs) {
    // 如果是字符串，解析版本表达式
    if (typeof config === 'string') {
      const parsed = parseVersionExpression(config);
      if (!parsed) {
        // 如果解析失败，尝试精确匹配
        if (config === currentVersion) {
          return true;
        }
        continue;
      }
      
      const { operator, version } = parsed;
      const cmp = compareVersions(currentVersion, version);
      
      switch (operator) {
        case '>':
          if (cmp > 0) return true;
          break;
        case '>=':
          if (cmp >= 0) return true;
          break;
        case '<':
          if (cmp < 0) return true;
          break;
        case '<=':
          if (cmp <= 0) return true;
          break;
        case '':
        default:
          // 精确匹配
          if (cmp === 0) return true;
          break;
      }
    }
  }
  
  return false;
}

/**
 * 根据版本和产品条件显示内容的组件
 * @param {Object} props - 组件属性
 * @param {string} props.versions - 逗号分隔的版本列表，支持范围表达式
 * @param {string} props.products - 逗号分隔的产品列表
 * @param {React.ReactNode} props.children - 要显示的内容
 * 
 * @example
 * // 精确版本匹配
 * <DocScope versions="3.5.0" products="RDK X5">
 *   内容
 * </DocScope>
 * 
 * @example
 * // 版本范围匹配
 * <DocScope versions=">= 3.5.0" products="RDK X5">
 *   内容
 * </DocScope>
 * 
 * @example
 * // 多个版本
 * <DocScope versions=">= 3.0.0, 3.5.0" products="RDK X5">
 *   内容
 * </DocScope>
 */
export default function DocScope({ versions, products, children }) {
  const { version, product } = useDocScopeFilter();

  // 解析版本和产品列表
  const versionList = versions ? versions.split(',').map(v => v.trim()) : [];
  const productList = products ? products.split(',').map(p => p.trim()) : [];

  // 检查是否匹配条件
  const versionMatch = matchVersion(version, versionList);
  const productMatch = productList.length === 0 || productList.includes(product);

  // 如果不匹配条件，返回 null
  if (!versionMatch || !productMatch) {
    return null;
  }

  // 如果匹配条件，返回子内容
  return <div className="doc-scope">{children}</div>;
}
