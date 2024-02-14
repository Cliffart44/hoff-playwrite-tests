import {allure} from "allure-playwright";
import {expect, test} from "@playwright/test";
import {Severity} from "allure-js-commons";

test("Computer Tables", async ({page, context}) => {
    await allure.description(
        "This test attempts to check computer tables page.",
    );
    await allure.tags(
        "Essentials",
    );
    await allure.severity(Severity.MINOR);
    await allure.link(
        "https://disk.yandex.ru/edit/d/t5Wq-4elrJGyNFQzXPsDTCPegnqahzm72s0qoIz-cKg6YjNoOURsNEZ1dw",
        "Test Exercise",
    );

    await page.goto("https://hoff.ru/catalog/ofis/domashniy_ofis/komputernye_stoly/");
    await expect(page).toHaveTitle(/Компьютерные столы/, {timeout: 20000});

    const pagePromise = context.waitForEvent("page");
    await page.getByRole("link", {name: / стол /}).first().click();
    const computerTablePage = await pagePromise;
    await computerTablePage.waitForLoadState();

    await allure.step("Check particular table item page", async () => {
        await expect(computerTablePage.locator("#buyButton").getByRole(
                "button",
                {name: "Добавить в корзину", exact: true},
            )
        ).toBeEnabled({timeout: 15000});
        await expect(computerTablePage.locator("#buyButton").getByRole(
                "button",
                {name: "Добавить в корзину", exact: true},
            )
        ).toBeVisible();
    })

    await allure.step("Add a table to the cart and place the order", async () => {
        await computerTablePage.locator("#buyButton").getByRole(
            "button",
            {name: "Добавить в корзину"},
        ).click();
        await computerTablePage.getByRole(
            "button",
            {name: "Оформить заказ"},
        ).click();
    })

    await allure.step("Check the order page", async () => {
        await expect(computerTablePage.getByPlaceholder("+7 999 999 99 99")).toBeVisible(
            {timeout: 15000}
        );
        await expect(computerTablePage.getByRole(
                "button",
                {name: "Войти", exact: true},
            )
        ).toBeVisible();
        await expect(computerTablePage.getByText("1 товар в корзине")).toBeVisible();
        await expect(computerTablePage.locator(".basket-item__price-current")).toBeVisible();
        const itemPrice = computerTablePage.locator(".basket-item__price-current");
        await expect(computerTablePage.locator(".basket-summary__total-price")).toBeVisible();
        await expect(computerTablePage.locator(".basket-summary__total-price")).toHaveText(
            await itemPrice.innerText(),
            {useInnerText: true}
        );
    })
});

test("Basket Emptify", async ({page, context}) => {
    await allure.description(
        "This test attempts to add couple items to the basket and then emptify it.",
    );
    await allure.tags(
        "Essentials",
    );
    await allure.severity(Severity.MINOR);
    await allure.link(
        "https://disk.yandex.ru/edit/d/t5Wq-4elrJGyNFQzXPsDTCPegnqahzm72s0qoIz-cKg6YjNoOURsNEZ1dw",
        "Test Exercise",
    );
    test.slow();

    await allure.step("Open the main page and search for a kitchen sets", async () => {
        await page.goto("https://hoff.ru/");
        await expect(page).toHaveTitle(/Hoff/);
        await page.fill('.c-input__field[type="search"]', "Модульные кухонные гарнитуры");
        await page.getByRole("button", {name: "Смотреть все результаты"}).click();
        await page.getByRole("spinbutton", {name: "от"}).fill("50001");
        await page.getByRole("spinbutton", {name: "до"}).click({delay: 1500});
        await page.getByRole("spinbutton", {name: "до"}).fill("99999");
        await page.getByRole("spinbutton", {name: "от"}).click({delay: 1500});
    });

    const pagePromise = context.waitForEvent("page");
    await page.getByRole(
        "link",
        {name: / кухонный гарнитур /}
    ).first().click();
    const kitchenSetPage = await pagePromise;
    await kitchenSetPage.waitForLoadState();

    await allure.step("Check kitchen set tab and make operations with the basket",
        async () => {
            await kitchenSetPage.getByText("Отзывы").click();
            await kitchenSetPage.getByText("Отзывы").scrollIntoViewIfNeeded();
            await allure.attachment("full-page1", await page.screenshot(), {
                contentType: "image/png",
            });
            await kitchenSetPage.locator("#buyButton").getByRole(
                "button",
                {name: "Добавить в корзину", exact: true}
            ).click();
            await kitchenSetPage.getByRole(
                "button",
                {name: "Продолжить покупки"}
            ).click();

            const pagePromise = context.waitForEvent("page");
            await kitchenSetPage.getByRole("link", {name: "Столешница", exact: true}).click();
            const tabletopPage = await pagePromise;
            await tabletopPage.waitForLoadState();

            await expect(tabletopPage.locator(".product-button-big").nth(2)).toBeEnabled();
            await tabletopPage.locator(".product-button-big").nth(2).click();

            await allure.step("Open the basket and delete all items", async () => {
                await tabletopPage.getByRole("button", {name: "Оформить заказ"}).click();
                await expect(tabletopPage.locator(".basket-item__button.delete").last()).toBeVisible();
                while (await tabletopPage.$(".basket-item__button.delete")) {
                    await tabletopPage.locator(
                        ".basket-item__button.delete"
                    ).first().click({delay: 1000});
                }
                expect(
                    tabletopPage.getByRole("heading", {name: "0 товаров в корзине", exact: true}
                    )
                );
            });
        });
});
