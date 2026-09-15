import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Derive __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base domain configuration - reads environment variable or defaults to production domain
const BASE_URL = (
  process.env.APP_URL ||
  process.env.VITE_APP_URL ||
  process.env.SITE_URL ||
  'https://hoteludikapalace.com'
).replace(/\/+$/, '');

interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

interface ItemData {
  id: string;
  name: string;
  category?: string;
  updatedAt?: string;
}

async function loadData() {
  // Read mockData.ts as fallback or primary data source
  const mockDataPath = path.resolve(__dirname, '../src/lib/mockData.ts');
  const mockDataContent = fs.readFileSync(mockDataPath, 'utf-8');

  // Extract rooms
  const rooms: ItemData[] = [];
  const roomRegex = /id:\s*['"]([^'"]+)['"],\s*name:\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = roomRegex.exec(mockDataContent)) !== null) {
    if (match[1].startsWith('room-')) {
      rooms.push({ id: match[1], name: match[2] });
    }
  }

  // Extract banquet halls
  const banquets: ItemData[] = [];
  const banquetRegex = /id:\s*['"](banquet-[^'"]+)['"],\s*name:\s*['"]([^'"]+)['"]/g;
  while ((match = banquetRegex.exec(mockDataContent)) !== null) {
    banquets.push({ id: match[1], name: match[2] });
  }

  // Extract restaurant menu categories
  const menuCategories = [
    'soups-starters',
    'main-course',
    'biryani-rice',
    'chinese-tandoor',
    'breads',
    'desserts-beverages'
  ];

  return {
    rooms,
    banquets,
    menuCategories,
  };
}

export async function generateSitemapXml(): Promise<string> {
  const currentDate = new Date().toISOString().split('T')[0];
  const { rooms, banquets, menuCategories } = await loadData();

  const entries: SitemapEntry[] = [
    // 1. Primary Pages & Sections
    {
      loc: `${BASE_URL}/`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 1.0,
    },
    {
      loc: `${BASE_URL}/#rooms`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 0.9,
    },
    {
      loc: `${BASE_URL}/#restaurant`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 0.9,
    },
    {
      loc: `${BASE_URL}/#banquets`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.9,
    },
    {
      loc: `${BASE_URL}/#gallery`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.8,
    },
    {
      loc: `${BASE_URL}/#explore`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.8,
    },
    {
      loc: `${BASE_URL}/#contact`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.8,
    },
  ];

  // 2. Individual Room & Suite Entries for Search Engines
  rooms.forEach((room) => {
    entries.push({
      loc: `${BASE_URL}/#room-${room.id}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.85,
    });
  });

  // 3. Restaurant Menu Sections & Culinary Offerings
  menuCategories.forEach((cat) => {
    entries.push({
      loc: `${BASE_URL}/#restaurant-menu-${cat}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.8,
    });
  });

  // 4. Banquets, Celebrations & Event Venues
  banquets.forEach((banquet) => {
    entries.push({
      loc: `${BASE_URL}/#banquet-${banquet.id}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.85,
    });
  });

  // Build standard valid XML Sitemap format conforming to sitemaps.org schema
  const xmlLines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ];

  entries.forEach((entry) => {
    xmlLines.push('  <url>');
    xmlLines.push(`    <loc>${escapeXml(entry.loc)}</loc>`);
    xmlLines.push(`    <lastmod>${entry.lastmod}</lastmod>`);
    xmlLines.push(`    <changefreq>${entry.changefreq}</changefreq>`);
    xmlLines.push(`    <priority>${entry.priority.toFixed(2)}</priority>`);
    xmlLines.push('  </url>');
  });

  xmlLines.push('</urlset>');
  return xmlLines.join('\n');
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

// Main execution function
async function run() {
  try {
    const xml = await generateSitemapXml();

    // 1. Write to public/sitemap.xml so Vite bundles it into dist during build
    const publicDir = path.resolve(__dirname, '../public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    const publicPath = path.join(publicDir, 'sitemap.xml');
    fs.writeFileSync(publicPath, xml, 'utf-8');
    console.log(`✓ Generated public sitemap: ${publicPath}`);

    // 2. Also write to dist/sitemap.xml if dist directory exists
    const distDir = path.resolve(__dirname, '../dist');
    if (fs.existsSync(distDir)) {
      const distPath = path.join(distDir, 'sitemap.xml');
      fs.writeFileSync(distPath, xml, 'utf-8');
      console.log(`✓ Synchronized dist sitemap: ${distPath}`);
    }

    // 3. Create or update robots.txt linking to the sitemap
    const robotsTxtContent = [
      'User-agent: *',
      'Allow: /',
      '',
      `Sitemap: ${BASE_URL}/sitemap.xml`,
    ].join('\n');

    fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxtContent, 'utf-8');
    if (fs.existsSync(distDir)) {
      fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxtContent, 'utf-8');
    }
    console.log(`✓ Updated robots.txt with sitemap reference.`);

    console.log('Successfully generated dynamic sitemap.xml for Hotel Udika Palace.');
  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
}

// Auto-run if executed directly
run();
