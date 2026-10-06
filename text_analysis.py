import re
from collections import Counter

WORD_PATTERN = re.compile(r"[A-Za-z]+(?:['-][A-Za-z]+)*")
VOWELS = set("aeiou")


def extract_words(text):
    """Return words using a simple regex that keeps apostrophes/hyphens inside words."""
    return WORD_PATTERN.findall(text)


def analyze_text(text):
    """Compute the core Task 6 text-analysis metrics."""
    words = extract_words(text)
    normalized = [word.lower() for word in words]

    word_counts = Counter(normalized)
    repeated = [
        {"word": word, "count": count}
        for word, count in sorted(word_counts.items(), key=lambda item: (-item[1], item[0]))
        if count > 1
    ]

    alphabetic_text = re.sub(r"[^A-Za-z]", "", text).lower()
    vowel_count = sum(char in VOWELS for char in alphabetic_text)
    consonant_count = sum(char.isalpha() and char not in VOWELS for char in alphabetic_text)

    top_words = [
        {"word": word, "count": count}
        for word, count in word_counts.most_common(8)
    ]

    unique_words = len(word_counts)
    longest_word = max(words, key=len) if words else ""

    return {
        "word_count": len(words),
        "character_count": len(text),
        "characters_no_spaces": len(re.sub(r"\s", "", text)),
        "vowel_count": vowel_count,
        "consonant_count": consonant_count,
        "unique_words": unique_words,
        "repeated_word_types": len(repeated),
        "longest_word": longest_word,
        "repeated_words": repeated,
        "top_words": top_words,
    }
