import os
import re
import requests
import io
import pdfminer.high_level

# Replace YOUR_API_KEY with your actual API key
API_KEY = "YOUR_API_KEY"

# Replace 'en' with the source language and 'fr' and 'fi' with the target languages
# You can specify multiple target languages by separating them with a comma (e.g. 'fr,fi')
LANGUAGES = 'en-fr,en-fi'

def translate_text(text, languages):
    """Translates the text using the Google Translate API"""
    data = {
        "q": text,
        "target": languages,
        "format": "text"
    }
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    response = requests.post("https://translation.googleapis.com/language/translate/v2", json=data, headers=headers)
    if response.status_code != 200:
        raise Exception(f"Error: {response.text}")
    return response.json()["data"]["translations"][0]["translatedText"]

def get_text_from_pdf(filename):
    """Extracts text from a PDF file"""
    with open(filename, 'rb') as f:
        return pdfminer.high_level.extract_text(f)

def translate_pdfs_in_folder(folder):
    """Translates all PDF files in a folder and saves the translations as plain text files"""
    for filename in os.listdir(folder):
        if filename.endswith(".pdf"):
            pdf_text = get_text_from_pdf(os.path.join(folder, filename))
            translations = translate_text(pdf_text, LANGUAGES)
            # Save the translations to separate files
            for language, translation in translations.items():
                language_code = re.match(r"en-(\w+)", language).group(1)
                with open(f"{filename}_{language_code}.txt", 'w', encoding='utf-8') as f:
                    f.write(translation)

# Translate all PDF files in the current working directory
translate_pdfs_in_folder(os.getcwd())