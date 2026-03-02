# Fix Bug Command

Diagnose and fix a Flutter bug or error.

## Usage
```
/fix-bug
```
Then paste the error message, stack trace, or describe the problem.

## Instructions

When this command is run with `$ARGUMENTS` (error description or stack trace):

### Step 1: Classify the Error
Identify error type from the message:
- **Null Safety** → `Null check operator`, `LateInitializationError`
- **Async/Dispose** → `setState() called after dispose`
- **BLoC Context** → `does not contain a Bloc/Cubit`
- **Overflow** → `RenderFlex overflowed`
- **Network** → `DioException`, `SocketException`
- **Navigation** → `Navigator operation requested`
- **Platform** → `MissingPluginException`
- **Type** → `is not a subtype of type`
- **Build** → `build_runner`, codegen errors

### Step 2: Locate the Problem
- Read the stack trace — identify the exact file and line
- Ask to see the relevant code if not provided
- Check for common patterns in that code

### Step 3: Explain the Bug
In plain language (Mongolian if user wrote in Mongolian):
- What went wrong
- Why it happened
- What the fix will do

### Step 4: Provide the Fix
Always show:
```
// ❌ Хуучин (broken)
[original broken code]

// ✅ Засварласан (fixed)
[corrected code with explanation comments]
```

### Step 5: Prevention
- How to avoid this in the future
- Pattern or rule to remember

## Common Fixes Reference

| Error | Fix |
|---|---|
| Null check on null | Use `?.` and `??` operators |
| setState after dispose | Add `if (mounted)` check |
| BLoC not found | Move BlocProvider up the tree or use Builder |
| Overflow | Wrap with Expanded, Flexible, or SingleChildScrollView |
| DioException | Wrap in try/catch, check e.type |
| MissingPlugin | Run `flutter clean && flutter pub get` |
| Context after async | Check `context.mounted` |

## Response Format
1. 🔍 **Алдааны төрөл** — error classification
2. 📍 **Алдааны байршил** — where it occurs
3. 💡 **Шалтгаан** — why it happened
4. ✅ **Засвар** — fixed code
5. 🛡️ **Урьдчилан сэргийлэх** — prevention tip
