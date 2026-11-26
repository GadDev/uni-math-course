"""Rebuild the original English challenge questions, without solutions.

Run from the repository root with Python 3 and ReportLab installed:
    python3 scripts/build-chapter-03-challenge-en.py

The reviewed source is scripts/data/chapter-03-challenges-en.json. This tool
does not read or modify the server-graded exercise banks or solution PDFs.
PDF streams are deliberately uncompressed so the Node content test can check
the actual question text without adding a PDF parser to the application.
"""

import json
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import simpleSplit
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "scripts/data/chapter-03-challenges-en.json"
OUTPUT = ROOT / "public/pdfs/exercises/chapter-03-challenge-exercises-en.pdf"
BLUE = colors.HexColor("#1455C0")
INK = colors.HexColor("#17212B")
GRAY = colors.HexColor("#5A6570")
WIDTH, HEIGHT = A4
LEFT, RIGHT = 48, WIDTH - 48
TITLES = {
    "L37": "Functions, domains and graphs",
    "L38": "Secants, derivatives and tangents",
    "L39": "Differentiation rules",
    "L40": "The exponential function",
    "L41": "The natural logarithm",
    "L42": "Logarithmic bases and computing",
}


def plain(text):
    # Preserve the existing caret/underscore notation and use an unambiguous
    # printable apostrophe for the derivative. The notation key explains it.
    return text.replace("\u2019", "'")


