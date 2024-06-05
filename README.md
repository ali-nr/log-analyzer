# Ali's Project

## Prerequisites

- Node.js
- npm

## Installation

1. Navigate to the project directory:

   ```sh
   cd log-analyzer
   ```

2. Install the dependencies:

   ```sh
   npm install
   ```

## Usage

1. Run the log analyzer:

   ```sh
   node index.js
   ```

The output will display the number of unique IP addresses, the top 3 most active IP addresses, and the top 3 most visited URLs (here my assumption was looking at the domain of the URLs because each URL in the log is specific and only /docs/manage-websites/ is repeated twice, however I saw the domains such as faq or docs was repeated multiple times so it made sense to look at the domains and calculate the most visited domains).

## Running Tests

1. Ensure you are in the project directory.

2. Run the tests:

   ```sh
   npm test
   ```
