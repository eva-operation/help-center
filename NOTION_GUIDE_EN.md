# Notion Data Management and Editor Guide

This guide explains how to manage content in the Help Center application via Notion. The application is built on four main databases: **Apps**, **Modules**, **Topics**, and **Articles**.

---

## 🚀 General Rules
- **Status:** Records must be set to "Active" (or "Published" for Articles) to be visible.
- **Key/Slug:** Should not contain spaces; use lowercase letters and hyphens (`-`) (e.g., `account-settings`).
- **Order:** Consists of numbers (1, 2, 3...). Smaller numbers always appear at the top.

---

## 1. Help Center Apps
Represents the large cards on the home page.

| Property | Type | Description |
| :--- | :--- | :--- |
| **Title / Name** | Title | Name of the app (e.g., Eva Operation). |
| **Key** | Text | Identity that will appear in the URL (e.g., `eva-operation`). |
| **Description** | Text | Short description in English. |
| **TR Description** | Text | Short description in Turkish. |
| **ZH Description** | Text | Short description in Chinese. |
| **Icon** | File | Image to appear on the card (URL or Upload). |
| **Order** | Number | Display order on the home page. |
| **Status** | Select | Must be "Active". |

---

## 2. Help Center Modules
Main sections listed in the left menu or below when an application is clicked.

| Property | Type | Description |
| :--- | :--- | :--- |
| **Name** | Title | English name of the module (e.g., Settings). |
| **TR Name** | Text | Turkish name of the module (e.g., Ayarlar). |
| **ZH Name** | Text | Chinese name of the module. |
| **Description** | Text | English module description. |
| **TR Description** | Text | Turkish module description. |
| **ZH Description** | Text | Chinese module description. |
| **Key** | Text | URL identity (e.g., `settings`). |
| **Help Center Apps** | Relation | Select which app(s) this module belongs to. |
| **Order** | Number | Sorting order among modules. |
| **Status** | Select | Must be "Active". |

---

## 3. Help Center Topics
The categorization structure under modules.

| Property | Type | Description |
| :--- | :--- | :--- |
| **Name** | Title | Name of the topic. |
| **TR Name** | Text | Turkish name of the topic. |
| **ZH Name** | Text | Chinese name of the topic. |
| **Description** | Text | English topic description. |
| **TR Description** | Text | Turkish topic description. |
| **ZH Description** | Text | Chinese topic description. |
| **Help Center Apps** | Relation | Related Application (Required). |
| **Help Center Modules**| Relation | Related Module (Required). |
| **Order** | Number | Sorting order among topics. |
| **Status** | Select | Must be "Active". |

---

## 4. Help Center Articles
The database where the actual content and reading pages are located.

| Property | Type | Description |
| :--- | :--- | :--- |
| **Title** | Title | Article title. |
| **Slug** | Text | Unique URL extension (e.g., `how-to-reset-password`). |
| **Excerpt** | Text | Short summary appearing at the beginning of the article. **Formatting and bold text are supported.** |
| **Language** | Select | Select "en", "tr", or "zh". |
| **Status** | Select | Select **"Published"** when the article is ready for release. |
| **Visibility** | Select | Select **"Public"**. |
| **Order** | Number | Priority order within the list. |
| **Help Center Apps** | Relation | App(s) it is linked to. |
| **Help Center Modules**| Relation | Module(s) it is linked to. |
| **Help Center Topics** | Relation | Topic it is linked to. |
| **Related Articles** | Relation | Other articles that will appear as "Related Articles" at the bottom of the page. |

### 📝 Tips for Preparing Article Content:
- **Callout:** You can use Notion Callout blocks for important notes. Colors are supported.
- **Tables:** Inline coloring and line breaks are supported.
- **Headings:** Create a hierarchy using Heading 1, 2, and 3. These will be automatically added to the "Table of Contents" section on the left.
- **Images:** Images you add to Notion are automatically optimized and displayed.

---

## 💡 Tip for Editors
When adding a new language (e.g., writing the English version of an article), make sure to select the **Language** field correctly and ensure that the related **Topics** and **Modules** links are set up accurately. The application will automatically filter according to the selected language.
