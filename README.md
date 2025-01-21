# Rule Engine Visualizer

A React-based visualization tool for rule engine conditions, displaying them in an interactive tree structure. The tool organizes rules by MCC (Merchant Category Code) and visualizes the rule hierarchy.

## Features

- Groups rules by MCC codes
- Interactive tree visualization
- Expandable/collapsible nodes
- Clear visualization of rule hierarchies
- Error message display at leaf nodes
- Responsive design

## Rule Hierarchy

The visualization follows this hierarchy:
1. MCC (Merchant Category Code)
2. Transaction Purpose
3. Initiation Mode
4. Transaction Subtype
5. VPA Verification Status
6. Genre

## Installation

1. Clone the repository:
```bash
git clone https://github.com/krishnatejak/rule-engine-visualizer.git
cd rule-engine-visualizer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open http://localhost:5173 in your browser

## Usage

### Rule Format

Place your rules in `public/rules.txt`. Each rule should be on a new line in the following JSON format:

```json
{
  "Condition": {
    "Mcc": ["5969", "6211"],
    "Genre": null,
    "Verified": true,
    "TxnPurpose": ["60"],
    "TxnSubType": ["PAY"],
    "TxnInitiationMode": "QR"
  },
  "Validations": [{
    "Arguments": [],
    "FunctionName": "NotAllowed"
  }],
  "ErrorMessageFormat": "Request Declined: MCC not allowed."
}
```

### Fields Description

- `Mcc`: Array of merchant category codes
- `Genre`: String value ("online"/"offline") or null
- `Verified`: Boolean or null
- `TxnPurpose`: Array of transaction purpose codes
- `TxnSubType`: Array of transaction subtypes ("PAY"/"COLLECT")
- `TxnInitiationMode`: String value ("QR"/"INTENT"/etc.) or null

## Building for Production

To create a production build:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Tech Stack

- React
- Vite
- Tailwind CSS