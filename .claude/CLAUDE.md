# Flutter Project — Claude Rules

## 🧠 Project Overview
This is a Flutter mobile application with Clean Architecture, BLoC state management, and Mongolian language UI support.

## 📐 Architecture
- **Pattern**: Clean Architecture (4 layers)
- **State Management**: flutter_bloc (BLoC + Cubit)
- **DI**: get_it + injectable
- **Navigation**: go_router
- **Networking**: dio + retrofit
- **Local Storage**: shared_preferences, hive

## 📁 Folder Structure
```
lib/
├── core/
│   ├── di/                  # Dependency injection
│   ├── error/               # Failures, Exceptions
│   ├── network/             # Dio client, interceptors, token storage
│   ├── router/              # GoRouter configuration
│   ├── theme/               # AppTheme, colors, text styles
│   └── utils/               # Extensions, constants, helpers
├── features/
│   └── {feature_name}/
│       ├── data/
│       │   ├── datasources/ # Remote & Local data sources
│       │   ├── models/      # JSON-serializable models
│       │   └── repositories/# Repository implementations
│       ├── domain/
│       │   ├── entities/    # Pure Dart entities
│       │   ├── repositories/# Abstract repository interfaces
│       │   └── usecases/    # Single-responsibility use cases
│       └── presentation/
│           ├── bloc/        # Cubit/BLoC + State + Event files
│           ├── pages/       # Full screen widgets
│           └── widgets/     # Feature-specific reusable widgets
├── shared/
│   ├── widgets/             # App-wide reusable widgets
│   └── extensions/          # Dart extensions
└── main.dart
```

## 🔤 Naming Conventions
- Files: `snake_case.dart`
- Classes: `PascalCase`
- Variables/functions: `camelCase`
- Constants: `kConstantName`
- Private: `_privateName`
- BLoC files: `{feature}_cubit.dart`, `{feature}_state.dart`
- Pages: `{feature}_page.dart`
- Models: `{feature}_model.dart`

## 🌐 Language
- UI text is in **Mongolian (Cyrillic)** — always preserve Mongolian strings
- Code, comments, and variable names are in **English**
- Error messages shown to users should be in Mongolian

## 📦 Key Dependencies
```yaml
flutter_bloc: ^8.1.3
equatable: ^2.0.5
dartz: ^0.10.1
get_it: ^7.6.4
injectable: ^2.3.2
dio: ^5.3.2
go_router: ^12.0.0
google_fonts: ^6.1.0
shared_preferences: ^2.2.1
flutter_animate: ^4.3.0
connectivity_plus: ^5.0.1
```

## ✅ Code Rules
1. All repository methods return `Either<Failure, T>` (dartz)
2. Every Cubit state must extend `Equatable`
3. Use `if (mounted) setState(...)` for async state updates
4. Always check `context.mounted` after async gaps
5. Register every new class in GetIt DI container
6. Never use `!` null assertion — use null-safe alternatives
7. Every feature must have its own BlocProvider in the route
8. Use `const` constructors wherever possible
9. Never hardcode colors — use `AppColors` class
10. Never hardcode strings — use `AppStrings` or l10n

## 🚫 Never Do
- `Colors.blue` or `Colors.white` directly — use `AppColors`
- Default `AppBar` without custom styling
- `ElevatedButton` without `style` override
- `print()` for logging — use `debugPrint()` or logger package
- Hardcode API URLs — use `ApiConstants`
- `BuildContext` across async gaps without `mounted` check

## 🤖 Agent Roles
- `flutter-orchestrator` — coordinates all agents, entry point
- `flutter-architecture-expert` — Clean Architecture decisions
- `flutter-ux-designer` — UI/UX, design system
- `flutter-widget-builder` — widget code generation
- `flutter-state-architect` — BLoC/Cubit patterns
- `flutter-backend-integration` — API, Dio, data layer
- `flutter-bug-coordinator` — debugging and fixes
- `flutter-test-qa` — testing strategy
- `flutter-performance-optimizer` — optimization
- `flutter-platform-integration` — iOS/Android native

## 🔄 Workflow
When adding a new feature, always follow this order:
1. Entity (domain) → 2. Repository interface (domain) → 3. Use case (domain)
4. Model (data) → 5. Data source (data) → 6. Repository impl (data)
7. Cubit + State (presentation) → 8. Page + Widgets (presentation)
9. Register in DI → 10. Add route in GoRouter
