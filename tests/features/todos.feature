Feature: Todos

  Scenario: Add a todo
    Given I am viewing the todo app
    When I add a todo named "Buy milk"
    Then "Buy milk" should be the first todo

  Scenario: Delete a todo
    Given I am viewing the todo app
    And I have added a todo named "Buy milk"
    When I delete the todo named "Buy milk"
    Then I should not see a todo named "Buy milk"

  Scenario: Persist todos after page refresh
    Given I am viewing the todo app
    And I have added a todo named "Buy milk"
    When I refresh the page
    Then I should see a todo named "Buy milk"

  Scenario: Filter active and done todos
    Given I am viewing the todo app
    And I have added a todo named "Buy milk"
    And I have added a todo named "Walk dog"
    When I mark the todo named "Buy milk" as done
    And I filter todos by "active"
    Then I should not see a todo named "Buy milk"
    And I should see a todo named "Walk dog"
    When I filter todos by "done"
    Then I should see a todo named "Buy milk"
    And I should not see a todo named "Walk dog"
