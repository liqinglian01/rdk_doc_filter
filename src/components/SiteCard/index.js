import React from "react";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";

export default function SiteCard({ title, description, href, tags, external, accent, versions }) {
  const isExternal = external || /^https?:\/\//.test(href);
  const linkProps = isExternal
    ? { href, target: "_blank", rel: "noopener noreferrer" }
    : { to: href };

  const hasVersions = Array.isArray(versions) && versions.length > 0;
  const latest = hasVersions ? versions[versions.length - 1] : null;
  const totalVersions = hasVersions ? versions.length : 0;

  const allTags = [
    ...(hasVersions ? [{ text: `最新 ${latest}`, kind: "version" }] : []),
    ...(hasVersions && totalVersions > 1 ? [{ text: `共 ${totalVersions} 个版本`, kind: "count" }] : []),
    ...((tags ?? []).map((t) => ({ text: t, kind: "plain" }))),
  ];

  return (
    <Link
      className={styles.card}
      {...linkProps}
      style={accent ? { "--card-accent": accent } : undefined}
    >
      <div className={styles.cardHeader}>
        <h3 className={styles.title}>
          {title}
          {isExternal ? <span className={styles.externalIcon} aria-hidden>↗</span> : null}
        </h3>
        {allTags.length ? (
          <div className={styles.tags}>
            {allTags.map((t, i) => (
              <span key={i} className={`${styles.tag} ${styles[`tag_${t.kind}`] ?? ""}`}>
                {t.text}
              </span>
            ))}
          </div>
        ) : null}
      </div>
      <p className={styles.description}>{description}</p>
      <div className={styles.cardFooter}>
        <span className={styles.cta}>
          {isExternal ? "访问外链" : "进入文档"} →
        </span>
      </div>
    </Link>
  );
}
