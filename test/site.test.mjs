import { readdir, readFile, stat } from 'node:fs/promises';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const root = new URL('../', import.meta.url);

const htmlFiles = async (directory = root) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === 'test') {
      continue;
    }

    const url = new URL(entry.name, directory);
    if (entry.isDirectory()) {
      files.push(...(await htmlFiles(new URL(`${entry.name}/`, directory))));
    } else if (entry.name.endsWith('.html')) {
      files.push(url);
    }
  }

  return files;
};

test('home page exposes the expected help center structure', async () => {
  const html = await readFile(new URL('index.html', root), 'utf8');

  assert.match(html, /<title>帮助中心<\/title>/);
  assert.match(html, /name="theme-color"/);
  assert.match(html, /property="og:title"/);
  assert.match(html, /rel="manifest" href="\.\/site\.webmanifest"/);
  assert.match(html, /rel="icon" href="\.\/assets\/favicon\.svg"/);
  assert.match(html, /class="skip-link"/);
  assert.match(html, /<aside class="sidebar"/);
  assert.match(html, /<main class="content"/);
  assert.match(html, /id="quick-links"/);
  assert.match(html, /id="pricing"/);
  assert.match(html, /id="compatible-devices"/);
  assert.match(html, /id="responsibility"/);
  assert.match(html, /href="\.\/pages\/quick-reference\.html"/);
  assert.match(html, /href="\.\/pages\/privacy\.html"/);
  assert.match(html, /href="\.\/pages\/terms\.html"/);
  assert.match(html, /href="\.\/pages\/support\.html"/);
  assert.match(html, /class="footer-links"/);
  assert.match(html, /class="footer-contact"/);
  assert.match(html, /<small>Xingqiao Yunqi Network Inc\.<\/small>/);
  assert.match(html, /Help Center/);
  assert.match(html, /© 2026 星桥云启科技/);
  assert.match(html, /QQ：3818898938/);
  assert.match(html, /QQ群：1083428128/);
  assert.doesNotMatch(html, /MITCE Docs/);
  assert.doesNotMatch(html, /MITCE Network Inc\./);
  assert.doesNotMatch(html, /aria-label="文档状态"/);
  assert.doesNotMatch(html, /在线文档/);
  assert.doesNotMatch(html, /快速查询/);
  assert.match(html, /快捷说明/);
  assert.match(html, /data-mobile-menu/);
  assert.match(html, /aria-expanded="false"/);
});

test('home page presents standard and Japan annual pricing plans', async () => {
  const html = await readFile(new URL('index.html', root), 'utf8');

  assert.match(html, /id="pricing"/);
  assert.match(html, /套餐报价/);
  assert.match(html, /class="price-grid"/);
  assert.match(html, /class="price-card[^"]*"/);
  assert.match(html, /普通轻量套餐/);
  assert.match(html, /100G\/月/);
  assert.match(html, /年费 160/);
  assert.match(html, /每月 100GB 流量，流量每月重置/);
  assert.match(html, /普通进阶套餐/);
  assert.match(html, /500G\/月/);
  assert.match(html, /年费 200/);
  assert.match(html, /每月 500GB 流量，流量每月重置/);
  assert.match(html, /普通无限套餐/);
  assert.match(html, /不限流量/);
  assert.match(html, /年费 480/);
  assert.match(html, /动态网速 1000Mbps/);
  assert.match(html, /可连接 10 台设备/);
  assert.match(html, /Japan-Basic/);
  assert.match(html, /¥240\/年/);
  assert.match(html, /约 ¥20\/月/);
  assert.match(html, /每月 60GB 流量/);
  assert.match(html, /Japan-Pro/);
  assert.match(html, /¥500\/年/);
  assert.match(html, /约 ¥41\.67\/月/);
  assert.match(html, /每月 200GB 流量/);
  assert.match(html, /动态网速 100Mbps/);
  assert.match(html, /5 台设备/);
  assert.match(html, /美国、英国 ISP 节点/);
  assert.match(html, /比 Basic 多 140GB\/月/);
  assert.match(html, /href="#pricing"/);
  assert.doesNotMatch(html, /库存/);
  assert.doesNotMatch(html, /ChatGPT|chatgpt|Hysteria2|Reality/);
});

