import unittest
from selenium import webdriver
import os

class integration_test(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Chrome(os.path.dirname(os.path.abspath(__file__)) + "\\Chrome\\chromedriver.exe")
        self.driver.implicitly_wait(30)
        self.driver.maximize_window()
        self.driver.get("http://127.0.0.1:8000/tr/")

    def test_detail_page(self):
        self.buttons = self.driver.find_elements_by_class_name("btn btn-lg text-center text-white vodafone-red-back")
        for e in self.buttons:
            e.click()
        name = self.driver.find_element_by_xpath("/html/body/div[4]/div[1]/div[3]/div[1]")
        self.assertTrue(name.is_displayed())
