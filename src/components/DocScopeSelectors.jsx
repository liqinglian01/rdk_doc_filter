import React, { useCallback, useEffect, useId, useRef, useState, useMemo } from 'react';
import { useDocScopeFilter } from '@site/src/context/DocScopeFilterContext';

function ScopeMenu({ label, value, options, onPick }) {
  const baseId = useId();
  const labelId = `${baseId}-label`;
  const listId = `${baseId}-list`;
  const rootRef = useRef(null);
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) {
      return undefined;
    }
    const onDocPointerDown = (e) => {
      if (!rootRef.current?.contains(e.target)) {
        close();
      }
    };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        close();
      }
    };
    document.addEventListener('mousedown', onDocPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  return (
    <div ref={rootRef} className="doc-scope-menu">
      <span className="doc-scope-menu__label" id={labelId}>
        {label}
      </span>
      <div className="doc-scope-menu__control">
        <button
          type="button"
          className="doc-scope-menu__trigger"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-labelledby={labelId}
          onClick={() => setOpen((o) => !o)}>
          <span className="doc-scope-menu__value">{value}</span>
          <span className="doc-scope-menu__caret" aria-hidden />
        </button>
        {open ? (
          <ul id={listId} className="doc-scope-menu__list" role="listbox" aria-labelledby={labelId}>
            {options.map((opt) => (
              <li key={opt} className="doc-scope-menu__item" role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={opt === value}
                  className={
                    opt === value
                      ? 'doc-scope-menu__option doc-scope-menu__option--active'
                      : 'doc-scope-menu__option'
                  }
                  onClick={() => {
                    onPick(opt);
                    close();
                  }}>
                  {opt}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

/**
 * 文档页顶栏：先选版本，再选该版本下的产品；与 URL ?v=&p= 同步。
 * 使用自定义下拉而非原生 select，避免嵌入式预览等环境无法弹出原生菜单。
 */
export default function DocScopeSelectors() {
  const { version, product, setVersion, setProduct, matrix } = useDocScopeFilter();
  const products = useMemo(() => matrix[version] || [], [matrix, version]);
  const productValue = useMemo(() => products.includes(product) ? product : products[0], [products, product]);

  return (
    <div className="doc-scope-selectors">
      <ScopeMenu label="版本" value={version} options={Object.keys(matrix)} onPick={setVersion} />
      <ScopeMenu label="产品" value={productValue} options={products} onPick={setProduct} />
    </div>
  );
}
