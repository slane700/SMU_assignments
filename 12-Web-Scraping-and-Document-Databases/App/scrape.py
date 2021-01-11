from splinter import Browser
from bs4 import BeautifulSoup
from webdriver_manager.chrome import ChromeDriverManager
import pandas as pd
import datetime
import time

class ScrapeMars():
    def __init__(self):
        pass

    def init_browser(self):
        # @NOTE: Replace the path with your actual path to the chromedriver
        executable_path = {'executable_path': ChromeDriverManager().install()}
        browser = Browser('chrome', **executable_path, headless=True)
        return browser


    def scrape_info(self):
        scraped_data= {}
        browser = self.init_browser()

        #Getting News Info

        url = "https://mars.nasa.gov/news/"
        browser.visit(url)

        #allow broswer to open
        time.sleep(1)

        soup = BeautifulSoup(browser.html)

        #Grabbing the Titles and the Paragapghs 
        slide = soup.find("li", {"class": "slide"})
        newsTitle = slide.find("div", {"class": "content_title"}).text.strip()
        newsPara = slide.find("div", {"class": "article_teaser_body"}).text.strip()

        #Getting image 
        base = "https://www.jpl.nasa.gov"
        url = "https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars"
        browser.visit(url)


        #allow broswer to open
        time.sleep(1)

        #find image
        browser.find_by_id("full_image").click()
        time.sleep(1)

        browser.find_link_by_partial_text("more info").click()
        time.sleep(1)

        soup = BeautifulSoup(browser.html)
        image = soup.find("img", {"class": "main_image"})

        featuredImage = base + image["src"]

        #get Mars Facts 
        url = "https://space-facts.com/mars/"
        browser.visit(url)
        time.sleep(1)

        table = pd.read_html(url)
        df = table[0]
        df.columns = ["Criteria", "Values"]
        facts = df.to_html(index=False)

        # Hemisphere Data 
        base = "https://astrogeology.usgs.gov"
        url = f"{base}/search/results?q=hemisphere+enhanced&k1=target&v1=Mars"
        browser.visit(url)
        time.sleep(1)

        soup = BeautifulSoup(browser.html)
        imgLinks = soup.find("div", {"class":"results"}).findAll("a", {"class":"itemLink"})
        imgLinks

        links = []
        for link in imgLinks: 
            image = link.find("img")
            if (image):
                links.append(base + link["href"])
                
        hemiData = []       
        for link in links: 
            browser.visit(link)
            time.sleep(1)
            soup = BeautifulSoup(browser.html)
            hemiUrl = soup.find("ul").find("li").find("a")["href"]
            hemiTitle = soup.find("h2", {"class" : "title"}).text.split(" Enhanced")[0]
            hemiData.append({"title": hemiTitle, "url": hemiUrl})
        browser.quit()

        #add data to dictonary 
        scraped_data["newsTitle"] = newsTitle
        scraped_data["newsPara"] = newsPara
        scraped_data["featuredImage"] = featuredImage
        scraped_data["marsFacts"] = facts
        scraped_data["hemisphere"]= hemiData
        scraped_data["last_updated"] = datetime.datetime.now()

        # Return results
        return scraped_data