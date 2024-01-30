import re

from playwright.sync_api import Page, expect


def test_computer_tables(page: Page):
    page.goto("https://hoff.ru/catalog/ofis/domashniy_ofis/komputernye_stoly/")
    expect(page).to_have_title(re.compile("Компьютерные столы"))

    with page.context.expect_page() as tab:
        page.get_by_role("link", name=re.compile(" стол ")).first.click()
    computer_table_tab = tab.value
    expect(
        computer_table_tab.locator("#buyButton").get_by_role(
            "button",
            name="Добавить в корзину",
            exact=True,
        )
    ).to_be_enabled(timeout=15000)
    expect(
        computer_table_tab.locator("#buyButton").get_by_role(
            "button",
            name="Добавить в корзину",
            exact=True,
        )
    ).to_be_visible()
    computer_table_tab.locator("#buyButton").get_by_role(
        "button",
        name="Добавить в корзину",
        exact=True,
    ).click()
    computer_table_tab.get_by_role("button", name="Оформить заказ", exact=True).click()
    expect(computer_table_tab.get_by_placeholder("+7 999 999 99 99")).to_be_visible()
    expect(
        computer_table_tab.get_by_role("button", name="Войти", exact=True)
    ).to_be_visible()
    expect(computer_table_tab.get_by_text("1 товар в корзине")).to_be_visible()
    expect(computer_table_tab.locator(".basket-item__price-current")).to_be_visible()
    item_price = computer_table_tab.locator(".basket-item__price-current")
    expect(computer_table_tab.locator(".basket-summary__total-price")).to_be_visible()
    expect(computer_table_tab.locator(".basket-summary__total-price")).to_have_text(
        item_price.inner_text(),
        use_inner_text=True,
    )
