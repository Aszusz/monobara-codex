import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

const { Given, When, Then } = createBdd();

Given("I am viewing the todo app", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Todos" })).toBeVisible();
});

Given("I have added a todo named {string}", async ({ page }, name: string) => {
  await addTodo(page, name);
});

When("I add a todo named {string}", async ({ page }, name: string) => {
  await addTodo(page, name);
});

When("I delete the todo named {string}", async ({ page }, name: string) => {
  await todo(page, name).getByRole("button", { name: "Delete" }).click();
});

When(
  "I mark the todo named {string} as done",
  async ({ page }, name: string) => {
    await todo(page, name).getByRole("checkbox").check();
  },
);

When("I filter todos by {string}", async ({ page }, filter: string) => {
  await page.getByRole("button", { name: filter }).click();
});

Then("{string} should be the first todo", async ({ page }, name: string) => {
  await expect(page.getByRole("listitem").first()).toContainText(name);
});

Then("I should see a todo named {string}", async ({ page }, name: string) => {
  await expect(todo(page, name)).toBeVisible();
});

Then(
  "I should not see a todo named {string}",
  async ({ page }, name: string) => {
    await expect(todo(page, name)).toHaveCount(0);
  },
);

async function addTodo(page: import("@playwright/test").Page, name: string) {
  await page.getByPlaceholder("Add a todo").fill(name);
  await page.getByRole("button", { name: "Add" }).click();
}

function todo(page: import("@playwright/test").Page, name: string) {
  return page.getByRole("listitem").filter({ hasText: name });
}
