export const beautifyText = (text: string) => {
  const sentences = text.split(/\s*[.]\s+/);
  return sentences
    .map(
      (sentence, index) =>
        `${sentence.charAt(0).toUpperCase()}${sentence.slice(1)}${
          index !== sentences.length - 1 ? "." : ""
        }`
    )
    .join(" ")
    .replaceAll(/\s+[.]\s+/g, "")
    .replaceAll(/-\s+/g, "");
};

export const extractExcerpt = (text: string, keywords: string[]) => {
  const words = text.split(/\s+/);

  // Convert the keywords to a keywords map for fast lookup
  const keywordMap = new Map();
  for (const keyword of keywords) {
    keywordMap.set(keyword.toLowerCase(), true);
  }

  // Loop through the words and check if each one is a keyword
  const highlights = [];
  for (const word of words) {
    if (keywordMap.has(word)) {
      highlights.push(word);
    }
  }

  // If we found any highlights, extract the excerpt from the original text
  if (highlights.length > 0) {
    const excerptWords = [];
    let startIndex = -1;

    for (let i = 0; i < words.length; i++) {
      if (highlights.includes(words[i])) {
        if (startIndex === -1) startIndex = i > 0 ? i - 1 : 0;
      }
    }

    // Extract the excerpt from the original text
    if (startIndex !== 0) excerptWords.push("...");
    for (let i = startIndex; i <= words.length; i++) {
      excerptWords.push(words[i]);
    }

    return excerptWords.join(" ");
  }

  return text;
};
