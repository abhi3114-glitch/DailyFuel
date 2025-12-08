# DailyFuel

A minimal, privacy-focused web expense tracker designed for rapid daily entry. Built with React and localStorage, DailyFuel works entirely in your browser with no backend required.

---

## Table of Contents

1. [Features](#features)
2. [Technology Stack](#technology-stack)
3. [Getting Started](#getting-started)
4. [Usage Guide](#usage-guide)
5. [Data Storage](#data-storage)
6. [Configuration](#configuration)
7. [Project Structure](#project-structure)
8. [Contributing](#contributing)
9. [License](#license)

---

## Features

### Core Functionality

- **Quick Add Form**: Fast, keyboard-friendly expense entry with amount, category, and optional notes.
- **Dashboard**: Summary cards showing weekly, monthly, and total spend with category breakdown.
- **Budget Watch**: Set a daily spending limit and receive visual warnings when exceeded.

### Advanced Features

- **Multi-Currency Support**: Choose from USD, EUR, GBP, INR, JPY, or SEK. Your preference is saved.
- **Monthly View with Trends**: Toggle between week/month/all views. Includes a bar chart showing the last 6 months of spending.
- **Recurring Expenses**: Mark expenses as recurring (monthly). Identified with a dedicated icon in the list.
- **Custom Categories**: Add and manage your own expense categories beyond the defaults.
- **Search and Filter**: Find expenses by keyword, category, or date range.
- **Edit Expenses**: Modify any existing expense via a modal editor.
- **Theme Toggle**: Switch between dark and light modes.
- **CSV Export**: Download all your expense data for use in spreadsheets or accounting software.
- **Demo Mode**: Load sample data to explore the app without entering real expenses.

---

## Technology Stack

| Component   | Technology                     |
|-------------|-------------------------------|
| Framework   | React (Vite)                   |
| Charts      | Chart.js / react-chartjs-2    |
| Icons       | Lucide React                   |
| Date Utils  | date-fns                       |
| Styling     | Vanilla CSS (custom variables) |
| Storage     | Browser localStorage           |

---

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/abhi3114-glitch/DailyFuel.git
   cd DailyFuel
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the URL shown (typically `http://localhost:5173`).

### Production Build

To create an optimized production build:

```bash
npm run build
```

The output will be in the `dist/` folder.

---

## Usage Guide

### Adding an Expense

1. Enter the amount in the Quick Add form.
2. Select a category from the dropdown.
3. Optionally add a note.
4. Check "Recurring" if this expense repeats monthly.
5. Click "Add Expense".

### Viewing Statistics

- Use the Week / Month / All toggle buttons on the Dashboard to change the time range.
- The pie chart shows category distribution for the selected period.
- The bar chart shows spending trends over the last 6 months.

### Managing Custom Categories

1. Open Settings (gear icon in header).
2. Enter a new category name.
3. Click the "+" button to add.
4. Custom categories appear as tags and can be removed with the "X" button.

### Editing or Deleting Expenses

- In the Recent Activity list, click the pencil icon to edit or the trash icon to delete.
- The edit modal allows changing amount, category, note, and recurring status.

### Exporting Data

- Click the download icon in the header to export all expenses as a CSV file.

### Changing Theme

- Click the sun/moon icon in the header to toggle between dark and light modes.

---

## Data Storage

All data is stored in your browser's localStorage under the following keys:

| Key                           | Description                    |
|-------------------------------|-------------------------------|
| `dailyfuel_expenses`          | Array of expense objects       |
| `dailyfuel_limit`             | Daily budget limit             |
| `dailyfuel_currency`          | Selected currency symbol       |
| `dailyfuel_theme`             | Current theme (dark/light)     |
| `dailyfuel_custom_categories` | User-defined categories        |

No data is sent to any external server. Your financial information remains private.

---

## Configuration

### Default Categories

The following categories are included by default:

- Food
- Transport
- Shopping
- Entertainment
- Health
- Bills
- Other

You can add custom categories via the Settings panel.

### Supported Currencies

| Symbol | Currency           |
|--------|--------------------|
| $      | US Dollar (USD)    |
| EUR    | Euro (EUR)         |
| GBP    | British Pound (GBP)|
| INR    | Indian Rupee (INR) |
| JPY    | Japanese Yen (JPY) |
| kr     | Swedish Krona (SEK)|

---

## Project Structure

```
DailyFuel/
  src/
    components/
      BudgetStatus.jsx    # Daily limit progress bar
      Dashboard.jsx       # Statistics and charts
      EditModal.jsx       # Expense editor modal
      ExpenseForm.jsx     # Quick add form
      ExpenseList.jsx     # Filtered expense list
    hooks/
      useExpenses.js      # State management and persistence
    App.jsx               # Main application component
    index.css             # Global styles and theme variables
    main.jsx              # React entry point
  index.html
  package.json
  vite.config.js
  README.md
```

---

## Contributing

Contributions are welcome. To contribute:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes with descriptive messages.
4. Push to your fork and open a pull request.

Please ensure your code follows the existing style and includes appropriate comments where necessary.

---

## License

This project is open source and available under the MIT License.

---

## Acknowledgments

- [Vite](https://vitejs.dev/) for the fast development experience
- [Chart.js](https://www.chartjs.org/) for charting capabilities
- [Lucide](https://lucide.dev/) for beautiful icons
- [date-fns](https://date-fns.org/) for date manipulation
