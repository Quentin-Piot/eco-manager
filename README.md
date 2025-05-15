# Eco Manager 🌱

Eco Manager is a mobile application designed to help you manage your bank accounts and track your expenses efficiently.
Built with Expo and React Native, it offers a user-friendly interface for personal finance management.

## Features

### Bank Account Management

- Create multiple bank accounts (Current, Savings, Cash)
- Customize account colors for easy identification
- View and edit account details
- Track account balances in real-time
- Delete accounts (with transaction handling)

### Transaction Management

- Add new transactions with detailed information
- Categorize transactions for better organization
- Update existing transaction details
- Delete unwanted transactions
- Real-time balance updates

### Spending Categories

- Pre-defined spending categories
- Track expenses by category
- Monitor spending patterns

## Technical Stack

- **Framework**: [Expo](https://expo.dev)
- **UI Framework**: React Native
- **Navigation**: Expo Router (file-based routing)
- **Storage**: AsyncStorage for local data persistence

## Getting Started

1. Install dependencies
   ```bash
   npm install
   ```

2. Start the development server
   ```bash
   npx expo start
   ```

3. Open the app in your preferred environment:
    - iOS Simulator
    - Android Emulator
    - Expo Go on your physical device

## Development

The application uses a file-based routing system through Expo Router. Main components are organized in the `app`
directory:

- Account management components
- Transaction handling
- Category management
- Context providers for state management

## Contributing

This project is maintained by Quentin Piot. Feel free to contribute by submitting issues or pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
