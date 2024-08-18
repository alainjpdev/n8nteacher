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
        'https://www.amazon.ca/s?k=30+oz&i=kitchen&rh=n%3A2206275011%2Cp_123%3A315576%2Cp_n_availability%3A12035748011&dc&crid=LW3YUJRZSMDI&qid=1723258596&rnid=12035746011&sprefix=30+oz%2Ckitchen%2C90&ref=sr_nr_p_n_availability_2&ds=v1%3AvQAW2E9FgghvrBTEzvXJP6Fv1vkoOZbOF2sCkpyQY7E',
        "https://www.amazon.ca/s?k=30+oz&i=kitchen&rh=n%3A2206275011%2Cp_123%3A315576%2Cp_n_availability%3A12035748011&dc&page=2&crid=LW3YUJRZSMDI&qid=1723258600&rnid=12035746011&sprefix=30+oz%2Ckitchen%2C90&ref=sr_pg_2",
        "https://www.amazon.ca/s?k=30+oz&i=kitchen&rh=n%3A2206275011%2Cp_123%3A315576%2Cp_n_availability%3A12035748011&dc&page=3&crid=LW3YUJRZSMDI&qid=1723258648&rnid=12035746011&sprefix=30+oz%2Ckitchen%2C90&ref=sr_pg_3",
        "https://www.amazon.ca/s?k=30+oz&i=kitchen&rh=n%3A2206275011%2Cp_123%3A315576%2Cp_n_availability%3A12035748011&dc&page=4&crid=LW3YUJRZSMDI&qid=1723258697&rnid=12035746011&sprefix=30+oz%2Ckitchen%2C90&ref=sr_pg_4",
        "https://www.amazon.ca/s?k=30+oz&i=kitchen&rh=n%3A2206275011%2Cp_123%3A315576%2Cp_n_availability%3A12035748011&dc&page=5&crid=LW3YUJRZSMDI&qid=1723258723&rnid=12035746011&sprefix=30+oz%2Ckitchen%2C90&ref=sr_pg_5",
        "https://www.amazon.ca/s?k=30+oz&i=kitchen&rh=n%3A2206275011%2Cp_123%3A315576%2Cp_n_availability%3A12035748011&dc&page=6&crid=LW3YUJRZSMDI&qid=1723258739&rnid=12035746011&sprefix=30+oz%2Ckitchen%2C90&ref=sr_pg_6",
        "https://www.amazon.ca/s?k=30+oz&i=kitchen&rh=n%3A2206275011%2Cp_123%3A315576%2Cp_n_availability%3A12035748011&dc&page=7&crid=LW3YUJRZSMDI&qid=1723258747&rnid=12035746011&sprefix=30+oz%2Ckitchen%2C90&ref=sr_pg_7",
        "https://www.amazon.ca/s?k=30+oz&i=kitchen&rh=n%3A2206275011%2Cp_123%3A315576%2Cp_n_availability%3A12035748011&dc&page=8&crid=LW3YUJRZSMDI&qid=1723258769&rnid=12035746011&sprefix=30+oz%2Ckitchen%2C90&ref=sr_pg_8",
        "https://www.amazon.ca/s?k=30+oz&i=kitchen&rh=n%3A2206275011%2Cp_123%3A315576%2Cp_n_availability%3A12035748011&dc&page=9&crid=LW3YUJRZSMDI&qid=1723258791&rnid=12035746011&sprefix=30+oz%2Ckitchen%2C90&ref=sr_pg_9",
        "https://www.amazon.ca/s?k=30+oz&i=kitchen&rh=n%3A2206275011%2Cp_123%3A315576%2Cp_n_availability%3A12035748011&dc&page=10&crid=LW3YUJRZSMDI&qid=1723258806&rnid=12035746011&sprefix=30+oz%2Ckitchen%2C90&ref=sr_pg_10",
        "https://www.amazon.ca/s?k=30+oz&i=kitchen&rh=n%3A2206275011%2Cp_123%3A315576%2Cp_n_availability%3A12035748011&dc&page=11&crid=LW3YUJRZSMDI&qid=1723258821&rnid=12035746011&sprefix=30+oz%2Ckitchen%2C90&ref=sr_pg_11"
        
        # Add more URLs as needed
    ]

    # Setup the WebDriver
    driver = setup_chrome_driver(chromedriver_path)
    
    # Access each URL and extract URLs
    for i, url in enumerate(amazon_urls):
        is_first_page = (i == 0)
        extracted_urls = access_amazon_page(driver, url, is_first_page)
        save_urls_to_csv(extracted_urls, 'amazon30oz.csv')

    # Quit the driver after all URLs have been processed
    driver.quit()