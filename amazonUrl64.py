import csv
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

def setup_chrome_driver(chromedriver_path):
    chrome_options = Options()
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")

    try:
        print("Setting up ChromeDriver...")
        chrome_service = Service(executable_path=chromedriver_path)
        driver = webdriver.Chrome(service=chrome_service, options=chrome_options)
        print("ChromeDriver setup completed.")
        return driver
    except Exception as e:
        print("Error setting up ChromeDriver:", e)
        raise

def access_amazon_page(driver, url, is_first_page):
    urls = []
    try:
        print(f"Accessing URL: {url}")
        driver.get(url)
        if is_first_page:
            time.sleep(10)  # Wait for 10 seconds for the first page
        else:
            time.sleep(2)  # Wait for 2 seconds for subsequent pages
        print("Page accessed successfully.")

        product_elements = driver.find_elements(By.CSS_SELECTOR, 'h2.a-size-mini a.a-link-normal')
        urls = [elem.get_attribute('href') for elem in product_elements]
        
    except Exception as e:
        print("Error accessing the URL or extracting data:", e)
    
    return urls

def save_urls_to_csv(urls, filename):
    try:
        with open(filename, mode='a', newline='') as file:
            writer = csv.writer(file)
            for url in urls:
                writer.writerow([url])
        print(f"Saved {len(urls)} URLs to {filename}.")
    except Exception as e:
        print(f"Error saving URLs to CSV: {e}")

if __name__ == "__main__":
    # Specify the path to your chromedriver
    chromedriver_path = '/Users/wavesmanagement/Downloads/chromedriver-mac-arm64/chromedriver'

    # List of URLs to be accessed
    amazon_urls = [
        'https://www.amazon.ca/s?k=64+oz+stanley&rh=n%3A2206275011%2Cp_123%3A315576&dc&ds=v1%3A4xkWahTE826cxNkXtpg7YwDIUTLU3%2Bswv4U6LYzai%2F8&crid=1SPARMDWO069V&qid=1723233654&rnid=119962390011&sprefix=64+oz+stanley%2Caps%2C222&ref=sr_nr_p_ru_0',
        "https://www.amazon.ca/s?k=64+oz+stanley&i=kitchen&rh=n%3A2206275011%2Cp_123%3A315576&dc&page=2&crid=1SPARMDWO069V&qid=1723233660&rnid=119962390011&sprefix=64+oz+stanley%2Caps%2C222&ref=sr_pg_2",
        "https://www.amazon.ca/s?k=64+oz+stanley&i=kitchen&rh=n%3A2206275011%2Cp_123%3A315576&dc&page=3&crid=1SPARMDWO069V&qid=1723233690&rnid=119962390011&sprefix=64+oz+stanley%2Caps%2C222&ref=sr_pg_3",
        "https://www.amazon.ca/s?k=64+oz+stanley&i=kitchen&rh=n%3A2206275011%2Cp_123%3A315576&dc&page=4&crid=1SPARMDWO069V&qid=1723233702&rnid=119962390011&sprefix=64+oz+stanley%2Caps%2C222&ref=sr_pg_4",
        "https://www.amazon.ca/s?k=64+oz+stanley&i=kitchen&rh=n%3A2206275011%2Cp_123%3A315576&dc&page=5&crid=1SPARMDWO069V&qid=1723233719&rnid=119962390011&sprefix=64+oz+stanley%2Caps%2C222&ref=sr_pg_5",
        "https://www.amazon.ca/s?k=64+oz+stanley&i=kitchen&rh=n%3A2206275011%2Cp_123%3A315576&dc&page=6&crid=1SPARMDWO069V&qid=1723233729&rnid=119962390011&sprefix=64+oz+stanley%2Caps%2C222&ref=sr_pg_6",
        "https://www.amazon.ca/s?k=64+oz+stanley&i=kitchen&rh=n%3A2206275011%2Cp_123%3A315576&dc&page=7&crid=1SPARMDWO069V&qid=1723233745&rnid=119962390011&sprefix=64+oz+stanley%2Caps%2C222&ref=sr_pg_7",
        "https://www.amazon.ca/s?k=64+oz+stanley&i=kitchen&rh=n%3A2206275011%2Cp_123%3A315576&dc&page=8&crid=1SPARMDWO069V&qid=1723233759&rnid=119962390011&sprefix=64+oz+stanley%2Caps%2C222&ref=sr_pg_8",
        "https://www.amazon.ca/s?k=64+oz+stanley&i=kitchen&rh=n%3A2206275011%2Cp_123%3A315576&dc&page=9&crid=1SPARMDWO069V&qid=1723233771&rnid=119962390011&sprefix=64+oz+stanley%2Caps%2C222&ref=sr_pg_9",
        "https://www.amazon.ca/s?k=64+oz+stanley&i=kitchen&rh=n%3A2206275011%2Cp_123%3A315576&dc&page=10&crid=1SPARMDWO069V&qid=1723233783&rnid=119962390011&sprefix=64+oz+stanley%2Caps%2C222&ref=sr_pg_10",
        "https://www.amazon.ca/s?k=64+oz+stanley&i=kitchen&rh=n%3A2206275011%2Cp_123%3A315576&dc&page=11&crid=1SPARMDWO069V&qid=1723233798&rnid=119962390011&sprefix=64+oz+stanley%2Caps%2C222&ref=sr_pg_11",
        "https://www.amazon.ca/s?k=64+oz+stanley&i=kitchen&rh=n%3A2206275011%2Cp_123%3A315576&dc&page=12&crid=1SPARMDWO069V&qid=1723233807&rnid=119962390011&sprefix=64+oz+stanley%2Caps%2C222&ref=sr_pg_12"

        # Add more URLs as needed
    ]

    # Setup the WebDriver
    driver = setup_chrome_driver(chromedriver_path)
    
    # Access each URL and extract URLs
    for i, url in enumerate(amazon_urls):
        is_first_page = (i == 0)
        extracted_urls = access_amazon_page(driver, url, is_first_page)
        save_urls_to_csv(extracted_urls, 'amazon64oz.csv')

    # Quit the driver after all URLs have been processed
    driver.quit()