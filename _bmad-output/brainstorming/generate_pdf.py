#!/usr/bin/env python3
"""Convert brainstorming session markdown to a professionally styled PDF using fpdf2."""

from fpdf import FPDF
import re

INPUT_FILE = "/Users/nathanblottiaux/_bmad-output/brainstorming/brainstorming-session-2026-02-22.md"
OUTPUT_FILE = "/Users/nathanblottiaux/_bmad-output/brainstorming/brainstorming-session-2026-02-22.pdf"

# Fonts
FONT_REG = "/System/Library/Fonts/Supplemental/Arial.ttf"
FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
FONT_ITALIC = "/System/Library/Fonts/Supplemental/Arial Italic.ttf"
FONT_BI = "/System/Library/Fonts/Supplemental/Arial Bold Italic.ttf"

# Color palette
NAVY = (27, 58, 92)
BLUE = (46, 134, 193)
LIGHT_BLUE = (174, 214, 241)
VERY_LIGHT_BLUE = (235, 245, 251)
DARK_TEXT = (26, 26, 26)
GRAY_TEXT = (100, 100, 100)
WHITE = (255, 255, 255)
TABLE_HEADER_BG = (27, 58, 92)
TABLE_ALT_ROW = (247, 251, 254)
HR_COLOR = (213, 232, 240)

FONT_NAME = "Arial2"


class BrainstormPDF(FPDF):
    def __init__(self):
        super().__init__('P', 'mm', 'A4')
        self.set_auto_page_break(auto=True, margin=20)
        self.set_margins(20, 20, 20)
        self.add_font(FONT_NAME, "", FONT_REG, uni=True)
        self.add_font(FONT_NAME, "B", FONT_BOLD, uni=True)
        self.add_font(FONT_NAME, "I", FONT_ITALIC, uni=True)
        self.add_font(FONT_NAME, "BI", FONT_BI, uni=True)

    def header(self):
        if self.page_no() > 1:
            self.set_font(FONT_NAME, "I", 7)
            self.set_text_color(*GRAY_TEXT)
            self.cell(0, 6, "JIM (Job In Med) \u2014 Session de brainstorming \u2014 22/02/2026", align='C')
            self.ln(2)
            self.set_draw_color(*HR_COLOR)
            self.line(20, self.get_y(), 190, self.get_y())
            self.ln(4)

    def footer(self):
        self.set_y(-15)
        self.set_font(FONT_NAME, "I", 7)
        self.set_text_color(*GRAY_TEXT)
        self.cell(0, 10, f"Page {self.page_no()}/{{nb}}", align='C')


def strip_frontmatter(text):
    if text.startswith("---"):
        end = text.find("---", 3)
        if end != -1:
            return text[end + 3:].lstrip("\n")
    return text


def parse_bold_text(pdf, text, default_style=""):
    """Write text with **bold** and _italic_ inline formatting."""
    parts = re.split(r'(\*\*.*?\*\*)', text)
    for part in parts:
        if part.startswith("**") and part.endswith("**"):
            pdf.set_font(FONT_NAME, "B", pdf.font_size_pt)
            inner = part[2:-2]
            # Handle italic inside bold
            italic_parts = re.split(r'(_.*?_)', inner)
            for ip in italic_parts:
                if ip.startswith("_") and ip.endswith("_") and len(ip) > 2:
                    pdf.set_font(FONT_NAME, "BI", pdf.font_size_pt)
                    pdf.write(5, ip[1:-1])
                    pdf.set_font(FONT_NAME, "B", pdf.font_size_pt)
                else:
                    pdf.write(5, ip)
            pdf.set_font(FONT_NAME, default_style, pdf.font_size_pt)
        else:
            italic_parts = re.split(r'(_.*?_)', part)
            for ip in italic_parts:
                if ip.startswith("_") and ip.endswith("_") and len(ip) > 2:
                    pdf.set_font(FONT_NAME, "I", pdf.font_size_pt)
                    pdf.write(5, ip[1:-1])
                    pdf.set_font(FONT_NAME, default_style, pdf.font_size_pt)
                else:
                    pdf.write(5, ip)


