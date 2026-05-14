/**
 * Smart Auto Category Detection
 * Detects expense category based on keywords in title and description
 */

const CATEGORY_KEYWORDS = {
  Food: [
    'food', 'pizza', 'burger', 'restaurant', 'cafe', 'coffee', 'lunch', 'dinner',
    'breakfast', 'snack', 'grocery', 'groceries', 'eat', 'meal', 'kitchen',
    'donut', 'cake', 'bakery', 'sushi', 'chinese', 'indian', 'thai', 'mexican',
    'sandwich', 'salad', 'soup', 'ice cream', 'dessert', 'juice', 'smoothie',
    'starbucks', 'mcdonalds', "mcdonald's", 'kfc', 'subway', 'dominos', "domino's",
    'zomato', 'swiggy', 'food delivery', 'hotel', 'dining', 'bar', 'pub', 'tea',
    'taco', 'noodles', 'pasta', 'rice', 'chicken', 'fish', 'vegetables', 'fruits',
  ],
  Travel: [
    'uber', 'ola', 'lyft', 'taxi', 'cab', 'ride', 'bus', 'train', 'metro',
    'flight', 'airline', 'airport', 'hotel stay', 'hostel', 'airbnb', 'booking',
    'travel', 'trip', 'vacation', 'holiday', 'petrol', 'gas', 'fuel', 'parking',
    'toll', 'highway', 'transport', 'commute', 'ferry', 'boat', 'cruise',
    'rapido', 'auto', 'rickshaw', 'indigo', 'air india', 'spicejet', 'vistara',
    'makemytrip', 'goibibo', 'irctc', 'railway', 'bike rental', 'car rental',
  ],
  Rent: [
    'rent', 'lease', 'apartment', 'house rent', 'room rent', 'accommodation',
    'pg', 'hostel rent', 'landlord', 'tenant', 'deposit', 'housing', 'flat',
    'mortgage', 'property', 'maintenance', 'society', 'building',
  ],
  Utilities: [
    'electricity', 'electric', 'power bill', 'water bill', 'water', 'gas bill',
    'internet', 'broadband', 'wifi', 'phone bill', 'mobile recharge', 'recharge',
    'dth', 'cable', 'utility', 'bill', 'airtel', 'jio', 'vodafone', 'bsnl',
    'postpaid', 'prepaid', 'sewage', 'waste', 'municipality',
  ],
  Entertainment: [
    'netflix', 'spotify', 'youtube', 'prime', 'amazon prime', 'disney',
    'hotstar', 'hulu', 'hbo', 'cinema', 'movie', 'theatre', 'concert',
    'music', 'gaming', 'game', 'playstation', 'xbox', 'steam', 'subscription',
    'membership', 'show', 'event', 'festival', 'party', 'club', 'disco',
    'streaming', 'podcast', 'kindle', 'book', 'reading', 'zoo', 'museum',
    'amusement', 'adventure', 'sports ticket', 'match ticket',
  ],
  Shopping: [
    'shopping', 'amazon', 'flipkart', 'myntra', 'ajio', 'nykaa', 'meesho',
    'mall', 'store', 'clothes', 'clothing', 'fashion', 'shoes', 'shirt', 'dress',
    'accessories', 'bag', 'watch', 'jewellery', 'electronics', 'phone',
    'laptop', 'gadget', 'furniture', 'home decor', 'appliance', 'gift', 'order',
  ],
  Health: [
    'doctor', 'hospital', 'clinic', 'medical', 'medicine', 'pharmacy', 'chemist',
    'health', 'dental', 'dentist', 'gym', 'fitness', 'yoga', 'workout',
    'therapy', 'physiotherapy', 'lab test', 'blood test', 'scan', 'xray',
    'insurance', 'health insurance', 'vitamin', 'supplement', 'wellness',
    'ambulance', 'emergency', 'specialist', 'consultation',
  ],
  Education: [
    'school', 'college', 'university', 'tuition', 'course', 'class', 'training',
    'education', 'fees', 'fee', 'exam', 'certification', 'udemy', 'coursera',
    'edx', 'workshop', 'seminar', 'book', 'textbook', 'stationery', 'pen',
    'notebook', 'library', 'coaching', 'study material', 'scholarship',
  ],
  Marketing: [
    'marketing', 'advertisement', 'ad', 'promotion', 'campaign', 'seo',
    'social media', 'facebook ads', 'google ads', 'instagram', 'influencer',
    'branding', 'design', 'logo', 'printing', 'flyer', 'banner', 'pr',
    'public relations', 'email marketing', 'analytics', 'crm', 'software tool',
  ],
};

/**
 * Detect category from title and description text
 * @param {string} title - Expense title
 * @param {string} description - Expense description (optional)
 * @returns {string} - Detected category key
 */
export function detectCategory(title = '', description = '') {
  const text = `${title} ${description}`.toLowerCase().trim();

  if (!text) return 'Other';

  const scores = {};

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    for (const keyword of keywords) {
      if (text.includes(keyword.toLowerCase())) {
        // Longer keyword matches get higher score (more specific)
        score += keyword.length;
        // Exact word match gets bonus
        const wordRegex = new RegExp(`\\b${keyword.toLowerCase()}\\b`);
        if (wordRegex.test(text)) {
          score += keyword.length * 1.5;
        }
      }
    }
    if (score > 0) scores[category] = score;
  }

  if (Object.keys(scores).length === 0) return 'Other';

  // Return the category with the highest score
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
}

/**
 * Get confidence level for the detected category
 * @param {string} title
 * @param {string} description
 * @returns {{ category: string, confidence: 'high' | 'medium' | 'low' }}
 */
export function detectCategoryWithConfidence(title = '', description = '') {
  const text = `${title} ${description}`.toLowerCase().trim();
  const scores = {};

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    for (const keyword of keywords) {
      if (text.includes(keyword.toLowerCase())) {
        score += keyword.length;
        const wordRegex = new RegExp(`\\b${keyword.toLowerCase()}\\b`);
        if (wordRegex.test(text)) score += keyword.length * 1.5;
      }
    }
    if (score > 0) scores[category] = score;
  }

  if (Object.keys(scores).length === 0) return { category: 'Other', confidence: 'low' };

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const topScore = sorted[0][1];
  const confidence = topScore > 20 ? 'high' : topScore > 10 ? 'medium' : 'low';

  return { category: sorted[0][0], confidence };
}
