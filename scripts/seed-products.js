// One-time script to seed your Supabase "products" table with a broader,
// emotionally-tagged catalog: handbags, ethnic wear, jewelry, chocolate
// hampers, festival gifts, and more — so the marketplace has real variety
// while you onboard creators.
//
// Run with:  node scripts/seed-products.js
//
// It reads NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY from
// your existing .env.local, so no extra setup is needed.

const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

// --- Load .env.local manually (this script runs outside Next.js) ---
function loadEnvLocal() {
  const envPath = path.join(__dirname, '..', '.env.local')
  if (!fs.existsSync(envPath)) {
    console.error('Could not find .env.local at', envPath)
    process.exit(1)
  }
  const lines = fs.readFileSync(envPath, 'utf8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '')
    if (!process.env[key]) process.env[key] = value
  }
}
loadEnvLocal()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// creator_id is left null — these are placeholder listings until real
// creators claim/replace them, same as the existing API already supports.
const PRODUCTS = [
  {
    name: 'Hand-embroidered sling purse',
    description: 'A compact sling bag with hand-embroidered floral thread work, made by artisans in Lucknow. Fully lined, adjustable strap.',
    base_price: 1150, category: 'Handbags & Purses', lead_time_days: 6,
    emotion_tags: ['pride', 'self-care'], occasion_tags: ['birthday', 'housewarming'], recipient_tags: ['sister', 'best friend'],
    images: [], product_type: 'handmade',
  },
  {
    name: 'Hand-tooled leather tote bag',
    description: 'Full-grain leather tote with hand-tooled botanical patterns, roomy enough for daily use. Ages beautifully over time.',
    base_price: 2400, category: 'Handbags & Purses', lead_time_days: 8,
    emotion_tags: ['achievement', 'pride'], occasion_tags: ['graduation', 'anniversary'], recipient_tags: ['partner', 'colleague'],
    images: [], product_type: 'handmade',
  },
  {
    name: 'Hand block-printed designer kurta',
    description: 'Cotton kurta with traditional Rajasthani block printing, tailored to size. Comfortable for festive or everyday wear.',
    base_price: 1850, category: 'Ethnic Wear (Kurta, Tops, Dresses)', lead_time_days: 7,
    emotion_tags: ['celebration', 'nostalgia'], occasion_tags: ['diwali', 'wedding'], recipient_tags: ['mother', 'father'],
    images: [], product_type: 'handmade',
  },
  {
    name: 'Hand-embroidered ethnic top',
    description: 'Chikankari-embroidered top in soft cotton, made by artisans in Lucknow. Pairs well with jeans or ethnic bottoms.',
    base_price: 1290, category: 'Ethnic Wear (Kurta, Tops, Dresses)', lead_time_days: 6,
    emotion_tags: ['love', 'celebration'], occasion_tags: ['birthday', 'karva-chauth'], recipient_tags: ['partner', 'sister'],
    images: [], product_type: 'handmade',
  },
  {
    name: 'Hand-dyed bandhani dress',
    description: 'Traditional bandhani tie-dye dress in vibrant colours, hand-dyed in Gujarat using age-old techniques.',
    base_price: 2100, category: 'Ethnic Wear (Kurta, Tops, Dresses)', lead_time_days: 9,
    emotion_tags: ['celebration', 'pride'], occasion_tags: ['wedding', 'diwali'], recipient_tags: ['sister', 'best friend'],
    images: [], product_type: 'handmade',
  },
  {
    name: 'Oxidised silver jhumka earrings',
    description: 'Handcrafted oxidised silver jhumkas with a delicate bell finish, made by silversmiths in Jodhpur.',
    base_price: 650, category: 'Jewelry (Earrings & Bangles)', lead_time_days: 3,
    emotion_tags: ['love', 'pride'], occasion_tags: ['birthday', 'karva-chauth'], recipient_tags: ['mother', 'sister', 'partner'],
    images: [], product_type: 'handmade',
  },
  {
    name: 'Hand-painted lac bangles (set of 6)',
    description: 'Traditional lac bangles hand-painted with intricate motifs, a Rajasthani craft passed down generations.',
    base_price: 480, category: 'Jewelry (Earrings & Bangles)', lead_time_days: 4,
    emotion_tags: ['celebration', 'nostalgia'], occasion_tags: ['rakhi', 'wedding', 'diwali'], recipient_tags: ['sister', 'mother'],
    images: [], product_type: 'handmade',
  },
  {
    name: 'Kundan drop earrings',
    description: 'Kundan-set drop earrings with a pearl finish, handcrafted by jewellers in Jaipur for festive occasions.',
    base_price: 890, category: 'Jewelry (Earrings & Bangles)', lead_time_days: 5,
    emotion_tags: ['love', 'celebration'], occasion_tags: ['wedding', 'anniversary'], recipient_tags: ['partner', 'mother'],
    images: [], product_type: 'handmade',
  },
  {
    name: 'Assorted handmade chocolate hamper',
    description: 'A curated box of small-batch chocolates — dark, milk, and filled truffles — made fresh to order in Mumbai.',
    base_price: 899, category: 'Chocolate & Gift Hampers', lead_time_days: 2,
    emotion_tags: ['gratitude', 'celebration'], occasion_tags: ['birthday', 'diwali', 'new-year'], recipient_tags: ['colleague', 'best friend'],
    images: [], product_type: 'handmade',
  },
  {
    name: 'Diwali festive gift box',
    description: 'A traditional Diwali hamper with dry fruits, handmade sweets, a diya, and a personalised card — ready for gifting.',
    base_price: 1299, category: 'Indian Festival Gifts', lead_time_days: 4,
    emotion_tags: ['celebration', 'gratitude'], occasion_tags: ['diwali'], recipient_tags: ['colleague', 'grandparent', 'mother'],
    images: [], product_type: 'handmade',
  },
  {
    name: 'Rakhi gift combo with sweets',
    description: 'A set of two handcrafted rakhis paired with a small box of traditional sweets, for a memorable Raksha Bandhan.',
    base_price: 549, category: 'Indian Festival Gifts', lead_time_days: 3,
    emotion_tags: ['love', 'nostalgia'], occasion_tags: ['rakhi'], recipient_tags: ['brother', 'sister'],
    images: [], product_type: 'handmade',
  },
  {
    name: 'Eid mubarak dry fruit hamper',
    description: 'An elegant hamper of premium dry fruits and dates, packaged for Eid gifting to family and friends.',
    base_price: 999, category: 'Indian Festival Gifts', lead_time_days: 3,
    emotion_tags: ['gratitude', 'celebration'], occasion_tags: ['eid'], recipient_tags: ['grandparent', 'colleague'],
    images: [], product_type: 'handmade',
  },
  {
    name: 'Hand-poured lavender soy candle',
    description: 'Made with 100% natural soy wax and essential oils, hand-poured in small batches. Burns 40-50 hours.',
    base_price: 480, category: 'Candles & Fragrance', lead_time_days: 5,
    emotion_tags: ['celebration', 'self-care'], occasion_tags: ['birthday', 'housewarming'], recipient_tags: ['myself', 'best friend'],
    images: [], product_type: 'handmade',
  },
  {
    name: 'Resin keepsake memory box',
    description: 'A handcrafted resin box embedding pressed flowers, perfect for keeping small mementos and letters.',
    base_price: 890, category: 'Personalised Keepsakes', lead_time_days: 7,
    emotion_tags: ['love', 'nostalgia'], occasion_tags: ['anniversary', 'wedding'], recipient_tags: ['partner', 'grandparent'],
    images: [], product_type: 'handmade',
  },
  {
    name: 'Personalised name-initial pendant',
    description: 'A minimal sterling silver pendant engraved with an initial or short word, made to order.',
    base_price: 720, category: 'Personalised Keepsakes', lead_time_days: 5,
    emotion_tags: ['love', 'pride'], occasion_tags: ['birthday', 'graduation'], recipient_tags: ['myself', 'partner'],
    images: [], product_type: 'handmade',
  },
  {
    name: 'Handwoven macramé wall hanging',
    description: 'A boho-style macramé wall hanging, handwoven with natural cotton cord — adds warmth to any room.',
    base_price: 1200, category: 'Home Decor', lead_time_days: 6,
    emotion_tags: ['gratitude', 'new beginnings'], occasion_tags: ['housewarming', 'wedding'], recipient_tags: ['best friend', 'sister'],
    images: [], product_type: 'handmade',
  },
  {
    name: 'Hand-painted terracotta planter',
    description: 'A hand-thrown terracotta planter with folk-art hand-painted detailing, made by potters in West Bengal.',
    base_price: 620, category: 'Home Decor', lead_time_days: 5,
    emotion_tags: ['new beginnings', 'comfort'], occasion_tags: ['housewarming'], recipient_tags: ['colleague', 'myself'],
    images: [], product_type: 'handmade',
  },
  {
    name: 'Custom watercolour portrait',
    description: 'A hand-painted watercolour portrait from your photo, made by an independent illustrator — a one-of-a-kind keepsake.',
    base_price: 1500, category: 'Art & Craft', lead_time_days: 10,
    emotion_tags: ['love', 'nostalgia', 'grief'], occasion_tags: ['anniversary', 'birthday'], recipient_tags: ['partner', 'grandparent'],
    images: [], product_type: 'handmade',
  },
]

async function seed() {
  console.log(`Seeding ${PRODUCTS.length} products into Supabase...\n`)
  let success = 0, failed = 0

  for (const product of PRODUCTS) {
    const { error } = await supabase
      .from('products')
      .insert([{ ...product, creator_id: null, is_published: true }])

    if (error) {
      console.error(`✗ ${product.name} — ${error.message}`)
      failed++
    } else {
      console.log(`✓ ${product.name}`)
      success++
    }
  }

  console.log(`\nDone. ${success} inserted, ${failed} failed.`)
  if (failed > 0) {
    console.log('\nIf inserts failed due to Row Level Security, add a policy allowing')
    console.log('inserts on the "products" table for the anon role, or run this with')
    console.log('a service role key instead of the anon key.')
  }
}

seed()
