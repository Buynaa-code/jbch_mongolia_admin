---
name: flutter-bug-fix
description: Diagnose and fix Flutter/Dart errors, exceptions, and runtime crashes. Use this skill whenever a user pastes a Flutter error message, stack trace, exception, or describes a bug. Also trigger when user says "ажиллахгүй байна", "алдаа гарлаа", "error гарж байна", "fix", "яагаад ажиллахгүй вэ", or shows broken code. Covers: Null safety errors, BLoC state issues, widget build errors, navigation crashes, Dio/API errors, platform-specific issues, and performance problems.
---

# Flutter Bug Fix Agent

Systematically diagnose and fix Flutter bugs with clear explanations and corrected code.

---

## Diagnosis Process

When a bug is reported, always follow this sequence:

### Step 1: Identify Error Type
Classify the error from the stack trace or description:

| Error Type | Keywords | Common Cause |
|---|---|---|
| **Null Safety** | `Null check operator`, `LateInitializationError` | Uninitialized variable, missing null check |
| **Widget Build** | `setState() called after dispose`, `RenderFlex overflow` | Async state update after widget disposal |
| **BLoC/State** | `BlocProvider.of() called with a context that does not contain` | BlocProvider not in widget tree |
| **Navigation** | `Navigator operation requested with a context that includes a Navigator` | Wrong context used |
| **Network/Dio** | `DioException`, `SocketException`, `TimeoutException` | Network failure, wrong URL, no internet |
| **Platform** | `MissingPluginException` | Plugin not registered, missing platform setup |
| **Overflow** | `A RenderFlex overflowed` | Missing `Expanded`, `Flexible`, or `SingleChildScrollView` |
| **Type** | `type 'X' is not a subtype of type 'Y'` | Wrong type cast, JSON parsing mismatch |

---

## Common Bug Fixes

### 🔴 Null Safety Errors

**Error**: `Null check operator used on a null value`
```dart
// ❌ Broken
String name = user!.name;

// ✅ Fixed
String name = user?.name ?? 'Unknown';
// or
if (user != null) {
  String name = user.name;
}
```

**Error**: `LateInitializationError: Field has not been initialized`
```dart
// ❌ Broken
late AnimationController _controller;

@override
void initState() {
  super.initState();
  // forgot to initialize
}

// ✅ Fixed
@override
void initState() {
  super.initState();
  _controller = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 300),
  );
}
```

---

### 🔴 setState() After Dispose

**Error**: `setState() called after dispose()`
```dart
// ❌ Broken
Future<void> loadData() async {
  final data = await fetchData();
  setState(() => _data = data); // widget might be disposed by now
}

// ✅ Fixed
Future<void> loadData() async {
  final data = await fetchData();
  if (mounted) {
    setState(() => _data = data);
  }
}
```

---

### 🔴 BlocProvider Context Error

**Error**: `BlocProvider.of() called with a context that does not contain a Bloc`
```dart
// ❌ Broken — using context of the widget that HAS the BlocProvider
Widget build(BuildContext context) {
  return BlocProvider(
    create: (_) => MyBloc(),
    child: Text(context.read<MyBloc>().state.toString()), // wrong context!
  );
}

// ✅ Fixed — use Builder to get child context
Widget build(BuildContext context) {
  return BlocProvider(
    create: (_) => MyBloc(),
    child: Builder(
      builder: (context) => Text(context.read<MyBloc>().state.toString()),
    ),
  );
}
```

---

### 🔴 RenderFlex Overflow

**Error**: `A RenderFlex overflowed by X pixels on the bottom`
```dart
// ❌ Broken
Column(
  children: [
    // too many items
  ],
)

// ✅ Fixed — option 1: make scrollable
SingleChildScrollView(
  child: Column(children: [...]),
)

// ✅ Fixed — option 2: use Expanded in Row/Column
Row(
  children: [
    Expanded(child: Text('Long text that causes overflow')),
    Icon(Icons.check),
  ],
)
```

---

### 🔴 Dio Network Errors

**Error**: `DioException [connection error]: The connection errored`
```dart
// ✅ Proper Dio error handling
try {
  final response = await dio.get('/endpoint');
  return response.data;
} on DioException catch (e) {
  switch (e.type) {
    case DioExceptionType.connectionTimeout:
    case DioExceptionType.receiveTimeout:
      throw TimeoutException();
    case DioExceptionType.connectionError:
      throw NetworkException();
    case DioExceptionType.badResponse:
      throw ServerException(e.response?.statusCode ?? 500);
    default:
      throw UnknownException();
  }
}
```

---

### 🔴 Navigator Context Error

**Error**: `Navigator operation requested with a context that includes a Navigator`
```dart
// ❌ Broken — navigating in the same build as MaterialApp
class MyApp extends StatelessWidget {
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Builder(builder: (ctx) {
        Navigator.of(context).push(...); // wrong — using outer context
      }),
    );
  }
}

// ✅ Fixed — use Navigator key or Builder with correct context
final navigatorKey = GlobalKey<NavigatorState>();

MaterialApp(
  navigatorKey: navigatorKey,
  home: MyHomePage(),
)

// Then navigate from anywhere:
navigatorKey.currentState?.push(MaterialPageRoute(builder: (_) => NewPage()));
```

---

### 🔴 JSON Parsing Type Mismatch

**Error**: `type 'int' is not a subtype of type 'String'`
```dart
// ❌ Broken
factory UserModel.fromJson(Map<String, dynamic> json) => UserModel(
  id: json['id'],       // API returns int, model expects String
  name: json['name'],
);

// ✅ Fixed
factory UserModel.fromJson(Map<String, dynamic> json) => UserModel(
  id: json['id'].toString(),   // safe conversion
  name: json['name'] as String? ?? '',
);
```

---

### 🔴 MissingPluginException

**Error**: `MissingPluginException(No implementation found for method X on channel Y)`

Fixes:
```bash
# 1. Stop app and run:
flutter clean
flutter pub get
flutter run

# 2. For iOS:
cd ios && pod install && cd ..

# 3. For Android — check AndroidManifest.xml and MainActivity registrations

# 4. If using Flutter plugin in background isolate:
# You must call ensureInitialized()
void main() async {
  WidgetsFlutterBinding.ensureInitialized(); // ADD THIS
  await Firebase.initializeApp();
  runApp(MyApp());
}
```

---

### 🔴 Async Build Context Warning

**Warning**: `Do not use BuildContext across async gaps`
```dart
// ❌ Broken
Future<void> onPressed() async {
  await someAsyncOperation();
  Navigator.of(context).pop(); // context might be invalid
}

// ✅ Fixed
Future<void> onPressed() async {
  await someAsyncOperation();
  if (!context.mounted) return; // guard check
  Navigator.of(context).pop();
}
```

---

## Debugging Commands

```bash
# Detailed error logs
flutter run --verbose

# Analyze code for warnings
flutter analyze

# Check for dependency issues
flutter pub deps

# Clean and rebuild
flutter clean && flutter pub get && flutter run

# Run on specific device
flutter run -d <device-id>

# Profile mode for performance
flutter run --profile
```

---

## Response Format

When fixing a bug, always provide:
1. **Алдааны тайлбар** — What went wrong and why (in plain language)
2. **Засварласан код** — Complete fixed code block
3. **Урьдчилан сэргийлэх** — How to avoid this in the future
