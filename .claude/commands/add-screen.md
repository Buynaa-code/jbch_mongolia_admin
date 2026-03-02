# Add Screen Command

Create a new Flutter screen/page with matching Cubit, state, and route.

## Usage
```
/add-screen <screen_name> [feature_name]
```
Examples:
- `/add-screen login auth`
- `/add-screen home dashboard`

## Instructions

When this command is run with `$ARGUMENTS`:

1. **Parse arguments** — first word is screen name, second (optional) is feature folder

2. **Generate files**:

### Cubit & State
```dart
// lib/features/{feature}/presentation/bloc/{screen}_cubit.dart
class {Screen}Cubit extends Cubit<{Screen}State> {
  {Screen}Cubit() : super({Screen}Initial());
  // add methods based on screen purpose
}

// lib/features/{feature}/presentation/bloc/{screen}_state.dart
sealed class {Screen}State extends Equatable {}
class {Screen}Initial extends {Screen}State { @override List<Object?> get props => []; }
class {Screen}Loading extends {Screen}State { @override List<Object?> get props => []; }
class {Screen}Loaded extends {Screen}State { /* data fields */ }
class {Screen}Error extends {Screen}State { final String message; }
```

### Page
```dart
// lib/features/{feature}/presentation/pages/{screen}_page.dart
class {Screen}Page extends StatelessWidget {
  const {Screen}Page({super.key});

  static const routePath = '/{screen}';

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => sl<{Screen}Cubit>(),
      child: const {Screen}View(),
    );
  }
}

class {Screen}View extends StatelessWidget {
  const {Screen}View({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // styled scaffold — follow flutter-design skill
      // use AppColors, AppTextStyles
      // Mongolian UI text
    );
  }
}
```

### Route Registration
Add to GoRouter:
```dart
GoRoute(
  path: {Screen}Page.routePath,
  builder: (context, state) => const {Screen}Page(),
),
```

3. **Style requirements**
- Custom AppBar with back button if nested
- Proper safe area handling
- Loading state with shimmer or CircularProgressIndicator
- Error state with retry button
- Empty state if list-based

## Rules
- UI text in Mongolian
- Never use default unstyled widgets
- Always wrap in BlocProvider
- Register Cubit in DI
