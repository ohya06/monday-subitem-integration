# Monday.com Subitem Integration

This project is a custom integration for Monday.com, built using Node.js. It listens for a status change on a board and automatically creates a subitem under the corresponding item. The subitem:

- Uses the same name as the parent item
- Gets a due date 7 days ahead based on the parent’s date column

---

## Features

- Listens for status updates using Monday.com’s trigger system
- Fetches parent item information via the Monday API
- Dynamically creates subitems with identical names
- Sets the subitem's due date to 7 days after the parent item’s date

---

## Technologies

- Node.js
- Express
- Monday.com SDK
- GraphQL for API queries/mutations

---


## How It Works

- This app uses a built-in status change trigger from Monday.com.
- The action runs when the status field changes to anything.
- The integration:
  1. Gets the item name and board ID
  2. Creates a subitem under the changed item
  3. Looks for the first available date column on the subitem board
  4. Sets the subitem's due date to 7 days after the parent’s date

---

## Folder Structure

quickstart-integrations/
│
├── src/
│   ├── app.js
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   └── middlewares/
│
├── .env (not committed)
├── package.json
└── README.md

---


## Contact

Built by @ohya06 – feel free to reach out with questions or feedback.
