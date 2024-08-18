from selenium import webdriver
from selenium.webdriver.common.by import By
import time
import csv
from datetime import datetime

# Set up the WebDriver (assuming you are using Chrome)
driver = webdriver.Chrome()

# Array of URLs to process
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
# Get current date and hour for the file name
now = datetime.now()
timestamp = now.strftime("%Y%m%d_%H")

# Define the CSV file name with date and hour
csv_file = f"product_data_{timestamp}.csv"

# Open the CSV file for writing
with open(csv_file, mode='w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    
    # Write the header row
    writer.writerow(["Title", "Color Name", "Variant ID", "Available", "SKU", "Price (in Dollars)", "Quantity", "Image Source", "Variable Link"])
    
    # Iterate over each URL
    for url in urls:
        # Open the webpage
        driver.get(url)
        
        # Wait for the page to load completely
        time.sleep(5)
        
        # Base URL for constructing the variable link
        base_url = url.split("?")[0]
        
        # Find all the swatches within the active tab block
        swatches = driver.find_elements(By.CSS_SELECTOR, ".c-swatches.c-tabBlock.c-tabBlock--active .c-swatch")
        
        # Loop through each swatch and extract the required attributes
        for swatch in swatches:
            try:
                title = swatch.find_element(By.CSS_SELECTOR, "img").get_attribute("alt") or "N/A"
            except Exception as e:
                title = "N/A"
            
            try:
                color_name = swatch.get_attribute("data-color-name") or "N/A"
            except Exception as e:
                color_name = "N/A"
            
            try:
                variant_id = swatch.get_attribute("data-variant-id") or "N/A"
            except Exception as e:
                variant_id = "N/A"
            
            try:
                variant_available = swatch.get_attribute("data-variant-available") or "N/A"
            except Exception as e:
                variant_available = "N/A"
            
            try:
                sku = swatch.get_attribute("data-sku") or "N/A"
            except Exception as e:
                sku = "N/A"
            
            try:
                variant_price = swatch.get_attribute("data-variant-price")
                if variant_price is not None:
                    variant_price = float(variant_price) / 100  # Convert to dollars
                else:
                    variant_price = "N/A"
            except Exception as e:
                variant_price = "N/A"
            
            try:
                variant_qty = swatch.get_attribute("data-variant-qty") or "N/A"
            except Exception as e:
                variant_qty = "N/A"
            
            try:
                img_src = swatch.find_element(By.CSS_SELECTOR, "img").get_attribute("src") or "N/A"
            except Exception as e:
                img_src = "N/A"
            
            try:
                # Construct the variable link if variant_id is available
                if variant_id != "N/A":
                    variable_link = f"{base_url}?variant={variant_id}"
                else:
                    variable_link = "N/A"
            except Exception as e:
                variable_link = "N/A"
            
            # Write the extracted information to the CSV file
            writer.writerow([title, color_name, variant_id, variant_available, sku, variant_price, variant_qty, img_src, variable_link])

# Close the browser
driver.quit()

print(f"Data has been saved to {csv_file}")