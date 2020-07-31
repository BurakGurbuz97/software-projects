import unittest
from selenium import webdriver
import os

class test_filter(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Chrome(os.path.dirname(os.path.abspath(__file__)) + "\\Chrome\\chromedriver.exe")
        self.driver.implicitly_wait(30)
        self.driver.maximize_window()
        self.driver.get("http://127.0.0.1:8000/tr/listing/smart-phone")

    def test_search_category_1(self):
        self.search_category = self.driver.find_element_by_xpath("/html/body/section/form/div[1]/ul/li[1]/a").click()
        name = self.driver.find_element_by_xpath("/html/body/section/div/div[1]/div/div[2]/div/h4[1]")
        self.assertTrue(name.is_displayed())

    def test_search_category_2(self):
        self.search_category = self.driver.find_element_by_xpath("/html/body/section/form/div[1]/ul/li[2]/a").click()
        name = self.driver.find_element_by_xpath("/html/body/section/div/div[1]/div/div[2]/div/h4[1]")
        self.assertTrue(name.is_displayed())

    def test_search_category_3(self):
        self.search_category = self.driver.find_element_by_xpath("/html/body/section/form/div[1]/ul/li[3]/a").click()
        name = self.driver.find_element_by_xpath("/html/body/section/div/div[1]/div/div[2]/div/h4[1]")
        self.assertTrue(name.is_displayed())

    def test_search_category_4(self):
        self.search_category = self.driver.find_element_by_xpath("/html/body/section/form/div[1]/ul/li[4]/a").click()
        name = self.driver.find_element_by_xpath("/html/body/section/div/div[1]/div/div[2]/div/h4[1]")
        self.assertTrue(name.is_displayed())

    def test_search_category_5(self):
        self.search_category = self.driver.find_element_by_xpath("/html/body/section/form/div[1]/ul/li[5]/a").click()
        name = self.driver.find_element_by_xpath("/html/body/section/div/div[1]/div/div[2]/div/h4[1]")
        self.assertTrue(name.is_displayed())

    def test_brand_vodafone(self):
        self.check_box = self.driver.find_element_by_id("Vodafone").click()
        self.submmit = self.driver.find_element_by_xpath("/html/body/section/form/button").click()
        name = self.driver.find_element_by_xpath("/html/body/section/div/div[1]/div/div[2]/div/h4[1]")
        self.assertTrue(name.is_displayed())


    def test_brand_samsung(self):
        self.check_box = self.driver.find_element_by_id("Samsung").click()
        self.submmit = self.driver.find_element_by_xpath("/html/body/section/form/button").click()
        name = self.driver.find_element_by_xpath("/html/body/section/div/div[1]/div/div[2]/div/h4[1]")
        self.assertTrue(name.is_displayed())


    def test_brand_iphone(self):
        self.check_box = self.driver.find_element_by_id("Iphone").click()
        self.submmit = self.driver.find_element_by_xpath("/html/body/section/form/button").click()
        name = self.driver.find_element_by_xpath("/html/body/section/div/div[1]/div/div[2]/div/h4[1]")
        self.assertTrue(name.is_displayed())


    def test_brand_xiaomi(self):
        self.check_box = self.driver.find_element_by_id("Xiaomi").click()
        self.submmit = self.driver.find_element_by_xpath("/html/body/section/form/button").click()
        name = self.driver.find_element_by_xpath("/html/body/section/div/div[1]/div/div[2]/div/h4[1]")
        self.assertTrue(name.is_displayed())


    def test_brand_huawei(self):
        self.check_box = self.driver.find_element_by_id("Huawei").click()
        self.submmit = self.driver.find_element_by_xpath("/html/body/section/form/button").click()
        name = self.driver.find_element_by_xpath("/html/body/section/div/div[1]/div/div[2]/div/h4[1]")
        self.assertTrue(name.is_displayed())

    def tearDown(self):
        self.driver.quit()

if __name__ == '__main__':
    unittest.main()