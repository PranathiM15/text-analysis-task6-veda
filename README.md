# TextLab 06 — Text Analysis Web App

A terminal-friendly Python web application for Veda Technology **Task 6: Text Analysis**.

## Task covered

The application analyzes a given text and calculates:

- Word count
- Character count
- Vowel count
- Repeated-word analysis

It also shows a few useful supporting metrics: unique words, consonants, longest word, and the most common words.

## Tools used

- Python
- Python standard library (`http.server`, `re`, `collections`, `json`)
- HTML, CSS, JavaScript for the browser interface

**Jupyter Notebook is not required.** The project runs completely from the terminal with Python.

## Project structure

```text
text-analysis-task6-veda/
├── app.py
├── text_analysis.py
├── README.md
├── .gitignore
├── run.bat
├── templates/
│   └── index.html
└── static/
    ├── styles.css
    └── script.js
```

## Run in Windows Terminal / PowerShell

Open PowerShell in the project folder and run:

```powershell
py app.py
```

Then open:

`http://127.0.0.1:8000`

To stop the server:

```text
Ctrl + C
```

No `pip install` command is needed because the app uses only Python's standard library.

## How the analysis works

Words are extracted with a small regex so punctuation does not become a word. Word matching is case-insensitive. A `Counter` stores word frequencies and repeated words are the entries whose frequency is greater than one.

Character count uses the full entered text, while vowel and consonant counts use alphabetic characters only.

## GitHub submission

Recommended repository name:

`text-analysis-task6-veda`

Suggested remote:

`https://github.com/PranathiM15/text-analysis-task6-veda.git`

## Submission checklist

- [ ] Run the web app successfully.
- [ ] Test the sample text and one custom paragraph.
- [ ] Take screenshots of the completed web app.
- [ ] Push the entire project folder to a **public** GitHub repository.
- [ ] Confirm the README is visible on GitHub.
- [ ] Share the completed project on LinkedIn, as required by the task.
