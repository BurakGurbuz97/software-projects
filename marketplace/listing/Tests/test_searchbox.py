import unittest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import os


class SearchText(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Chrome(os.path.dirname(os.path.abspath(__file__)) + "\\Chrome\\chromedriver.exe")
        self.driver.implicitly_wait(30)
        self.driver.maximize_window()
        self.driver.get("http://127.0.0.1:8000/tr/")

    def test_iphone(self):
        self.search_field = self.driver.find_element_by_xpath("/html/body/div[4]/form/input").send_keys("iphone")
        self.search_button = self.driver.find_element_by_xpath("/html/body/div[4]/form/button").click()
        name = self.driver.find_element_by_xpath("/html/body/section/div/div[1]/div/div[2]/div/h4[1]")
        self.assertTrue(name.is_displayed())

    def test_samsung(self):
        self.search_field = self.driver.find_element_by_xpath("/html/body/div[4]/form/input").send_keys("samsung")
        self.search_button = self.driver.find_element_by_xpath("/html/body/div[4]/form/button").click()
        name = self.driver.find_element_by_xpath("/html/body/section/div/div[1]/div/div[2]/div/h4[1]")
        self.assertTrue(name.is_displayed())

    def test_huawei(self):
        self.search_field = self.driver.find_element_by_xpath("/html/body/div[4]/form/input").send_keys("huawei")
        self.search_button = self.driver.find_element_by_xpath("/html/body/div[4]/form/button").click()
        name = self.driver.find_element_by_xpath("/html/body/section/div/div[1]/div/div[2]/div/h4[1]")
        self.assertTrue(name.is_displayed())

    def test_vodafone(self):
        self.search_field = self.driver.find_element_by_xpath("/html/body/div[4]/form/input").send_keys("vodafone")
        self.search_button = self.driver.find_element_by_xpath("/html/body/div[4]/form/button").click()
        name = self.driver.find_element_by_xpath("/html/body/section/div/div[1]/div/div[2]/div/h4[1]")
        self.assertTrue(name.is_displayed())

    def test_huawei(self):
        self.search_field = self.driver.find_element_by_xpath("/html/body/div[4]/form/input").send_keys("huawei")
        self.search_button = self.driver.find_element_by_xpath("/html/body/div[4]/form/button").click()
        name = self.driver.find_element_by_xpath("/html/body/section/div/div[1]/div/div[2]/div/h4[1]")
        self.assertTrue(name.is_displayed())

    def tearDown(self):
        self.driver.quit()

if __name__ == '__main__':
    unittest.main()