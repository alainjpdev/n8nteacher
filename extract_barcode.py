from selenium import webdriver
from selenium.webdriver.common.by import By
import time
import csv
import json

# Function to extract details from data-variants JSON
def extract_variant_details(variants_json):
    details = []
    try:
        variants = json.loads(variants_json)
        for variant in variants:
            sku = variant.get("sku", "N/A")
            name = variant.get("name", "N/A")
            barcode = f'"{variant.get("barcode", "N/A")}"'  # Enclose barcode in double quotes
            details.append([sku, name, barcode])
    except json.JSONDecodeError:
        print("Error decoding JSON")
    return details

# Set up the WebDriver (assuming you are using Chrome)
driver = webdriver.Chrome()

# Read URLs from CSV file
input_csv = "urls.csv"  # Input CSV with URLs
output_csv = "product_data_output.csv"  # Output CSV to save data

# Open the CSV file for writing
with open(output_csv, mode='w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    
    # Write the header row
    writer.writerow(["SKU", "Name", "Barcode"])
    
    # Open the input CSV and iterate over each URL
    with open(input_csv, mode='r', newline='', encoding='utf-8') as input_file:
        csv_reader = csv.DictReader(input_file)  # Use DictReader to handle headers
        for row in csv_reader:
            url = row['url']  # Access the URL using the header name
            print(f"Processing URL: {url}")
            
            # Open the webpage
            driver.get(url)
            
            # Wait for the page to load completely
            time.sleep(1)  # Adjust this based on your network speed
            
            try:
                # Find the element containing the data-variants JSON
                element = driver.find_element(By.CSS_SELECTOR, ".c-product.o-container")
                variants_json = element.get_attribute("data-variants")
                
                # Extract variant details
                variant_details = extract_variant_details(variants_json)
                
                # Write the details to the CSV file
                for detail in variant_details:
                    writer.writerow(detail)
            except Exception as e:
                print(f"Error processing {url}: {e}")
                writer.writerow(["Error", "Error", "Error"])
                
# Close the browser
driver.quit()

print(f"Data has been saved to {output_csv}")