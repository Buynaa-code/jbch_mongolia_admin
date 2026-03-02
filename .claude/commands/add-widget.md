# Add Widget Command

Create a polished, reusable Flutter widget following the project's design system.

## Usage
```
/add-widget <widget_name> [description]
```
Examples:
- `/add-widget AppButton primary action button with loading state`
- `/add-widget UserAvatar circular avatar with fallback initials`
- `/add-widget LoadingOverlay full-screen loading overlay`

## Instructions

When this command is run with `$ARGUMENTS`:

### Step 1: Understand the Widget
- What does it display or do?
- Is it shared (lib/shared/widgets/) or feature-specific?
- What variants/states does it need? (loading, disabled, error, empty)
- What parameters should it accept?

### Step 2: Design Guidelines
Apply flutter-design skill principles:
- Use `AppColors` from theme — never hardcode colors
- Use `AppTextStyles` — never hardcode TextStyle
- Use `AppSpacing` constants for padding/margin
- `const` constructor required
- Smooth animations with `flutter_animate` or `AnimatedContainer`
- Mongolian text support (no hard-coded English UI labels)

### Step 3: Generate Widget Code

```dart
/// {Widget description}
/// 
/// Usage:
/// ```dart
/// {WidgetName}(
///   // params
/// )
/// ```
class {WidgetName} extends StatelessWidget {
  // well-documented parameters
  // sensible defaults
  // const constructor

  const {WidgetName}({
    super.key,
    required this.requiredParam,
    this.optionalParam,
    this.onTap,
  });

  final Type requiredParam;
  final Type? optionalParam;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return // polished implementation
  }
}
```

### Step 4: Variants & States
If widget has states (loading, disabled, error):
```dart
// Show all states clearly in the widget
// Use AnimatedSwitcher for state transitions
// Handle null/empty gracefully
```

### Step 5: Usage Example
Always end with a usage example in a comment.

## Shared Widgets Location
- `lib/shared/widgets/` — app-wide reusable
- `lib/features/{feature}/presentation/widgets/` — feature-specific

## Quality Checklist
- [ ] `const` constructor
- [ ] Uses `AppColors`, `AppTextStyles`, `AppSpacing`  
- [ ] Handles loading/error/empty states if applicable
- [ ] Has doc comment with usage example
- [ ] Smooth animations
- [ ] Accessible (semantics label if needed)
