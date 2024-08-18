import time
import pandas as pd
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
from datetime import datetime
import re
from selenium.webdriver.common.by import By 

# List of predefined colors
EXISTENT_COLORS = [
    "alpine", "ash", "azure", "black", "black 2.0", "blue spruce", "charcoal",
    "citron", "cream", "cream 2.0", "eucalyptus", "fog", "frost", "fuscia",
    "iris", "lilac", "mist", "plum", "pomelo", "pool", "rose quartz",
    "rose quartz 2.0", "stone", "tigerlily", "tigerlily plum","pink"
]

def setup_chrome_driver(chromedriver_path):
    chrome_options = Options()
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")

    try:
        print("Setting up ChromeDriver...")
        chrome_service = Service(executable_path=chromedriver_path)
        driver = webdriver.Chrome(service=chrome_service, options=chrome_options)
        print("ChromeDriver setup completed.")
        return driver
    except Exception as e:
        print("Error setting up ChromeDriver:", e)
        raise

def extract_size_from_title(title):
    name_lower = title.lower()
    if '30oz' in name_lower or '30 oz' in name_lower:
        return 30
    elif '40oz' in name_lower or '40 oz' in name_lower:
        return 40
    elif '64oz' in name_lower or '64 oz' in name_lower:
        return 64
    elif '20oz' in name_lower or '20 oz' in name_lower:
        return 20
    elif '14oz' in name_lower or '14 oz' in name_lower:
        return 14
    elif '8oz' in name_lower or '8 oz' in name_lower:
        return 8
    elif '16oz' in name_lower or '16 oz' in name_lower:
        return 16
    elif '24oz' in name_lower or '24 oz' in name_lower:
        return 24
    elif '48oz' in name_lower or '48 oz' in name_lower:
        return 48
    elif '34oz' in name_lower or '34 oz' in name_lower:
        return 34
    elif '10oz' in name_lower or '10 oz' in name_lower:
        return 10
    else:
        return 'unknown'

def extract_model_from_title(title):
    name_lower = title.lower()
    if 'flowstate' in name_lower:
        return 'FlowState'
    elif 'iceflow flip straw' in name_lower:
        return 'ICEFLOW FLIP STRAW'
    else:
        return 'unknown'

def extract_asin_from_url(url):
    match = re.search(r'/B0\w+/', url)
    if match:
        return match.group(0).strip('/')
    return None

def validate_color(color):
    return color.lower() if color.lower() in EXISTENT_COLORS else 'unknown'

def extract_color_from_title(title):
    title_lower = title.lower()
    color_pattern = re.compile('|'.join(re.escape(color) for color in EXISTENT_COLORS), re.IGNORECASE)
    match = color_pattern.search(title_lower)
    if match:
        return match.group(0)
    return 'unknown'