def render_table(pdf, headers, rows):
    """Render a table with styled headers and alternating rows."""
    effective_width = 170
    n_cols = len(headers)

    if n_cols == 5:
        col_widths = [8, 82, 28, 25, 27]
    elif n_cols == 3:
        if headers[0].strip() == '#':
            col_widths = [8, 82, 80]
        else:
            col_widths = [30, 80, 60]
    else:
        col_widths = [effective_width / n_cols] * n_cols

    total = sum(col_widths)
    col_widths = [w * effective_width / total for w in col_widths]

    row_height = 7

    if pdf.get_y() + (len(rows) + 1) * row_height + 4 > 270 and len(rows) < 12:
        pdf.add_page()

    # Header
    pdf.set_fill_color(*TABLE_HEADER_BG)
    pdf.set_text_color(*WHITE)
    pdf.set_font(FONT_NAME, "B", 7.5)
    for i, h in enumerate(headers):
        pdf.cell(col_widths[i], row_height, h.strip(), border=0, fill=True, align='L')
    pdf.ln(row_height)

    # Rows
    pdf.set_text_color(*DARK_TEXT)
    pdf.set_font(FONT_NAME, "", 7.5)
    for row_idx, row in enumerate(rows):
        if pdf.get_y() + row_height > 275:
            pdf.add_page()
            pdf.set_fill_color(*TABLE_HEADER_BG)
            pdf.set_text_color(*WHITE)
            pdf.set_font(FONT_NAME, "B", 7.5)
            for i, h in enumerate(headers):
                pdf.cell(col_widths[i], row_height, h.strip(), border=0, fill=True, align='L')
            pdf.ln(row_height)
            pdf.set_text_color(*DARK_TEXT)
            pdf.set_font(FONT_NAME, "", 7.5)

        if row_idx % 2 == 1:
            pdf.set_fill_color(*TABLE_ALT_ROW)
        else:
            pdf.set_fill_color(*WHITE)

        cells = [c.strip() for c in row.split("|") if c.strip() != ""]
        while len(cells) < n_cols:
            cells.append("")

        for i in range(min(n_cols, len(cells))):
            text = cells[i].replace("**", "").strip()
            if len(text) > 65:
                text = text[:62] + "..."
            pdf.cell(col_widths[i], row_height, text, border=0, fill=True, align='L')
        pdf.ln(row_height)

    pdf.set_draw_color(*LIGHT_BLUE)
    pdf.line(20, pdf.get_y(), 190, pdf.get_y())
    pdf.ln(4)