def build():
    data = json.loads(SOURCE.read_text())
    assert len(data["exams"]) == 3
    ids = [q["id"] for exam in data["exams"] for q in exam["questions"]]
    assert len(ids) == len(set(ids)) == 72
    doc = canvas.Canvas(str(OUTPUT), pagesize=A4, pageCompression=0, invariant=1)
    doc.setTitle("Chapter 3 - English challenge questions")
    doc.setAuthor("Uni Math Course - original independent practice")
    doc.setSubject("72 original questions; three practice papers; no worked answers")
    page_number = 0

    def line(text, x, y, size=10, bold=False, color=INK):
        doc.setFillColor(color)
        doc.setFont("Helvetica-Bold" if bold else "Helvetica", size)
        doc.drawString(x, y, plain(text))

    def paragraph(text, y, size=11, width=RIGHT - LEFT, leading=17):
        for row in simpleSplit(plain(text), "Helvetica", size, width):
            line(row, LEFT, y, size)
            y -= leading
        return y

    def page(label):
        nonlocal page_number
        page_number += 1
        doc.setFillColor(BLUE)
        doc.rect(LEFT, HEIGHT - 55, 5, 22, fill=1, stroke=0)
        line("CHAPTER 03 / FUNCTIONS", LEFT + 15, HEIGHT - 44, 9, True)
        doc.setFont("Helvetica", 8)
        doc.setFillColor(GRAY)
        doc.drawRightString(RIGHT, HEIGHT - 44, label)
        doc.setStrokeColor(colors.HexColor("#CAD0D6"))
        doc.line(LEFT, 39, RIGHT, 39)
        line("UNI MATH COURSE | ORIGINAL, UNOFFICIAL PRACTICE | EN", LEFT, 25, 7, color=GRAY)
        doc.setFont("Helvetica", 8)
        doc.drawRightString(RIGHT, 25, f"{page_number:03d}")

    page("CHALLENGE QUESTIONS")
    line("FUNCTIONS", LEFT, HEIGHT - 145, 34, True)
    line("Challenge questions", LEFT, HEIGHT - 184, 23, True)
    y = paragraph("72 questions selected from the original 600-exercise workbook.", HEIGHT - 235, 13)
    y = paragraph("Three practice papers. Six lessons. Space to show your reasoning.", y - 13, 12)
    for i, (value, label) in enumerate([(72, "questions"), (80, "suggested minutes per paper"), (48, "marks per paper")]):
        top = y - 65 - i * 62
        line(str(value), LEFT, top, 25, True, BLUE)
        line(label, LEFT + 66, top + 2, 11)
    paragraph("Original, independent and unofficial exercises. No university affiliation or endorsement is claimed. The suggested timing and marks are practice conventions, not official examination rules.", 215, 10)
    line("Name: __________________________   Date: __________________", LEFT, 105, 11)
    doc.showPage()

    page("HOW TO USE THIS BOOKLET")
    line("Practise, then check your reasoning", LEFT, HEIGHT - 100, 21, True)
    y = HEIGHT - 145
    for title, body in [
        ("1. Choose a paper", "Each paper contains 24 original problems: four per lesson, in the same order and with the same IDs as the published challenge solutions."),
        ("2. Write your working", "State domains and assumptions. Show the main calculation and check the result. Use the writing lines below each question."),
        ("3. Use the practice marks", "Each problem is worth 2 practice marks: 1 for a relevant method and 1 for a correct result with the requested domain or justification. Total: 48."),
        ("4. Compare only after trying", "Use the separate English challenge-solutions booklet. Match the item ID, locate the first different step, then retry later without the solution."),
        ("5. Choose your study conditions", "For a realistic rehearsal, follow the actual examination rules given by your professor. This booklet does not establish a calculator, notes or timing policy."),
    ]:
        line(title, LEFT, y, 12, True, BLUE)
        y = paragraph(body, y - 23) - 27
    line("Notation", LEFT, y, 13, True)
    paragraph("x^2 means x squared; e^(...) means an exponential with the entire parenthesized exponent; log_a(x) means logarithm to base a; f'(x) means the derivative of f. A graph point is written (input, output).", y - 25, 10)
    doc.showPage()

    page("PROGRESS RECORD")
    line("Six lessons, three attempts", LEFT, HEIGHT - 100, 24, True)
    paragraph("Record a score after checking. Use the space below to choose one fresh task to retry.", HEIGHT - 135)
    y = HEIGHT - 200
    for label, x in [("Lesson", LEFT), ("Paper 1 /8", 275), ("Paper 2 /8", 355), ("Paper 3 /8", 435)]:
        line(label, x, y, 10, True)
    for lesson, title in TITLES.items():
        y -= 59
        line(lesson, LEFT, y, 11, True, BLUE)
        line(title, LEFT, y - 17, 9)
        for x in [275, 355, 435]:
            line("________", x, y, 10)
    y -= 75
    line("Total /48:    Paper 1 ______    Paper 2 ______    Paper 3 ______", LEFT, y, 11, True)
    paragraph("My next revision task and item ID:", y - 55)
    doc.setStrokeColor(colors.HexColor("#CAD0D6"))
    for dy in [88, 116, 144]:
        doc.line(LEFT, y - dy, RIGHT, y - dy)
    doc.showPage()

    page("CONTENTS")
    line("Find a paper or lesson", LEFT, HEIGHT - 100, 24, True)
    y = HEIGHT - 155
    for exam in data["exams"]:
        number = exam["number"]
        start = 5 + (number - 1) * 6
        line(f"PAPER {number} / 24 QUESTIONS / 48 MARKS", LEFT, y, 12, True, BLUE)
        y -= 29
        for i, (lesson, title) in enumerate(TITLES.items()):
            line(f"{lesson} - {title}", LEFT, y, 10)
            line(f"p. {start + i}", RIGHT - 36, y, 10)
            y -= 24
        y -= 22
    doc.showPage()

    for exam in data["exams"]:
        assert len(exam["questions"]) == 24
        for lesson, title in TITLES.items():
            questions = [q for q in exam["questions"] if q["id"].startswith(lesson)]
            assert len(questions) == 4
            page(f"PAPER {exam['number']} / QUESTIONS")
            line(f"PAPER {exam['number']} / {exam['suggestedMinutes']} SUGGESTED MINUTES", LEFT, HEIGHT - 91, 10, True, BLUE)
            line(f"{lesson} - {title}", LEFT, HEIGHT - 123, 19, True)
            line("4 problems / 2 marks each / page score: ______ /8", LEFT, HEIGHT - 149, 10)
            for i, question in enumerate(questions):
                y = HEIGHT - 192 - i * 149
                line(question["id"], LEFT, y, 10, True, BLUE)
                line("______ /2", RIGHT - 61, y, 9)
                bottom = paragraph(question["prompt"], y - 22, 11, leading=16)
                assert bottom >= y - 72, question["id"]
                doc.setStrokeColor(colors.HexColor("#DDE2E7"))
                doc.setLineWidth(0.5)
                for offset in [78, 94, 110, 126]:
                    doc.line(LEFT, y - offset, RIGHT, y - offset)
            doc.showPage()

    assert page_number == 22
    doc.save()
    print(f"Created {OUTPUT.relative_to(ROOT)}: {page_number} pages, {len(ids)} questions")


if __name__ == "__main__":
    build()
