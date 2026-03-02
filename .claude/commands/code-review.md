# Code Review Command

Review Flutter/Dart code for quality, architecture, and best practices.

## Usage
```
/code-review
```
Then paste the code to review, or specify a file path.

## Instructions

When this command is run with `$ARGUMENTS` (code or file path):

### Review Dimensions

#### 1. 🏗️ Architecture (Clean Architecture compliance)
- Is the code in the correct layer?
- Are dependencies pointing inward (domain ← data, domain ← presentation)?
- Is business logic leaking into widgets?
- Are use cases single-responsibility?

#### 2. 🔒 Null Safety
- Any `!` null assertions that could crash?
- Missing null checks on nullable fields?
- `late` variables properly initialized?

#### 3. ⚡ Performance
- Unnecessary `setState` rebuilds?
- Missing `const` constructors?
- Heavy operations in `build()` method?
- `ListView` without `itemExtent` for long lists?
- Images without caching?

#### 4. 🧱 Widget Quality
- Deeply nested widgets (>5 levels) → extract to separate widgets
- Missing `key` parameters on list items?
- `Column` inside `SingleChildScrollView` without `mainAxisSize`?

#### 5. 🔄 State Management
- BLoC/Cubit states use `Equatable`?
- States are immutable?
- `emit()` not called after `close()`?
- `BlocBuilder` rebuilding unnecessarily (use `buildWhen`)?

#### 6. 🌐 Async Handling
- `BuildContext` used after async gap without `mounted` check?
- Errors properly caught and mapped to Failure?
- Loading/error states handled in UI?

#### 7. 📝 Code Style
- Follows naming conventions in CLAUDE.md?
- No hardcoded colors (use AppColors)?
- No hardcoded strings (use AppStrings/l10n)?
- No `print()` statements?

### Output Format

```
## 🔍 Code Review: {filename or description}

### ✅ Сайн зүйлс
- [what's done well]

### ⚠️ Анхааруулга (Warnings)
- [issues that should be fixed]

### 🔴 Заавал засах (Critical)
- [bugs or architectural violations]

### 💡 Санал (Suggestions)
- [optional improvements]

### 📊 Дүн (Score)
Architecture: X/10
Code Quality: X/10  
Performance: X/10
```

Then provide refactored code for all critical issues.
