// Shared taxonomy used across the marketplace, creator dashboard, and homepage.
// Keeping this in one place means the filter chips a buyer sees always match
// what a creator can actually tag their product with.

export const CATEGORIES = [
  { value: 'candles-fragrance', label: 'Candles & Fragrance', icon: '🕯️' },
  { value: 'handbags-purses', label: 'Handbags & Purses', icon: '👜' },
  { value: 'ethnic-wear', label: 'Ethnic Wear (Kurta, Tops, Dresses)', icon: '🥻' },
  { value: 'jewelry', label: 'Jewelry (Earrings & Bangles)', icon: '💍' },
  { value: 'chocolate-hampers', label: 'Chocolate & Gift Hampers', icon: '🍫' },
  { value: 'festival-gifts', label: 'Indian Festival Gifts', icon: '🪔' },
  { value: 'home-decor', label: 'Home Decor', icon: '🏺' },
  { value: 'art-craft', label: 'Art & Craft', icon: '🎨' },
  { value: 'keepsakes', label: 'Personalised Keepsakes', icon: '💝' },
  { value: 'general', label: 'Something Else', icon: '🎁' },
]

export const EMOTIONS = [
  'love', 'grief', 'celebration', 'gratitude', 'nostalgia',
  'friendship', 'apology', 'new beginnings', 'self-care',
  'pride', 'comfort', 'achievement',
]

export const OCCASIONS = [
  { value: 'birthday', label: 'Birthday' },
  { value: 'anniversary', label: 'Anniversary' },
  { value: 'wedding', label: 'Wedding' },
  { value: 'babyshower', label: 'Baby Shower' },
  { value: 'graduation', label: 'Graduation' },
  { value: 'housewarming', label: 'Housewarming' },
  { value: 'diwali', label: 'Diwali' },
  { value: 'rakhi', label: 'Raksha Bandhan' },
  { value: 'karva-chauth', label: 'Karva Chauth' },
  { value: 'eid', label: 'Eid' },
  { value: 'christmas', label: 'Christmas' },
  { value: 'new-year', label: 'New Year' },
]

export const RECIPIENTS = [
  { value: 'mother', label: 'Mother', icon: '👩' },
  { value: 'father', label: 'Father', icon: '👨' },
  { value: 'sister', label: 'Sister', icon: '👧' },
  { value: 'brother', label: 'Brother', icon: '👦' },
  { value: 'partner', label: 'Partner', icon: '💑' },
  { value: 'best friend', label: 'Best Friend', icon: '🤝' },
  { value: 'colleague', label: 'Colleague', icon: '💼' },
  { value: 'grandparent', label: 'Grandparent', icon: '👵' },
  { value: 'myself', label: 'Myself', icon: '🪞' },
]

export function categoryLabel(value) {
  return CATEGORIES.find(c => c.value === value)?.label || value
}

export function categoryIcon(value) {
  return CATEGORIES.find(c => c.value === value)?.icon || '🎁'
}
