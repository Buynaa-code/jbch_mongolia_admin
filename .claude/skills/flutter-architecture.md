---
name: flutter-architecture
description: Generate Flutter project architecture, folder structure, BLoC/Cubit patterns, Clean Architecture layers, and boilerplate code. Use this skill whenever a user mentions BLoC, Cubit, Clean Architecture, state management, repository pattern, use cases, data sources, dependency injection, or wants to scaffold a Flutter feature or module. Also trigger when user asks how to structure a Flutter project, set up GetIt, or organize code layers.
---

# Flutter Architecture Skill

Generates production-grade Flutter architecture code following Clean Architecture principles with BLoC/Cubit state management.

## Architecture Overview

```
lib/
├── core/
│   ├── error/         # Failures, Exceptions
│   ├── network/       # Dio client, interceptors
│   ├── utils/         # Extensions, helpers
│   └── di/            # GetIt dependency injection
├── features/
│   └── {feature}/
│       ├── data/
│       │   ├── datasources/    # Remote & Local
│       │   ├── models/         # JSON serializable models
│       │   └── repositories/   # Repository implementations
│       ├── domain/
│       │   ├── entities/       # Pure Dart objects
│       │   ├── repositories/   # Abstract interfaces
│       │   └── usecases/       # Single-responsibility use cases
│       └── presentation/
│           ├── bloc/           # BLoC or Cubit + State + Event
│           ├── pages/          # Full screens
│           └── widgets/        # Feature-specific widgets
└── main.dart
```

---

## Layer Templates

### 1. Entity (Domain Layer)
```dart
// features/{feature}/domain/entities/{name}.dart
class User extends Equatable {
  final String id;
  final String name;
  final String email;

  const User({required this.id, required this.name, required this.email});

  @override
  List<Object?> get props => [id, name, email];
}
```

### 2. Repository Interface (Domain Layer)
```dart
// features/{feature}/domain/repositories/{name}_repository.dart
import 'package:dartz/dartz.dart';

abstract class UserRepository {
  Future<Either<Failure, User>> getUser(String id);
  Future<Either<Failure, List<User>>> getUsers();
}
```

### 3. Use Case (Domain Layer)
```dart
// features/{feature}/domain/usecases/get_user.dart
class GetUser {
  final UserRepository repository;
  GetUser(this.repository);

  Future<Either<Failure, User>> call(String id) {
    return repository.getUser(id);
  }
}
```

### 4. Model (Data Layer)
```dart
// features/{feature}/data/models/{name}_model.dart
class UserModel extends User {
  const UserModel({required super.id, required super.name, required super.email});

  factory UserModel.fromJson(Map<String, dynamic> json) => UserModel(
        id: json['id'],
        name: json['name'],
        email: json['email'],
      );

  Map<String, dynamic> toJson() => {'id': id, 'name': name, 'email': email};
}
```

### 5. Remote Data Source (Data Layer)
```dart
// features/{feature}/data/datasources/{name}_remote_datasource.dart
abstract class UserRemoteDataSource {
  Future<UserModel> getUser(String id);
}

class UserRemoteDataSourceImpl implements UserRemoteDataSource {
  final Dio dio;
  UserRemoteDataSourceImpl(this.dio);

  @override
  Future<UserModel> getUser(String id) async {
    final response = await dio.get('/users/$id');
    if (response.statusCode == 200) {
      return UserModel.fromJson(response.data);
    }
    throw ServerException();
  }
}
```

### 6. Repository Implementation (Data Layer)
```dart
// features/{feature}/data/repositories/{name}_repository_impl.dart
class UserRepositoryImpl implements UserRepository {
  final UserRemoteDataSource remoteDataSource;
  final NetworkInfo networkInfo;

  UserRepositoryImpl({required this.remoteDataSource, required this.networkInfo});

  @override
  Future<Either<Failure, User>> getUser(String id) async {
    if (await networkInfo.isConnected) {
      try {
        final user = await remoteDataSource.getUser(id);
        return Right(user);
      } on ServerException {
        return Left(ServerFailure());
      }
    } else {
      return Left(NetworkFailure());
    }
  }
}
```

