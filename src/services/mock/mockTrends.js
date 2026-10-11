import { clean, delay, lower, shuffle } from '../../lib/utils'

function trendTemplates(biz, aud) {
  return [
    {
      kind: 'Trending format',
      title: 'Behind-the-scenes content is winning on short-form video',
      summary: `Audiences reward brands that show how things really get made. A quick look inside your ${biz} builds trust.`,
      hook: `Show how your ${biz} works day to day. People trust what they can see.`,
      tag: '#BehindTheScenes',
      suggestedTopic: `A behind-the-scenes look at our ${biz}`,
    },
    {
      kind: 'Trending format',
      title: '"Day in the life" posts are spiking for small brands',
      summary: 'Routine-style storytelling keeps viewers watching and invites comments from people with similar days.',
      hook: `Walk ${aud} through a real day, from first task to last.`,
      tag: '#DayInTheLife',
      suggestedTopic: `A day in the life at our ${biz}`,
    },
    {
      kind: 'Viral hook',
      title: '"Nobody tells you this about..." openers drive saves and shares',
      summary: 'Curiosity-gap hooks that promise an insider truth are earning above-average saves.',
      hook: `Nobody tells ${aud} this about choosing a ${biz}.`,
      tag: '#InsiderTips',
      suggestedTopic: `What nobody tells you about choosing a ${biz}`,
    },
    {
      kind: 'Industry news',
      title: `Customer stories are building the most trust with ${aud}`,
      summary: 'User-generated content and short testimonials outperform polished ads for local and niche businesses.',
      hook: 'Turn a happy customer into your best post this week.',
      tag: '#CustomerStories',
      suggestedTopic: 'A customer success story',
    },
    {
      kind: 'Viral hook',
      title: 'Myth-busting posts are being widely shared',
      summary: `Posts that challenge a common belief in the ${biz} space spark debate, and debate drives reach.`,
      hook: `Bust a myth that ${aud} still believe.`,
      tag: '#MythBusting',
      suggestedTopic: `3 myths about ${biz} businesses, busted`,
    },
    {
      kind: 'Industry news',
      title: 'Local and seasonal moments are boosting reach',
      summary: 'Tying posts to the season, a local event or a holiday helps small brands show up in more feeds.',
      hook: 'Connect your offer to something your community is already talking about.',
      tag: '#SupportLocal',
      suggestedTopic: 'Our seasonal special',
    },
    {
      kind: 'Trending format',
      title: 'Quick-tip carousels that people save and reuse',
      summary: `Short, practical lists are among the most saved formats, and ${aud} love a good cheat sheet.`,
      hook: `Give ${aud} three tips they can use today.`,
      tag: '#QuickTips',
      suggestedTopic: `3 quick tips for ${aud}`,
    },
    {
      kind: 'Trending format',
      title: 'Polls and "this or that" posts spark easy engagement',
      summary: 'Low-effort interactions boost comments and signal to the algorithm that your post matters.',
      hook: 'Ask your audience to pick a side.',
      tag: '#CommunityFirst',
      suggestedTopic: 'This or that: our community picks',
    },
  ]
}

/** Simulates a web search for trends related to the business. */
export async function mockFetchTrends({ businessType, audience }) {
  await delay(700 + Math.random() * 600)
  const biz = lower(clean(businessType))
  const aud = lower(clean(audience))
  return shuffle(trendTemplates(biz, aud))
    .slice(0, 5)
    .map((trend, index) => ({
      ...trend,
      id: `mock-${Date.now()}-${index}`,
      source: 'Simulated trend data',
      url: '',
    }))
}
