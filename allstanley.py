import requests
import csv
from datetime import datetime
from bs4 import BeautifulSoup
import json

# List of URLs to scrape
urls = [
    "https://ca.stanley1913.com/products/the-quencher-h2-0-flowstate-tumbler-64-oz-1-90-l?variant=43583991316532",
    "https://ca.stanley1913.com/products/adventure-quencher-travel-tumbler-40-oz",
    "https://ca.stanley1913.com/products/the-quencher-h2-0-flowstate-tumbler-soft-matte-40-oz-1-18-l",
    "https://ca.stanley1913.com/products/adventure-quencher-travel-tumbler-30-oz",
    "https://ca.stanley1913.com/products/adventure-quencher-travel-tumbler-20-oz-new",
    "https://ca.stanley1913.com/products/adventure-quencher-travel-tumbler-14-oz",
    "https://ca.stanley1913.com/products/the-iceflow-flip-straw-jug-64-oz",
    "https://ca.stanley1913.com/products/the-iceflow-flip-straw-jug-40-oz",
    "https://ca.stanley1913.com/products/the-iceflow-flip-straw-tumbler-30-oz",
    "https://ca.stanley1913.com/products/the-iceflow-flip-straw-tumbler-20-oz",
    "https://ca.stanley1913.com/products/the-heatwave-iceflow™-flip-straw-tumbler-30-oz-0-88-l",
    "https://ca.stanley1913.com/products/the-heat-wave-stay-chill-stacking-pint-16-oz",
    "https://ca.stanley1913.com/products/go-everyday-wine-tumbler-10-oz",
    "https://ca.stanley1913.com/products/adventure-quencher-travel-tumbler-straws-40-oz-4-pack",
    "https://ca.stanley1913.com/products/adventure-quencher-travel-tumbler-straws-30-oz-4-pack",
    "https://ca.stanley1913.com/products/adventure-quencher-travel-tumbler-straws-14oz-to-20oz-4-pack",
    "https://ca.stanley1913.com/products/the-stanley-cross-bottle-23-oz-0-68-l",
    "https://ca.stanley1913.com/products/all-day-slim-bottle-20-oz",
    "https://ca.stanley1913.com/products/copy-of-all-day-slim-bottle-20-oz-0-59-l",
    "https://ca.stanley1913.com/products/the-heatwave-quencher-h2-0-flowstate™-tumbler-30-oz-0-88-l",
    "https://ca.stanley1913.com/products/the-haetwave-quencher-h2-0-flowstate™-tumbler-40-oz-1-18-l",
    "https://ca.stanley1913.com/products/the-reverb-quencher-h2-0-flowstate%E2%84%A2-tumbler-30-oz-0-88-l?variant=43335984382004",
    "https://ca.stanley1913.com/products/adventure-big-grip-beer-stein-24-oz",
    "https://ca.stanley1913.com/products/classic-stay-chill-beer-pint",
    "https://ca.stanley1913.com/products/classic-easy-fill-wide-mouth-flask-8-oz",
    "https://ca.stanley1913.com/products/classic-easy-pour-growler-64-oz",
    "https://ca.stanley1913.com/products/classic-stay-chill-pitcher-64-oz",
    "https://ca.stanley1913.com/products/adventure-stacking-beer-pint-16-oz",
    "https://ca.stanley1913.com/products/adventure-pre-party-shotglass-flask-set?variant=40538841907252",
    "https://ca.stanley1913.com/products/winterscape-stacking-beer-pint-16-oz-0-47-l",
    "https://ca.stanley1913.com/products/classic-bottle-opener-beer-stein-24-oz",
    "https://ca.stanley1913.com/products/adventure-easy-carry-outdoor-cooler-7-qt",
    "https://ca.stanley1913.com/products/adventure-cooler-16-qt",
    "https://ca.stanley1913.com/products/the-all-day-julienne-mini-cooler-10-can-7-2-qt",
    "https://ca.stanley1913.com/products/the-all-day-madeleine-midi-cooler-backpack-20-can-14-8-qt-14-0-l",
    "https://ca.stanley1913.com/products/adventure-fast-flow-water-jug-2g",
    "https://ca.stanley1913.com/products/adventure-heritage-cooler-combo",
    "https://ca.stanley1913.com/products/the-quick-flip-go-bottle-24-oz?_pos=1&_psq=THE+QUICK&_ss=e&_v=1.0",
    "https://ca.stanley1913.com/products/classic-perfect-brew-pour-over-set?_pos=1&_sid=802c81d3b&_ss=r?variant=40538860650548",
    "https://ca.stanley1913.com/products/classic-stay-hot-french-press-48-oz",
    "https://ca.stanley1913.com/products/the-stay-hot-camp-mug-24-oz-0-029-l",
    "https://ca.stanley1913.com/products/classic-trigger-action-travel-mug-16-oz",

    "https://ca.stanley1913.com/products/adventure-even-heat-camp-pro-cook-set?_pos=1&_sid=efc0b1aa8&_ss=r?variant=40538858651700"
]

# Remove duplicate URLs
urls = list(set(urls))

# Columns to extract in the specified order
columns_to_extract = ["name", "color", "sku", "id", "barcode", "price", "available", "extraction_date", "extraction_hour", "size"]

# Get the current date and time
now = datetime.now()
extraction_date = now.strftime("%Y-%m-%d")
extraction_hour = now.strftime("%H:%M:%S")

# Function to determine the size from the name
def determine_size(name):
    name_lower = name.lower()
    if '30 oz' in name_lower:
        return 30
    elif '40 oz' in name_lower:
        return 40
    elif '64 oz' in name_lower:
        return 64
    elif '20 oz' in name_lower:
        return 20
    elif '14 oz' in name_lower:
        return 14
    elif '8 oz' in name_lower:
        return 8
    elif '16 oz' in name_lower:
        return 16
    elif '24 oz' in name_lower:
        return 24
    elif '48 oz' in name_lower:
        return 48
    elif '34 oz' in name_lower:
        return 34
    elif '10 oz' in name_lower:
        return 10
    else:
        return 'unknown'

# Function to scrape data from a given URL
def scrape_data_from_url(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    # Try to find the div with two different class names
    div = soup.find('div', class_='c-product o-container c-product--crossbottle')
    if not div:
        div = soup.find('div', class_='c-product o-container')

    if not div:
        print(f"Could not extract data from {url}")
        return []

    data_variants = div.get('data-variants')
    product_data = json.loads(data_variants.replace('&quot;', '"'))

    products = []
    for variant in product_data:
        name = variant.get("name", 'N/A')
        size = determine_size(name)
        color = variant.get("title", 'N/A')
        sku = variant.get("sku", 'N/A')
        product_id = variant.get("id", 'N/A')
        barcode = variant.get("barcode", 'N/A')
        price = float(variant.get("price", 0)) / 100
        available = variant.get("available", 'N/A')

        products.append({
            "name": name,
            "color": color,
            "sku": sku,
            "id": product_id,
            "barcode": barcode,
            "price": price,
            "available": available,
            "extraction_date": extraction_date,
            "extraction_hour": extraction_hour,
            "size": size
        })

    return products

# Write the scraped data