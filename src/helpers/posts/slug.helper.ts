import slugify from 'slugify';

export const makeSlug = (string: string): string =>
  slugify(removeStopWords(string), { lower: true, strict: true });

const removeStopWords = (headline: string) => {
  const expStr = stopWords.join('|');
  return headline.replace(new RegExp('\\b(' + expStr + ')\\b', 'gi'), '');
};

const stopWords = [
  'a',
  'about',
  'above',
  'after',
  'again',
  'against',
  'all',
  'am',
  'an',
  'and',
  'any',
  'are',
  'as',
  'at',
  'be',
  'because',
  'been',
  'before',
  'being',
  'below',
  'between',
  'both',
  'but',
  'by',
  'could',
  'did',
  'do',
  'does',
  'doing',
  'down',
  'during',
  'each',
  'few',
  'for',
  'from',
  'further',
  'had',
  'has',
  'have',
  'having',
  'he',
  "he'd",
  "he'll",
  "he's",
  'her',
  'here',
  "here's",
  'hers',
  'herself',
  'him',
  'himself',
  'his',
  'how',
  "how's",
  'i',
  "i'd",
  "i'll",
  "i'm",
  "i've",
  'if',
  'in',
  'into',
  'is',
  'it',
  "it's",
  'its',
  'itself',
  "let's",
  'me',
  'my',
  'myself',
  'nor',
  'of',
  'on',
  'once',
  'only',
  'or',
  'other',
  'ought',
  'our',
  'ours',
  'ourselves',
  'out',
  'own',
  'same',
  'she',
  "she'd",
  "she'll",
  "she's",
  'should',
  'so',
  'some',
  'such',
  'than',
  'that',
  "that's",
  'the',
  'their',
  'theirs',
  'them',
  'themselves',
  'then',
  'there',
  "there's",
  'these',
  'they',
  "they'd",
  "they'll",
  "they're",
  "they've",
  'this',
  'those',
  'through',
  'to',
  'too',
  'under',
  'until',
  'up',
  'very',
  'was',
  'we',
  "we'd",
  "we'll",
  "we're",
  "we've",
  'were',
  'what',
  "what's",
  'when',
  "when's",
  'which',
  'while',
  'who',
  "who's",
  'whom',
  "why's",
  'with',
  'would',
  'you',
  "you'd",
  "you'll",
  "you're",
  "you've",
  'your',
  'yours',
  'yourself',
  'yourselves',
];