def scrape_product_details(driver, url, is_first):
    try:
        print(f"Accessing URL: {url}")
        driver.get(url)
        time.sleep(10 if is_first else 3)
        print("Page accessed successfully.")
    except Exception as e:
        print("Error accessing the URL:", e)
        return []

    try:
        print("Parsing page source with BeautifulSoup...")
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        print("Page parsed successfully.")
    except Exception as e:
        print("Error parsing the page source:", e)
        return []

    products = []

    try:
        product_title = soup.find('span', id='productTitle').text.strip()
        product_size = extract_size_from_title(product_title)
        product_model = extract_model_from_title(product_title)
        product_color1 = extract_color_from_title(product_title)
    except Exception as e:
        product_title = 'N/A'
        product_size = 'unknown'
        product_model = 'unknown'
        product_color1 = 'unknown'
        print(f"Error extracting product title, size, model, and color1: {e}")

    try:
        price_symbol = soup.find('span', class_='a-price-symbol').text
        price_whole = soup.find('span', class_='a-price-whole').text
        price_fraction = soup.find('span', class_='a-price-fraction').text
        product_price = f"{price_symbol}{price_whole}{price_fraction}"
    except Exception as e:
        product_price = 'N/A'
        print(f"Error extracting product price: {e}")

    try:
        product_color_element = soup.find('form', id='twister')
        if product_color_element:
            product_color = product_color_element.find('span', class_='selection').text.strip()
            product_color = validate_color(product_color)
        else:
            product_color = 'N/A'
            print("Twister form element not found")
    except Exception as e:
        product_color = 'N/A'
        print(f"Error extracting product color: {e}")

    try:
        product_details_table = soup.find('table', id='productDetails_detailBullets_sections1')
        if product_details_table:
            asin2_element = product_details_table.find('td', class_='a-size-base prodDetAttrValue')
            asin2 = asin2_element.text.strip() if asin2_element else 'N/A'
        else:
            asin2 = 'N/A'
            print("productDetails_detailBullets_sections1 table not found")
    except Exception as e:
        asin2 = 'N/A'
        print(f"Error extracting ASIN (second method): {e}")

    try:
        tech_spec_table = soup.find('table', id='productDetails_techSpec_section_1')
        if tech_spec_table:
            for row in tech_spec_table.find_all('tr'):
                th = row.find('th', class_='a-color-secondary a-size-base prodDetSectionEntry')
                if th and th.text.strip().lower() in ['colour', 'color']:
                    product_color2 = row.find('td', class_='a-color-secondary a-size-base prodDetAttrValue').text.strip()
                    product_color2 = validate_color(product_color2)
                    break
            else:
                product_color2 = extract_color_from_title(product_title)
                if product_color2 == 'unknown':
                    product_color2 = 'N/A'
                print("No color information found in tech spec table")
        else:
            product_color2 = 'N/A'
            print("productDetails_techSpec_section_1 table not found")
    except Exception as e:
        product_color2 = 'N/A'
        print(f"Error extracting product color2: {e}")

    try:
        product_color3_element = soup.find('span', class_='a-size-base po-break-word')
        if product_color3_element:
            product_color3 = product_color3_element.text.strip()
            product_color3 = validate_color(product_color3)
        else:
            product_color3 = 'N/A'
            print("product_color3 element not found")
    except Exception as e:
        product_color3 = 'N/A'
        print(f"Error extracting product color3: {e}")

    asin_list = []
    try:
        variation_color_div = driver.find_element(By.ID, 'variation_color_name')
        ul = variation_color_div.find_element(By.CSS_SELECTOR, 'ul.a-unordered-list.a-nostyle.a-button-list.a-declarative.a-button-toggle-group.a-horizontal.a-spacing-top-micro.swatches.swatchesSquare.imageSwatches')
        for li in ul.find_elements(By.TAG_NAME, 'li'):
            try:
                asin_id = li.get_attribute('data-csa-c-item-id')
                if asin_id:  # Ensure the ID exists
                    asin_list.append(asin_id)
            except Exception as e:
                print(f"Error extracting asin_id: {e}")
    except Exception as e:
        print(f"Error extracting ASINs from variation color section: {e}")

    product_data = {
        "title": product_title,
        "price": product_price,
        "color": product_color,
        "color1": product_color1,
        "color2": product_color2,
        "color3": product_color3,
        "size": product_size,
        "model": product_model,
        "url": url,
        "extraction_date": datetime.now().strftime("%Y-%m-%d"),
        "extraction_hour": datetime.now().strftime("%H:%M:%S"),
        "asin2": asin2
    }

    for idx, asin in enumerate(asin_list):
        product_data[f'asin{idx+1}'] = asin

    products.append(product_data)

    return products
def save_to_csv(products, output_csv_path):
    # Create a DataFrame from the product list
    df_products = pd.DataFrame(products)

    # Identify columns to extract
    columns_to_extract = ["title", "price", "color", "color1", "color2", "color3", "size", "model", "url", "extraction_date", "extraction_hour", "asin2"]
    asin_columns = [col for col in df_products.columns if col.startswith('asin')]
    columns_to_extract.extend(asin_columns)

    # Save DataFrame to CSV
    df_products.to_csv(output_csv_path, index=False, columns=columns_to_extract, mode='a', header=not pd.io.common.file_exists(output_csv_path))
    print(f"Product details extracted and saved to {output_csv_path}")

if __name__ == "__main__":
    chromedriver_path = '/Users/wavesmanagement/Downloads/chromedriver-mac-arm64/chromedriver'  # Update this path
    
    # Load URLs from the CSV file
    csv_path = '/Users/wavesmanagement/scripts/amazon30oz.csv'  # Path to the CSV file
    df_urls = pd.read_csv(csv_path)
    urls = df_urls['URL'].tolist()  # Assuming the column name is 'URL'

    driver = setup_chrome_driver(chromedriver_path)
    
    all_products = []
    batch_size = 10
    for i, url in enumerate(urls):
        is_first = (i == 0)
        products = scrape_product_details(driver, url, is_first)
        all_products.extend(products)

        remaining_urls = len(urls) - (i + 1)
        print(f"Remaining URLs to extract: {remaining_urls}")
        
        if (i + 1) % batch_size == 0 or (i + 1) == len(urls):
            current_date = datetime.now().strftime("%Y-%m-%d")
            current_hour = datetime.now().strftime("%H")
            output_csv_path = f'output_{current_date}_{current_hour}.csv'
            save_to_csv(all_products, output_csv_path)
            all_products = []

    driver.quit()