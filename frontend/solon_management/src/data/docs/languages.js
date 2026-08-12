export const docLanguages = [
  {
    code: 'en',
    name: 'English',
    native: 'English',
    tagline: 'Read the full guide in English.',
  },
  {
    code: 'hi',
    name: 'Hindi',
    native: 'हिंदी',
    tagline: 'पूरी गाइड हिंदी में पढ़ें।',
  },
  {
    code: 'mr',
    name: 'Marathi',
    native: 'मराठी',
    tagline: 'संपूर्ण मार्गदर्शिका मराठीत वाचा.',
  },
]

export function getDocLanguage(code) {
  return docLanguages.find((language) => language.code === code)
}