def build_pdf():
    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    content = strip_frontmatter(content)
    lines = content.split("\n")

    pdf = BrainstormPDF()
    pdf.alias_nb_pages()
    pdf.add_page()

    # === COVER PAGE ===
    pdf.ln(30)
    pdf.set_font(FONT_NAME, "B", 28)
    pdf.set_text_color(*NAVY)
    pdf.cell(0, 14, "Brainstorming Session", align='C', new_x="LMARGIN", new_y="NEXT")
    pdf.ln(3)
    pdf.set_font(FONT_NAME, "B", 20)
    pdf.set_text_color(*BLUE)
    pdf.cell(0, 12, "JIM (Job In Med)", align='C', new_x="LMARGIN", new_y="NEXT")
    pdf.ln(8)

    pdf.set_draw_color(*BLUE)
    pdf.set_line_width(0.8)
    pdf.line(60, pdf.get_y(), 150, pdf.get_y())
    pdf.set_line_width(0.2)
    pdf.ln(10)

    pdf.set_font(FONT_NAME, "", 12)
    pdf.set_text_color(*DARK_TEXT)
    pdf.cell(0, 8, "Masse critique et concentration des utilisateurs", align='C', new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 8, "face \u00e0 Facebook", align='C', new_x="LMARGIN", new_y="NEXT")
    pdf.ln(15)

    pdf.set_font(FONT_NAME, "", 10)
    pdf.set_text_color(*GRAY_TEXT)
    pdf.cell(0, 7, "Facilitateur : NathanBlottiaux", align='C', new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 7, "Date : 22 f\u00e9vrier 2026", align='C', new_x="LMARGIN", new_y="NEXT")
    pdf.ln(5)
    pdf.cell(0, 7, "4 techniques | 32 id\u00e9es | 6 th\u00e8mes | 12 actions", align='C', new_x="LMARGIN", new_y="NEXT")

    pdf.ln(25)
    # Summary box
    pdf.set_fill_color(*VERY_LIGHT_BLUE)
    pdf.set_draw_color(*BLUE)
    y_start = pdf.get_y()
    pdf.rect(30, y_start, 150, 48, style='DF')
    pdf.set_xy(35, y_start + 5)
    pdf.set_font(FONT_NAME, "B", 10)
    pdf.set_text_color(*NAVY)
    pdf.cell(140, 7, "Techniques utilis\u00e9es", align='C', new_x="LMARGIN", new_y="NEXT")
    pdf.set_font(FONT_NAME, "", 9)
    pdf.set_text_color(*DARK_TEXT)
    techniques = [
        "1. Reverse Brainstorming \u2014 9 sabotages + 9 antidotes",
        "2. Cross-Pollination \u2014 9 patterns emprunt\u00e9s",
        "3. Guerrilla Gardening Ideas \u2014 8 tactiques",
        "4. Alien Anthropologist \u2014 6 observations",
    ]
    for t in techniques:
        pdf.set_x(40)
        pdf.cell(130, 8, t, new_x="LMARGIN", new_y="NEXT")

    # === BODY CONTENT ===
    pdf.add_page()

    i = 0
    in_code_block = False
    code_buffer = []
    in_table = False
    table_headers = []
    table_rows = []

    while i < len(lines):
        line = lines[i]

        # Skip cover-level content already rendered
        if i < 5 and (line.startswith("# Brainstorming") or line.startswith("**Facilitateur") or line.startswith("**Date")):
            i += 1
            continue

        # Code blocks
        if line.strip().startswith("```"):
            if in_code_block:
                pdf.set_font(FONT_NAME, "", 7.5)
                pdf.set_fill_color(244, 246, 247)
                pdf.set_draw_color(*BLUE)
                code_text = "\n".join(code_buffer)
                code_lines_list = code_text.split("\n")
                block_height = len(code_lines_list) * 4.5 + 8
                if pdf.get_y() + block_height > 275:
                    pdf.add_page()
                y = pdf.get_y()
                pdf.rect(22, y, 166, block_height, style='F')
                pdf.set_draw_color(*BLUE)
                pdf.line(22, y, 22, y + block_height)
                pdf.set_xy(25, y + 3)
                for cl in code_lines_list:
                    pdf.set_x(25)
                    pdf.cell(160, 4.5, cl, new_x="LMARGIN", new_y="NEXT")
                pdf.set_y(y + block_height + 3)
                code_buffer = []
                in_code_block = False
            else:
                in_code_block = True
                code_buffer = []
            i += 1
            continue

        if in_code_block:
            code_buffer.append(line)
            i += 1
            continue

        # Tables
        if "|" in line and line.strip().startswith("|"):
            cells = [c.strip() for c in line.split("|") if c.strip()]
            if all(re.match(r'^[-:]+$', c) for c in cells):
                i += 1
                continue
            if not in_table:
                in_table = True
                table_headers = cells
                table_rows = []
            else:
                table_rows.append(line.strip().strip("|"))
            i += 1
            continue
        elif in_table:
            render_table(pdf, table_headers, table_rows)
            in_table = False
            table_headers = []
            table_rows = []
            # Don't skip - continue processing current line

        # Horizontal rules
        if line.strip() == "---":
            pdf.set_draw_color(*HR_COLOR)
            pdf.line(20, pdf.get_y() + 2, 190, pdf.get_y() + 2)
            pdf.ln(6)
            i += 1
            continue

        # H2
        if line.startswith("## "):
            heading = line[3:].strip()
            pdf.ln(6)
            if pdf.get_y() > 250:
                pdf.add_page()
            pdf.set_font(FONT_NAME, "B", 14)
            pdf.set_text_color(*NAVY)
            pdf.cell(0, 9, heading, new_x="LMARGIN", new_y="NEXT")
            pdf.set_draw_color(*LIGHT_BLUE)
            pdf.line(20, pdf.get_y(), 190, pdf.get_y())
            pdf.ln(4)
            i += 1
            continue

        # H3
        if line.startswith("### "):
            heading = line[4:].strip()
            pdf.ln(4)
            if pdf.get_y() > 258:
                pdf.add_page()
            pdf.set_font(FONT_NAME, "B", 11)
            pdf.set_text_color(*BLUE)
            pdf.cell(0, 8, heading, new_x="LMARGIN", new_y="NEXT")
            pdf.ln(2)
            i += 1
            continue

        # H4
        if line.startswith("#### "):
            heading = line[5:].strip()
            pdf.ln(2)
            pdf.set_font(FONT_NAME, "B", 9.5)
            pdf.set_text_color(40, 116, 166)
            pdf.cell(0, 7, heading, new_x="LMARGIN", new_y="NEXT")
            pdf.ln(1)
            i += 1
            continue

        # List items
        if line.strip().startswith("- "):
            item_text = line.strip()[2:]
            pdf.set_text_color(*DARK_TEXT)
            pdf.set_font(FONT_NAME, "", 9)
            if pdf.get_y() > 272:
                pdf.add_page()
            pdf.set_x(25)
            pdf.write(5, "\u2022 ")
            parse_bold_text(pdf, item_text)
            pdf.ln(5.5)
            i += 1
            continue

        # Numbered list items
        num_match = re.match(r'^(\d+)\.\s+(.*)', line.strip())
        if num_match:
            num = num_match.group(1)
            item_text = num_match.group(2)
            pdf.set_text_color(*DARK_TEXT)
            pdf.set_font(FONT_NAME, "", 9)
            if pdf.get_y() > 272:
                pdf.add_page()
            pdf.set_x(25)
            pdf.set_font(FONT_NAME, "B", 9)
            pdf.write(5, f"{num}. ")
            pdf.set_font(FONT_NAME, "", 9)
            parse_bold_text(pdf, item_text)
            pdf.ln(5.5)
            i += 1
            continue

        # Regular paragraphs
        if line.strip():
            pdf.set_text_color(*DARK_TEXT)
            pdf.set_font(FONT_NAME, "", 9)
            if pdf.get_y() > 272:
                pdf.add_page()
            parse_bold_text(pdf, line.strip())
            pdf.ln(5.5)
            i += 1
            continue

        # Empty lines
        pdf.ln(2)
        i += 1

    # Flush remaining table
    if in_table:
        render_table(pdf, table_headers, table_rows)

    pdf.output(OUTPUT_FILE)
    print(f"\u2705 PDF g\u00e9n\u00e9r\u00e9 : {OUTPUT_FILE}")


if __name__ == "__main__":
    build_pdf()
