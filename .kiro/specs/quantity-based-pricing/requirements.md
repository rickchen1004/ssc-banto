# Requirements Document

## Introduction

本功能擴展現有的訂餐系統，為所有餐點和加購項目新增數量選擇功能。學生可以使用 +/- 按鈕選擇每個項目的數量，系統自動計算總價。

## Glossary

- **System**: 學生訂餐系統
- **Meal**: 餐點，每個餐點都有單價
- **Addon**: 加購項目，每個加購項目都有單價
- **Unit Price**: 單價，每個餐點或加購項目的單位價格
- **Quantity**: 數量，學生選擇的項目數量（正整數）
- **Quantity Selector**: 數量選擇器，包含 - 按鈕、數量顯示、+ 按鈕
- **Subtotal**: 小計，單價 × 數量的結果

## Requirements

### Requirement 1

**User Story:** As a student, I want to select the quantity for each meal, so that I can order multiple portions.

#### Acceptance Criteria

1. WHEN the System displays a meal THEN the System SHALL show a quantity selector with minus button, quantity display, and plus button
2. WHEN a student clicks the plus button THEN the System SHALL increment the quantity by one
3. WHEN a student clicks the minus button AND quantity is greater than one THEN the System SHALL decrement the quantity by one
4. WHEN a student clicks the minus button AND quantity equals one THEN the System SHALL maintain quantity at one
5. WHEN quantity changes THEN the System SHALL recalculate the meal subtotal as price multiplied by quantity

### Requirement 2

**User Story:** As a student, I want to see the calculated price for each meal based on quantity, so that I know how much I will pay.

#### Acceptance Criteria

1. WHEN a meal is displayed THEN the System SHALL show the format "單價 × 數量 = 小計"
2. WHEN quantity is one THEN the System SHALL display the subtotal equal to the unit price
3. WHEN quantity changes THEN the System SHALL update the subtotal immediately
4. WHEN calculating the order total THEN the System SHALL calculate as meal subtotal plus sum of checked addon prices

### Requirement 3

**User Story:** As a student, I want add-ons to remain as simple checkboxes, so that I can quickly select upgrades without worrying about quantity.

#### Acceptance Criteria

1. WHEN the System displays an addon THEN the System SHALL show a checkbox without quantity selector
2. WHEN an addon is checked THEN the System SHALL add the addon price once to the order total
3. WHEN an addon is unchecked THEN the System SHALL exclude the addon from the order total
4. WHEN calculating the order total THEN the System SHALL calculate as meal subtotal plus addon total where meal subtotal equals meal price multiplied by quantity

### Requirement 4

**User Story:** As a student, I want to submit orders with quantity information, so that the restaurant knows how many portions to prepare.

#### Acceptance Criteria

1. WHEN submitting an order THEN the System SHALL include quantity for the selected meal
2. WHEN submitting an order THEN the System SHALL include selected addons as a list without quantity
3. WHEN recording the order THEN the System SHALL store the meal unit price, quantity, and calculated subtotal
4. WHEN recording the order THEN the System SHALL store addon prices and names as before

### Requirement 5

**User Story:** As a system, I want to validate quantity values, so that pricing calculations are always correct.

#### Acceptance Criteria

1. WHEN validating quantity THEN the System SHALL verify quantity is a positive integer
2. WHEN calculating subtotals THEN the System SHALL ensure the result is a valid number
3. WHEN quantity is less than one THEN the System SHALL reset quantity to one
4. WHEN quantity exceeds reasonable limits THEN the System SHALL cap quantity at 99
5. WHEN calculating totals THEN the System SHALL round the result to whole numbers

### Requirement 6

**User Story:** As a student, I want quantity selection to work with meal options, so that I can customize my order.

#### Acceptance Criteria

1. WHEN a meal has option groups THEN the System SHALL display options alongside the quantity selector
2. WHEN quantity is greater than one THEN the System SHALL apply the same options to all portions
3. WHEN calculating the meal subtotal THEN the System SHALL multiply the base price by quantity
4. WHEN submitting the order THEN the System SHALL record the selected options once for all portions