### 7. Cubit (Presentation Layer)
```dart
// features/{feature}/presentation/bloc/{name}_cubit.dart
class UserCubit extends Cubit<UserState> {
  final GetUser getUser;

  UserCubit({required this.getUser}) : super(UserInitial());

  Future<void> fetchUser(String id) async {
    emit(UserLoading());
    final result = await getUser(id);
    result.fold(
      (failure) => emit(UserError(failure.message)),
      (user) => emit(UserLoaded(user)),
    );
  }
}
```

### 8. State (Presentation Layer)
```dart
// features/{feature}/presentation/bloc/{name}_state.dart
abstract class UserState extends Equatable {
  @override
  List<Object?> get props => [];
}

class UserInitial extends UserState {}
class UserLoading extends UserState {}
class UserLoaded extends UserState {
  final User user;
  UserLoaded(this.user);
  @override List<Object?> get props => [user];
}
class UserError extends UserState {
  final String message;
  UserError(this.message);
  @override List<Object?> get props => [message];
}
```

### 9. Dependency Injection (GetIt)
```dart
// core/di/injection_container.dart
final sl = GetIt.instance;

Future<void> init() async {
  // Cubits
  sl.registerFactory(() => UserCubit(getUser: sl()));

  // Use cases
  sl.registerLazySingleton(() => GetUser(sl()));

  // Repositories
  sl.registerLazySingleton<UserRepository>(
    () => UserRepositoryImpl(remoteDataSource: sl(), networkInfo: sl()),
  );

  // Data sources
  sl.registerLazySingleton<UserRemoteDataSource>(
    () => UserRemoteDataSourceImpl(sl()),
  );

  // External
  sl.registerLazySingleton(() => Dio());
}
```

### 10. Page with BlocProvider
```dart
// features/{feature}/presentation/pages/{name}_page.dart
class UserPage extends StatelessWidget {
  final String userId;
  const UserPage({required this.userId, super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => sl<UserCubit>()..fetchUser(userId),
      child: const UserView(),
    );
  }
}

class UserView extends StatelessWidget {
  const UserView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: BlocBuilder<UserCubit, UserState>(
        builder: (context, state) {
          if (state is UserLoading) return const CircularProgressIndicator();
          if (state is UserLoaded) return Text(state.user.name);
          if (state is UserError) return Text(state.message);
          return const SizedBox.shrink();
        },
      ),
    );
  }
}
```

---

## Core Error Handling

```dart
// core/error/failures.dart
abstract class Failure extends Equatable {
  final String message;
  const Failure(this.message);
  @override List<Object?> get props => [message];
}

class ServerFailure extends Failure { const ServerFailure([super.message = 'Server error']); }
class NetworkFailure extends Failure { const NetworkFailure([super.message = 'No internet']); }
class CacheFailure extends Failure { const CacheFailure([super.message = 'Cache error']); }

// core/error/exceptions.dart
class ServerException implements Exception {}
class CacheException implements Exception {}
```

---

## Recommended pubspec.yaml dependencies

```yaml
dependencies:
  flutter_bloc: ^8.1.3
  equatable: ^2.0.5
  dartz: ^0.10.1
  get_it: ^7.6.4
  dio: ^5.3.2
  connectivity_plus: ^5.0.1
  shared_preferences: ^2.2.1

dev_dependencies:
  bloc_test: ^9.1.4
  mocktail: ^1.0.0
```

---

## Generation Rules

When a user requests a feature, generate ALL layers consistently:
1. Entity → Model → DataSource → Repository interface → Repository impl → UseCase → Cubit → State → Page
2. Register everything in the DI container
3. Use `Either<Failure, T>` for all repository return types
4. Every Cubit state must extend `Equatable`
5. Name files with snake_case, classes with PascalCase
6. Keep each file single-responsibility