test('publish support files exist for GitHub Pages', async () => {
  const notFound = await readFile(new URL('404.html', root), 'utf8');
  const readme = await readFile(new URL('README.md', root), 'utf8');
  const robots = await readFile(new URL('robots.txt', root), 'utf8');
  const sitemap = await readFile(new URL('sitemap.xml', root), 'utf8');
  const manifest = await readFile(new URL('site.webmanifest', root), 'utf8');
  const favicon = await readFile(new URL('assets/favicon.svg', root), 'utf8');
  await stat(new URL('.nojekyll', root));

  assert.match(notFound, /页面没有找到/);
  assert.match(notFound, /href="\.\/index\.html"/);
  assert.match(notFound, /href="\.\/pages\/windows\.html"/);
  assert.match(notFound, /href="\.\/pages\/quick-reference\.html"/);
  assert.match(notFound, /<script src="\.\/script\.js"><\/script>/);

  assert.match(readme, /GitHub Pages/);
  assert.match(readme, /npm run serve/);
  assert.match(readme, /pages\/ios-ipados\.html/);
  assert.match(readme, /pages\/quick-reference\.html/);
  assert.match(readme, /pages\/privacy\.html/);
  assert.match(readme, /pages\/terms\.html/);
  assert.match(readme, /pages\/support\.html/);

  assert.match(robots, /User-agent: \*/);
  assert.match(robots, /Allow: \//);
  assert.match(robots, /Sitemap: \.\/sitemap\.xml/);
  assert.match(sitemap, /<urlset/);
  assert.match(sitemap, /index\.html/);
  assert.match(sitemap, /pages\/quick-reference\.html/);
  assert.match(sitemap, /pages\/privacy\.html/);
  assert.match(sitemap, /pages\/terms\.html/);
  assert.match(sitemap, /pages\/support\.html/);
  assert.match(sitemap, /guides\/windows-clash-verge\.html/);
  assert.match(manifest, /"name": "MITCE 帮助中心"/);
  assert.match(manifest, /"theme_color": "#050505"/);
  assert.match(favicon, /<svg/);
});

test('styles use a monochrome product palette and responsive docs layout', async () => {
  const css = await readFile(new URL('styles.css', root), 'utf8');

  assert.match(css, /--ink:/);
  assert.match(css, /--paper:/);
  assert.match(css, /--mono-900:/);
  assert.doesNotMatch(css, /--feishu-/);
  assert.doesNotMatch(css, /#3370ff|#7f3bf5|#14c9c9|#00b578/i);
  assert.match(css, /grid-template-columns: 260px minmax\(0, 1fr\) 220px/);
  assert.match(css, /@media \(max-width: 980px\)/);
  assert.match(
    css,
    /@media \(max-width: 980px\)[\s\S]*\.hero:has\(\.hero-card\)[\s\S]*grid-template-columns: 1fr/
  );
  assert.match(css, /@media \(max-width: 430px\)/);
  assert.match(css, /@media \(max-width: 430px\)[\s\S]*\.guide-hero h1[\s\S]*font-size: 26px/);
  assert.match(css, /@media \(max-width: 390px\)/);
  assert.match(css, /body\.is-android/);
  assert.match(css, /body\.is-ios/);
  assert.match(css, /\.term-grid/);
  assert.match(css, /\.footer-links/);
  assert.match(css, /\.footer-contact/);
  assert.match(css, /\.contact-line/);
  assert.match(css, /\.software-name/);
  assert.match(css, /\.recommend-badge/);
  assert.match(css, /\.price-grid/);
  assert.match(css, /\.price-card/);
  assert.match(css, /\.price-card:hover/);
  assert.match(css, /\.price-amount/);
  assert.match(css, /\.price-detail-list/);
  assert.match(css, /\.plan-difference/);
  assert.match(css, /\.guide-hero h1[\s\S]*font-size: clamp\(26px, 6vw, 48px\)/);
  assert.match(css, /\.guide-card[\s\S]*grid-template-areas:[\s\S]*"icon title"[\s\S]*"icon desc"/);
  assert.match(css, /\.guide-icon[\s\S]*grid-area: icon/);
  assert.match(css, /\.guide-card strong[\s\S]*grid-area: title/);
  assert.match(css, /\.guide-card small[\s\S]*grid-area: desc/);
});

test('styles include safeguards for recent phone viewport widths', async () => {
  const css = await readFile(new URL('styles.css', root), 'utf8');
  const htmlFilesToCheck = ['index.html', 'pages/windows.html', 'pages/quick-reference.html'];

  for (const width of ['430', '414', '393', '390', '375', '360', '340']) {
    assert.match(css, new RegExp(`@media \\(max-width: ${width}px\\)`));
  }

  assert.match(css, /padding-right: max\(14px, env\(safe-area-inset-right\)\)/);
  assert.match(css, /padding-left: max\(14px, env\(safe-area-inset-left\)\)/);
  assert.match(css, /overflow-wrap: anywhere/);
  assert.match(css, /word-break: break-word/);
  assert.match(css, /touch-action: manipulation/);
  assert.match(css, /\.mobile-menu-button/);
  assert.match(css, /min-height: 44px/);
  assert.match(css, /body\.is-android/);
  assert.match(css, /body\.is-ios/);

  for (const file of htmlFilesToCheck) {
    const html = await readFile(new URL(file, root), 'utf8');
    assert.match(html, /width=device-width, initial-scale=1\.0, viewport-fit=cover/);
  }
});

test('script applies Android and iOS body classes for phone-specific styles', async () => {
  const js = await readFile(new URL('script.js', root), 'utf8');

  assert.match(js, /is-android/);
  assert.match(js, /is-ios/);
  assert.match(js, /userAgent\.includes\('android'\)/);
  assert.match(js, /iphone\|ipad\|ipod/);
  assert.match(js, /aria-expanded/);
  assert.match(js, /Escape/);
  assert.doesNotMatch(js, /findLast/);
});

test('every html page loads the shared script for device-specific behavior', async () => {
  for (const file of await htmlFiles()) {
    const html = await readFile(file, 'utf8');
    assert.match(html, /<script src="(?:\.\/|\.\.\/)?script\.js"><\/script>/);
  }
});

test('home page links to local platform pages', async () => {
  const html = await readFile(new URL('index.html', root), 'utf8');

  assert.match(html, /href="\.\/pages\/windows\.html"/);
  assert.match(html, /href="\.\/pages\/android\.html"/);
  assert.match(html, /href="\.\/pages\/macos\.html"/);
  assert.match(html, /href="\.\/pages\/ios-ipados\.html"/);
  assert.match(html, /href="\.\/pages\/quick-reference\.html"/);
  assert.doesNotMatch(html, /openwrt/i);
});

test('quick reference page covers source glossary topics locally', async () => {
  const html = await readFile(new URL('pages/quick-reference.html', root), 'utf8');

  assert.match(html, /<title>快捷说明/);
  assert.match(html, /<h1>快捷说明<\/h1>/);
  assert.match(html, /class="term-grid"/);
  assert.match(html, /id="install-proxy-software"/);
  assert.match(html, /id="contact-for-subscription"/);
  assert.match(html, /id="import-subscription"/);
  assert.match(html, /安装代理软件/);
  assert.match(html, /QQ：3818898938/);
  assert.match(html, /id="usage-examples"/);
  assert.doesNotMatch(html, /重置 URL|重置 UUID|UUID|邀请链接|服务后台|账户后台/);
  assert.match(html, /<script src="\.\.\/script\.js"><\/script>/);
});

test('static site keeps user-facing subscription guidance simple', async () => {
  for (const file of await htmlFiles()) {
    const html = await readFile(file, 'utf8');
    assert.doesNotMatch(html, /重置 URL|重置 UUID|UUID|邀请链接|服务后台|账户后台/);
  }
});

test('static site does not contain ChatGPT-specific content', async () => {
  for (const file of await htmlFiles()) {
    const html = await readFile(file, 'utf8');
    assert.doesNotMatch(html, /openai\.chatgpt/i);
    assert.doesNotMatch(html, /ChatGPT|chatgpt/i);
  }
});

test('market readiness pages are available from the static site', async () => {
  const expectations = [
    {
      file: 'pages/privacy.html',
      title: '隐私政策',
      sections: ['collected-data', 'local-storage', 'third-party-links', 'privacy-contact'],
      text: ['本地存储', '第三方链接', '联系方式']
    },
    {
      file: 'pages/terms.html',
      title: '使用条款',
      sections: ['acceptable-use', 'third-party-services', 'disclaimer', 'terms-updates'],
      text: ['合理使用', '第三方服务', '免责声明']
    },
    {
      file: 'pages/support.html',
      title: '联系支持',
      sections: ['support-channels', 'before-contact', 'report-template', 'business-checklist'],
      text: ['Telegram', 'QQ：3818898938', '反馈模板', '上线前检查']
    }
  ];

  for (const page of expectations) {
    const html = await readFile(new URL(page.file, root), 'utf8');
    assert.match(html, new RegExp(`<title>${page.title}`));
    assert.match(html, new RegExp(`<h1>${page.title}</h1>`));
    assert.match(html, /href="\.\.\/index\.html"/);
    assert.match(html, /<script src="\.\.\/script\.js"><\/script>/);

    for (const section of page.sections) {
      assert.match(html, new RegExp(`id="${section}"`));
    }

    for (const text of page.text) {
      assert.match(html, new RegExp(text));
    }
  }
});

test('platform pages expose tutorial and download links', async () => {
  const expectations = [
    {
      page: 'windows',
      title: '兼容Windows系统的软件',
      names: ['Clash Verge Rev', 'v2rayN'],
      links: ['https://github.com/clash-verge-rev/clash-verge-rev/releases', 'https://github.com/2dust/v2rayN/releases']
    },
    {
      page: 'android',
      title: '兼容Android系统的软件',
      names: ['Clash Meta Android', 'v2rayNG', 'Sing Box'],
      links: [
        'https://github.com/MetaCubeX/ClashMetaForAndroid/releases',
        'https://github.com/2dust/v2rayNG/releases',
        'https://github.com/SagerNet/sing-box/releases'
      ]
    },
    {
      page: 'macos',
      title: '兼容macOS系统的软件',
      names: ['Clash Verge Rev', 'SingBox', 'Shadowrocket'],
      links: [
        'https://github.com/clash-verge-rev/clash-verge-rev/releases',
        'https://apps.apple.com/us/app/sing-box-vt/id6673731168',
        'https://apps.apple.com/us/app/shadowrocket/id932747118'
      ]
    },
    {
      page: 'ios-ipados',
      title: '兼容iOS/iPadOS系统的软件',
      names: ['SingBox', 'Shadowrocket'],
      links: [
        'https://apps.apple.com/us/app/sing-box-vt/id6673731168',
        'https://apps.apple.com/us/app/shadowrocket/id932747118'
      ]
    }
  ];

  for (const item of expectations) {
    const html = await readFile(new URL(`pages/${item.page}.html`, root), 'utf8');
    assert.match(html, new RegExp(item.title));
    assert.match(html, /class="platform-table"/);
    assert.match(html, /href="\.\.\/guides\//);
    assert.match(html, /target="_blank"/);
    assert.match(html, /rel="noopener noreferrer"/);
    assert.doesNotMatch(html, />GitHub 下载</);

    for (const name of item.names) {
      assert.match(html, new RegExp(name));
    }

    for (const link of item.links) {
      assert.match(html, new RegExp(link.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    }

    for (const row of html.matchAll(/<div class="platform-row">([\s\S]*?)<\/div>/g)) {
      assert.match(row[1], />查看教程</);
      assert.match(row[1], />下载</);
    }
  }
});

test('platform pages mark preferred clients with recommendation badges', async () => {
  const recommendations = [
    ['pages/windows.html', 'Clash Verge Rev'],
    ['pages/android.html', 'Clash Meta Android'],
    ['pages/ios-ipados.html', 'Shadowrocket'],
    ['pages/macos.html', 'Clash Verge Rev']
  ];

  for (const [file, name] of recommendations) {
    const html = await readFile(new URL(file, root), 'utf8');
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    assert.match(
      html,
      new RegExp(`<strong class="software-name">${escapedName}\\s*<span class="recommend-badge">推荐</span>\\s*</strong>`)
    );
  }
});

test('openwrt page is removed', async () => {
  await assert.rejects(() => stat(new URL('pages/openwrt.html', root)), /ENOENT/);
});

test('local guide pages are complete enough for publishing', async () => {
  const guides = [
    ['guides/windows-clash-verge.html', 'Clash Verge Rev', 'https://github.com/clash-verge-rev/clash-verge-rev/releases'],
    ['guides/windows-v2rayn.html', 'v2rayN', 'https://github.com/2dust/v2rayN/releases'],
    ['guides/android-clash-meta.html', 'Clash Meta Android', 'https://github.com/MetaCubeX/ClashMetaForAndroid/releases'],
    ['guides/android-v2rayng.html', 'v2rayNG', 'https://github.com/2dust/v2rayNG/releases'],
    ['guides/android-sing-box.html', 'Sing Box', 'https://github.com/SagerNet/sing-box/releases'],
    ['guides/macos-clash-verge.html', 'Clash Verge Rev', 'https://github.com/clash-verge-rev/clash-verge-rev/releases'],
    ['guides/macos-singbox.html', 'SingBox', 'https://apps.apple.com/us/app/sing-box-vt/id6673731168'],
    ['guides/macos-shadowrocket.html', 'Shadowrocket', 'https://apps.apple.com/us/app/shadowrocket/id932747118'],
    ['guides/ios-singbox.html', 'SingBox', 'https://apps.apple.com/us/app/sing-box-vt/id6673731168'],
    ['guides/ios-shadowrocket.html', 'Shadowrocket', 'https://apps.apple.com/us/app/shadowrocket/id932747118']
  ];

  for (const [file, title, download] of guides) {
    const html = await readFile(new URL(file, root), 'utf8');
    assert.match(html, new RegExp(title));
    assert.match(html, /id="quick-start"/);
    assert.match(html, /id="install"/);
    assert.match(html, /id="import"/);
    assert.match(html, /id="connect"/);
    assert.match(html, /id="troubleshooting"/);
    assert.match(html, /class="step-list"/);
    assert.match(html, new RegExp(download.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('local html links resolve to files in this static site', async () => {
  for (const file of await htmlFiles()) {
    const html = await readFile(file, 'utf8');
    const localLinks = [...html.matchAll(/href="([^"#][^"]*)"/g)]
      .map((match) => match[1])
      .filter((href) => !href.startsWith('http') && !href.startsWith('mailto:'));

    for (const href of localLinks) {
      const target = new URL(href, file);
      await stat(target);
    }
  }
});
