import re
import json

NOISE_KEYWORDS = (
    "PREVIEW",
    "@cocos",
    "ДІТИ ГРАЮТЬ - БАТЬКИ ВІДПОЧИВАЮТЬ",
    "БАРНЕ МЕНЮ",
)


def is_noise_line(line):
    text = " ".join(line.strip().split())
    if not text:
        return False

    upper = text.upper()

    # OCR artifact blocks from footer/promo pages.
    if re.fullmatch(r"(PREVIEW\s*){2,}", upper):
        return True
    if any(keyword in upper for keyword in NOISE_KEYWORDS):
        return True

    return False


def clean_description_lines(lines):
    cleaned = []
    for line in lines:
        text = " ".join(line.strip().split())
        if not text:
            continue
        if is_noise_line(text):
            continue
        cleaned.append(text)

    description = " ".join(cleaned)
    # Extra safeguard in case noisy tokens are glued into mixed lines.
    description = re.sub(r"@cocos\S*", "", description, flags=re.IGNORECASE)
    description = re.sub(r"\bPREVIEW\b(?:\s+\bPREVIEW\b)+", "", description, flags=re.IGNORECASE)
    description = re.sub(r"\s{2,}", " ", description).strip(" -")
    return description


def has_suspicious_description(description):
    if not description:
        return False
    upper = description.upper()
    if "PREVIEW" in upper:
        return True
    if "@COCOS" in upper:
        return True
    return False


def parse_kitchen(text_file):
    with open(text_file, 'r', encoding='utf-8') as f:
        lines = f.read().splitlines()
    
    # Categories:
    # ПІЦА, БУРГЕРИ, ХАЧАПУРІ, ХОЛОДНІ ЗАКУСКИ, БРУСКЕТИ, САЛАТИ, 
    # ПЕРШІ СТРАВИ, ГАРЯЧІ ЗАКУСКИ, КУРОЧКА, РИБА, ТЕЛЯТИНА, СВИНИНА, ТАРЕЛІ, ДИТЯЧЕ МЕНЮ, МЛИНЦІ, ДЕСЕРТИ, СОУСИ, ДОДАТКОВІ ІНГРІДІЄНТИ ДЛЯ ПІЦИ
    categories = [
        "ПІЦА", "БУРГЕРИ", "ХАЧАПУРІ", "ХОЛОДНІ ЗАКУСКИ", "БРУСКЕТИ", 
        "САЛАТИ", "ПЕРШІ СТРАВИ", "ГАРЯЧІ ЗАКУСКИ", "КУРОЧКА", "РИБА", 
        "ТЕЛЯТИНА", "СВИНИНА", "ТАРЕЛІ", "ДИТЯЧЕ МЕНЮ", "МЛИНЦІ", "ДЕСЕРТИ", "СОУСИ"
    ]
    
    current_category = None
    items = []
    
    # Patterns
    # "Маргарита 150₴" or "Карпати 200 г. 105₴"
    # Wait, prices can be "50 г. 30₴"
    # Lets make a robust regex:
    # Optional HOT! tag
    item_re = re.compile(r'^(.+?)(?:\s+HOT!)?\s+(?:(\d+\s*[гглмшт]+)\.?\s*)?(\d+|[?]+)₴$')
    
    i = 0
    seen = set() # Avoid duplicates
    
    while i < len(lines):
        line = lines[i].strip()
        if not line:
            i += 1
            continue
            
        if line in categories:
            current_category = line
            i += 1
            continue
            
        if current_category:
            m = item_re.match(line)
            if m:
                name = m.group(1).strip()
                weight = m.group(2).strip() if m.group(2) else ""
                price = m.group(3)
                
                desc = []
                # Look ahead for description lines
                j = i + 1
                while j < len(lines) and lines[j].strip() and lines[j].strip() not in categories and not item_re.match(lines[j].strip()):
                    desc.append(lines[j].strip())
                    j += 1
                
                i = j - 1
                
                key = f"{name}-{current_category}"
                if key not in seen:
                    # special case for price == '???' => None
                    p = None if price == '???' else int(price)
                    items.append({
                        "id": f"k{len(items)+1}",
                        "name": name,
                        "category": current_category,
                        "weight": weight,
                        "price": p,
                        "description": clean_description_lines(desc)
                    })
                    seen.add(key)
        i += 1
    
    return items

def parse_bar(text_file):
    with open(text_file, 'r', encoding='utf-8') as f:
        lines = f.read().splitlines()
        
    categories = [
        "ШОТИ", "СЕТИ", "АЛКОГОЛЬНІ КОКТЕЙЛІ", "ВИНО", "ІГРИСТЕ ВИНО",
        "КОНЬЯК", "ТЕКІЛА", "ДЖИН", "РОМ", "НАСТОЙКИ ТА ЛІКЕРИ", 
        "ГОРІЛКА", "ПИВО ТА КВАС", "БЕЗАЛКОГОЛЬНІ НАПОЇ", "ГАРЯЧІ НАПОЇ"
    ]
    
    current_category = None
    items = []
    
    # "Скажений пес  60 мл. 45₴"
    item_re = re.compile(r'^(.+?)\s+(\d+(?:[.,]\d+)?\s*[млш]+(?:т\.?)?)\.?\s*(\d+|[?:][?:][?:])₴$')
    # Or without volume "Еспресо  40₴"
    item_no_vol_re = re.compile(r'^(.+?)\s+(\d+|[?]+)₴$')
    
    i = 0
    seen = set()
    
    while i < len(lines):
        line = lines[i].strip()
        if not line:
            i += 1
            continue
            
        if line in categories:
            current_category = line
            i += 1
            continue
            
        if current_category:
            m = item_re.match(line)
            m_novo = None
            if not m:
                m_novo = item_no_vol_re.match(line)
                
            if m or m_novo:
                if m:
                    name = m.group(1).strip()
                    volume = m.group(2).strip()
                    price = m.group(3)
                else:
                    name = m_novo.group(1).strip()
                    volume = ""
                    price = m_novo.group(2)
                
                desc = []
                j = i + 1
                while j < len(lines) and lines[j].strip() and lines[j].strip() not in categories and not item_re.match(lines[j].strip()) and not item_no_vol_re.match(lines[j].strip()):
                    desc.append(lines[j].strip())
                    j += 1
                
                i = j - 1
                
                key = f"{name}-{current_category}-{volume}"
                if key not in seen:
                    p = None if (price == '???' or '?' in price) else int(price)
                    items.append({
                        "id": f"b{len(items)+1}",
                        "name": name,
                        "category": current_category,
                        "volume": volume,
                        "price": p,
                        "description": clean_description_lines(desc)
                    })
                    seen.add(key)
        i += 1
    
    return items

if __name__ == "__main__":
    kitchen = parse_kitchen("kitchen_text.txt")
    bar = parse_bar("bar_text.txt")

    data = {"kitchen": kitchen, "bar": bar}
    suspicious = []
    for item in kitchen + bar:
        if has_suspicious_description(item.get("description", "")):
            suspicious.append(item["id"])

    with open("public/menu.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"Generated public/menu.json with {len(kitchen)} kitchen items and {len(bar)} bar items.")
    if suspicious:
        print(f"Warning: suspicious descriptions found in items: {', '.join(suspicious)}")
