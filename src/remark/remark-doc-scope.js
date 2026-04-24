/**
 * 将 Markdown 容器指令 :::doc_scope 转为带 data-doc-scope 的 div，
 * 供运行时根据「版本 + 产品」双层选择显示/隐藏（共用段落写在指令外，只维护一份）。
 *
 * 写法：
 * :::doc_scope{versions="3.0.0,3.5.0" products="RDK X3"}
 * 仅在这些版本且产品命中时显示的正文…
 * :::
 *
 * - versions / products 为英文逗号分隔；省略或写 * 表示不限制该维度。
 * - 指令名使用 doc_scope，避免与 Docusaurus 内置 :::tip 等冲突。
 */
import { visit } from 'unist-util-visit';

function parseScopeList(value) {
  if (value == null) return [];
  const s = String(value).trim();
  if (s === '' || s === '*') return [];
  return s
    .split(/[,，]/)
    .map((x) => x.trim())
    .filter(Boolean);
}

/** @returns {import('unified').Plugin} */
export default function remarkDocScope() {
  return (tree) => {
    visit(tree, 'containerDirective', (node, index, parent) => {
      if (node.name !== 'doc_scope') return;

      const attrs = node.attributes || {};
      const versions = parseScopeList(attrs.versions);
      const products = parseScopeList(attrs.products);

      const payload = JSON.stringify({ versions, products });

      // 创建一个新的 div 节点
      const divNode = {
        type: 'mdxJsxFlowElement',
        name: 'div',
        attributes: [
          {
            type: 'mdxJsxAttribute',
            name: 'className',
            value: 'doc-scope'
          },
          {
            type: 'mdxJsxAttribute',
            name: 'data-doc-scope',
            value: payload
          }
        ],
        children: node.children || [],
        position: node.position
      };

      // 替换原始节点
      if (parent && index !== null) {
        parent.children[index] = divNode;
      }
    });
  };
}
