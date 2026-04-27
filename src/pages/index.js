import React from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import clsx from "clsx";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { groups, sitesByGroup, groupsEn, sitesEn } from "@site/src/data/sites";
import SiteCard from "@site/src/components/SiteCard";
import styles from "./index.module.css";

function Hero() {
  const { i18n } = useDocusaurusContext();
  const isEnglish = i18n.currentLocale === 'en';
  
  return (
    <header className={styles.hero}>
      <div className={clsx(styles.heroInner, "home-page-content")}>
        <h1 className={styles.heroTitle}>{isEnglish ? "Documentation Center" : "文档中心"}</h1>
        <p className={styles.heroSubtitle}>
          {isEnglish 
            ? "D-Robotics Developer Documentation Hub —— RDK · SDK · Robot Applications · Examples · Accessories · Software · Algorithm Toolchain" 
            : "D-Robotics 开发者文档总入口 —— RDK  · SDK  · 机器人应用 · 示例 · 配件 · 软件 · 算法工具链"
          }
        </p>
        <div className={styles.heroActions}>
          <a
            className={styles.heroBtnGhost}
            href="https://github.com/D-Robotics"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
        <nav className={styles.heroNav} aria-label={isEnglish ? "Quick Navigation" : "快速跳转"}>
          {(isEnglish ? groupsEn : groups).map((g) => (
            <a key={g.id} href={`#${g.anchor}`} className={styles.heroNavItem}>
              {g.title}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

function GroupSection({ group, items }) {
  if (!items?.length) return null;
  return (
    <section id={group.anchor} className={styles.section}>
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle} style={{ "--group-accent": group.accent }}>
            <span className={styles.sectionDot} aria-hidden />
            {group.title}
          </h2>
          <p className={styles.sectionSubtitle}>{group.subtitle}</p>
        </div>
      </div>
      <div className={styles.grid}>
        {items.map((item) => (
          <SiteCard
            key={item.id}
            title={item.title}
            description={item.description}
            href={item.href}
            tags={item.tags}
            versions={item.versions}
            external={item.external}
            accent={group.accent}
          />
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const { i18n } = useDocusaurusContext();
  const isEnglish = i18n.currentLocale === 'en';
  const currentGroups = isEnglish ? groupsEn : groups;
  const grouped = sitesByGroup(isEnglish ? sitesEn : undefined);
  
  return (
    <Layout
      title={isEnglish ? "RDK Documentation Center" : "RDK 文档中心"}
      description={isEnglish 
        ? "D-Robotics Developer Documentation Hub —— Aggregating RDK, SDK, Robot Applications, Algorithm Toolchain and other sub-sites" 
        : "D-Robotics 开发者文档总入口 —— 聚合 RDK 、SDK、机器人应用、算法工具链等所有子站"
      }
    >
      <Hero />
      <main className={clsx(styles.main, "home-page-content")}>
        {currentGroups.map((g) => (
          <GroupSection key={g.id} group={g} items={grouped[g.id] || []} />
        ))}
      </main>
    </Layout>
  );
}
