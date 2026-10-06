const textInput = document.getElementById('textInput');
const charLive = document.getElementById('charLive');
const analyzeBtn = document.getElementById('analyzeBtn');
const clearBtn = document.getElementById('clearBtn');
const sampleBtn = document.getElementById('sampleBtn');
const errorBox = document.getElementById('errorBox');
const analysisState = document.getElementById('analysisState');

const sampleText = `Natural language processing turns human language into structured information. Text analysis is a useful first step in NLP because repeated words, word frequency, vowels, and character counts reveal simple patterns. Simple tools can make text easier to measure, compare, and understand.`;

function setTextMetrics() {
  const n = textInput.value.length;
  charLive.textContent = `${n.toLocaleString()} chars`;
}

function number(id, value) {
  document.getElementById(id).textContent = Number(value).toLocaleString();
}

function renderRepeated(words) {
  const empty = document.getElementById('repeatedEmpty');
  const list = document.getElementById('repeatedList');
  list.innerHTML = '';

  if (!words.length) {
    empty.hidden = false;
    list.hidden = true;
    empty.textContent = 'No repeated words found. Every detected word appears once.';
    return;
  }

  empty.hidden = true;
  list.hidden = false;
  words.forEach(item => {
    const row = document.createElement('div');
    row.className = 'word-row';
    row.innerHTML = `<span class="word-name">${escapeHtml(item.word)}</span><span class="word-count">× ${item.count}</span>`;
    list.appendChild(row);
  });
}

function renderTopWords(words) {
  const container = document.getElementById('topWords');
  if (!words.length) {
    container.innerHTML = '<div class="empty-state">No words detected yet.</div>';
    return;
  }
  const max = words[0].count;
  container.innerHTML = words.map((item, index) => {
    const width = Math.round((item.count / max) * 100);
    return `
      <div class="freq-row">
        <span class="freq-rank">0${index + 1}</span>
        <div>
          <div class="freq-word">${escapeHtml(item.word)}</div>
          <div class="freq-bar"><div class="freq-fill" style="width:${width}%"></div></div>
        </div>
        <span class="freq-num">${item.count}</span>
      </div>`;
  }).join('');
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

async function analyze() {
  const text = textInput.value.trim();
  errorBox.hidden = true;

  if (!text) {
    errorBox.textContent = 'Please enter some text before analyzing.';
    errorBox.hidden = false;
    textInput.focus();
    return;
  }

  analyzeBtn.disabled = true;
  analyzeBtn.textContent = 'Analyzing…';
  analysisState.textContent = 'WORKING';

  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ text })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Analysis failed.');

    number('wordCount', result.word_count);
    number('characterCount', result.character_count);
    number('vowelCount', result.vowel_count);
    number('uniqueWords', result.unique_words);
    number('consonantCount', result.consonant_count);
    number('repeatedTypes', result.repeated_word_types);
    document.getElementById('longestWord').textContent = result.longest_word || '—';

    renderRepeated(result.repeated_words);
    renderTopWords(result.top_words);
    analysisState.textContent = 'UPDATED';
  } catch (error) {
    errorBox.textContent = error.message;
    errorBox.hidden = false;
    analysisState.textContent = 'ERROR';
  } finally {
    analyzeBtn.disabled = false;
    analyzeBtn.innerHTML = 'Analyze Text <span>→</span>';
  }
}

textInput.addEventListener('input', setTextMetrics);
analyzeBtn.addEventListener('click', analyze);

sampleBtn.addEventListener('click', () => {
  textInput.value = sampleText;
  setTextMetrics();
  analyze();
});

clearBtn.addEventListener('click', () => {
  textInput.value = '';
  setTextMetrics();
  ['wordCount','characterCount','vowelCount','uniqueWords','consonantCount','repeatedTypes'].forEach(id => document.getElementById(id).textContent = '—');
  document.getElementById('longestWord').textContent = '—';
  document.getElementById('repeatedList').innerHTML = '';
  document.getElementById('repeatedList').hidden = true;
  document.getElementById('repeatedEmpty').hidden = false;
  document.getElementById('repeatedEmpty').textContent = 'Analyze some text to see repeated words here.';
  document.getElementById('topWords').innerHTML = '<div class="empty-state">Your frequency snapshot will appear after analysis.</div>';
  analysisState.textContent = 'READY';
  errorBox.hidden = true;
  textInput.focus();
});

setTextMetrics();
