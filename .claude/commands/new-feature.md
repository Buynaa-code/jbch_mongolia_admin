# New Feature Command

Scaffold a complete Flutter feature following Clean Architecture.

## Usage
```
/new-feature <feature_name>
```
Example: `/new-feature user_profile`

## Instructions

When this command is run with a feature name `$ARGUMENTS`:

1. **Confirm the feature** — ask what data/functionality it needs if unclear

2. **Generate ALL files** in this exact order:

### Domain Layer
- `lib/features/$ARGUMENTS/domain/entities/{name}.dart` — Equatable entity
- `lib/features/$ARGUMENTS/domain/repositories/{name}_repository.dart` — abstract interface
- `lib/features/$ARGUMENTS/domain/usecases/get_{name}.dart` — use case(s)

### Data Layer
- `lib/features/$ARGUMENTS/data/models/{name}_model.dart` — fromJson/toJson model extending entity
- `lib/features/$ARGUMENTS/data/datasources/{name}_remote_datasource.dart` — Dio-based impl
- `lib/features/$ARGUMENTS/data/repositories/{name}_repository_impl.dart` — Either<Failure, T> impl

### Presentation Layer
- `lib/features/$ARGUMENTS/presentation/bloc/{name}_cubit.dart` — Cubit with loading/loaded/error
- `lib/features/$ARGUMENTS/presentation/bloc/{name}_state.dart` — sealed states with Equatable
- `lib/features/$ARGUMENTS/presentation/pages/{name}_page.dart` — BlocProvider + BlocBuilder
- `lib/features/$ARGUMENTS/presentation/widgets/` — at least one feature widget

### DI Registration
Add to `lib/core/di/injection_container.dart`:
```dart
// {FeatureName} feature
sl.registerFactory(() => {Name}Cubit(get{Name}: sl()));
sl.registerLazySingleton(() => Get{Name}(sl()));
sl.registerLazySingleton<{Name}Repository>(() => {Name}RepositoryImpl(remoteDataSource: sl(), networkInfo: sl()));
sl.registerLazySingleton<{Name}RemoteDataSource>(() => {Name}RemoteDataSourceImpl(sl()));
```

### GoRouter Route
Add route to `lib/core/router/app_router.dart`

3. **Summary** — list all created files with brief description

## Rules
- All UI strings in Mongolian
- Use `Either<Failure, T>` for all repo methods
- States must extend `Equatable`
- Use `const` constructors
- Follow naming conventions in CLAUDE.md
