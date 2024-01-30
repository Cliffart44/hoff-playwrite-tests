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


def test_basket_emptify(page: Page):
    page.goto("https://hoff.ru/")
    expect(page).to_have_title(re.compile("Hoff"))
    page.fill('.c-input__field[type="search"]', "Модульные кухонные гарнитуры")
    page.get_by_role("button", name="Смотреть все результаты").click()
    page.get_by_role("spinbutton", name="от").fill("50001")
    page.get_by_role("spinbutton", name="до").focus()
    page.wait_for_load_state("domcontentloaded")
    page.get_by_role("spinbutton", name="до").fill("99999")
    page.get_by_role("spinbutton", name="от").focus()
    page.wait_for_load_state("domcontentloaded")

    with page.context.expect_page() as second_tab:
        page.get_by_role("link", name=re.compile(" кухонный гарнитур ")).first.click()
    kitchen_set_tab = second_tab.value
    kitchen_set_tab.get_by_text("Отзывы").click()
    kitchen_set_tab.screenshot()
    kitchen_set_tab.locator("#buyButton").get_by_role(
        "button",
        name="Добавить в корзину",
        exact=True,
    ).click()
    kitchen_set_tab.get_by_role("button", name="Продолжить покупки").click()

    with page.context.expect_page() as third_tab:
        kitchen_set_tab.get_by_role("link", name="Столешница", exact=True).click()
    tabletop_tab = third_tab.value
    expect(tabletop_tab.locator(".product-button-big").nth(2)).to_be_enabled()
    tabletop_tab.locator(".product-button-big").nth(2).click()
    tabletop_tab.get_by_role("button", name="Оформить заказ").click()
    expect(tabletop_tab.locator(".basket-item__button.delete").last).to_be_visible()
    while tabletop_tab.query_selector(".basket-item__button.delete"):
        tabletop_tab.locator(".basket-item__button.delete").first.click(delay=1000)
    expect(
        tabletop_tab.get_by_role(
            "heading",
            name="0 товаров в корзине",
            exact=True,
        )
    )
