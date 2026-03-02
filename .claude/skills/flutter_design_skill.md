# Flutter Design Skill

**Name**: flutter-design  
**Description**: Create distinctive, production-grade Flutter interfaces with high design quality. Use when building Flutter widgets, screens, apps, or UI components. Generates creative, polished Dart/Flutter code that avoids generic Material Design defaults and cookie-cutter aesthetics.

---

This skill guides creation of distinctive, production-grade Flutter interfaces that avoid generic "default Material" aesthetics. Implement real working Dart code with exceptional attention to aesthetic details and creative choices.

The user provides Flutter UI requirements: a widget, screen, app, or interface to build. They may include context about the purpose, audience, platform target (iOS/Android/Web), or technical constraints.

---

## Design Thinking

Before coding, understand the context and commit to a **BOLD aesthetic direction**:

- **Purpose**: What problem does this screen/widget solve? Who uses it?
- **Tone**: Pick a clear direction — brutally minimal, luxury/refined, playful/toy-like, editorial, soft/glassmorphic, brutalist/raw, neon/cyberpunk, organic/natural, retro-futuristic, art deco/geometric, etc.
- **Platform feel**: Decide whether to lean into platform conventions (Cupertino on iOS) or break away entirely with a custom visual identity.
- **Differentiation**: What makes this UI **unforgettable**? What's the one visual element someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work — the key is intentionality, not intensity.

---

## Flutter Aesthetics Guidelines

### Typography
- Use **Google Fonts** (`google_fonts` package) for distinctive typefaces. Avoid defaulting to Roboto or system fonts.
- Pair a bold display font with a refined body font (e.g., `Playfair Display` + `Lato`, `Bebas Neue` + `Inter`, `Cormorant Garamond` + `DM Sans`).
- Use `TextStyle` with precise `letterSpacing`, `height`, and `fontWeight` to craft refined text hierarchies.
- Never rely on default `Theme.of(context).textTheme` without customization.

### Color & Theme
- Define a **custom `ThemeData`** with a cohesive palette using `ColorScheme.fromSeed` or fully custom `ColorScheme`.
- Use `Color` constants or a design token class for consistency.
- Commit to dominant colors with sharp accents — avoid timid, evenly-distributed palettes.
- Consider dark-first designs; Flutter renders them beautifully with proper `surfaceVariant` and `onSurface` tuning.

### Motion & Animation
- Use `AnimationController` + `CurvedAnimation` for entrance animations (staggered reveals with `Future.delayed`).
- Prefer `TweenAnimationBuilder` and `AnimatedContainer` for simple state-driven transitions.
- Use `Hero` transitions for meaningful screen-to-screen continuity.
- `PageRouteBuilder` with custom `transitionBuilder` for memorable page transitions.
- One well-orchestrated entrance animation creates more delight than scattered micro-interactions.
- Use `flutter_animate` package when available for expressive, chainable animations.

### Layout & Spatial Composition
- Break free from `Column`/`ListView` defaults. Use `Stack` for overlap and layering.
- Use `CustomPaint` for unique backgrounds, geometric shapes, decorative patterns, and textures.
- `Transform` widgets for diagonal/rotated elements and grid-breaking layouts.
- Generous `Padding` and `SizedBox` for negative space — or controlled density with tight grids.
- `ClipPath` with custom `CustomClipper` for non-rectangular shapes.
- `FractionallySizedBox` and `LayoutBuilder` for responsive proportional layouts.

### Backgrounds & Visual Details
- **Never** use flat `Scaffold(backgroundColor: Colors.white)` without intentional reason.
- Use `BoxDecoration` with `gradient` (linear, radial, sweep) for atmospheric backgrounds.
- `CustomPaint` for noise textures, mesh gradients, geometric patterns, and decorative elements.
- `BackdropFilter` with `ImageFilter.blur` for glassmorphism effects.
- `BoxShadow` with multiple layers for dramatic depth and elevation.
- `DecoratedBox` with `border` and `borderRadius` for refined card treatments.
- Simulate grain/noise overlays with blended `CustomPaint` layers.

### Widget Craft
- Prefer `InkWell`/`GestureDetector` with custom feedback over default `ElevatedButton`.
- Use `PhysicalModel` or `Material` with custom `elevation` and `shadowColor` for tactile depth.
- Custom `SliderTheme`, `CheckboxTheme`, `SwitchTheme` — never leave interactive elements unstyled.
- `ShaderMask` for gradient text effects.
- `RichText` with `TextSpan` for mixed-style inline typography.

---

## Code Standards

```dart
// ✅ DO: Custom theme, distinctive font, gradient background
class MyScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0A0A0F),
      body: Container(
        decoration: const BoxDecoration(
          gradient: RadialGradient(
            center: Alignment(-0.3, -0.5),
            radius: 1.2,
            colors: [Color(0xFF1A0A2E), Color(0xFF0A0A0F)],
          ),
        ),
        child: SafeArea(
          child: _buildContent(),
        ),
      ),
    );
  }
}

// ❌ NEVER: Default scaffold, system fonts, no visual identity
class MyScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Title')),
      body: Column(
        children: [
          Text('Hello', style: TextStyle(fontSize: 24)),
          ElevatedButton(onPressed: () {}, child: Text('Press me')),
        ],
      ),
    );
  }
}
```

---

## Packages to Leverage

| Package | Use |
|---|---|
| `google_fonts` | Distinctive typography |
| `flutter_animate` | Expressive animations |
| `animated_background` | Dynamic backgrounds |
| `glassmorphism` | Blur/glass effects |
| `smooth_page_indicator` | Custom page indicators |
| `lottie` | Complex animations |
| `flutter_svg` | Scalable decorative graphics |

---

## NEVER Do This in Flutter UI

- Default `AppBar` with no customization (stock blue/white)
- `ElevatedButton` with no `style` override
- `Text` widgets using only `fontSize` with no `letterSpacing`, `height`, or font family
- `Colors.blue` / `Colors.white` as primary palette without intention
- `ListView.builder` with default `ListTile` — always style list items
- Cookie-cutter `Card` widgets with default elevation and no custom shape
- Predictable, symmetric layouts with no visual tension or hierarchy

---

## Execution Principle

Match implementation complexity to the aesthetic vision:
- **Maximalist** designs → elaborate `CustomPaint`, layered `Stack`, rich animations, multiple `BoxDecoration` layers
- **Minimalist** designs → precision spacing, restrained palette, careful `TextStyle` tuning, subtle `AnimatedOpacity`

**Elegance comes from executing the vision well.**

Every Flutter screen should feel intentionally crafted — not auto-generated. No two screens should look the same. Vary between light and dark themes, different font pairings, different spatial compositions.

Claude is capable of extraordinary Flutter UI work. Commit fully to a distinctive vision and build something unforgettable.
