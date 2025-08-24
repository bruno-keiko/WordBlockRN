# WordBlockRN

A mobile application for tracking and managing vocabulary words with usage statistics and screen time tracking.

## 🌟 Features

- Track and manage vocabulary words
- Screen time and usage statistics
- Offline-first functionality
- Fast performance with large word collections
- Cross-platform (iOS & Android)

## 🏗️ Architecture Overview

WordBlockRN is built with a clean architecture approach, separating concerns into distinct layers:

```
src/
├── entity/          # Core business entities and models
├── feature/         # Feature modules (add-word, learn-word)
├── pages/           # Screen components
└── shared/          # Shared utilities and components
    ├── lib/        # Reusable libraries
    ├── types/      # TypeScript type definitions
    └── constants/  # App-wide constants
```

### Key Technologies

- React Native
- TypeScript
- React Navigation
- SQLite (via react-native-sqlite-storage)

## 💾 Storage Choice Justification

### SQLite for Word Storage

- **Why SQLite?**
  - Full-text search capabilities for efficient word lookup
  - ACID compliance ensures data integrity
  - Handles large datasets (10k+ words) efficiently
  - Native support on both iOS and Android
  - Mature and battle-tested

## ⏱️ Screen Time & Usage Tracking

### Approach

1. **Usage Monitoring**

   - Tracks active app usage with app state listeners
   - Records session duration and frequency
   - Implements idle detection to filter out inactive time

2. **Permission Handling**
   - Only requests necessary permissions
   - Gracefully degrades when permissions are denied
   - Provides clear explanations for permission requests
   - Offers in-app guidance for enabling permissions

## 🚀 Performance Optimizations

### Handling 10,000+ Words

1. **Pagination**

   - Implements efficient pagination for word lists
   - Loads data in chunks to minimize memory usage

2. **UI Optimizations**
   - Uses FlatList with windowing
   - Implements shouldComponentUpdate for performance-critical components
   - Optimizes re-renders with React.memo

