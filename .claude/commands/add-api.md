# Add API Command

Connect a new REST API endpoint to your Flutter app end-to-end.

## Usage
```
/add-api <endpoint_description>
```
Examples:
- `/add-api GET /users/{id} — fetch user profile`
- `/add-api POST /auth/login — email+password login`
- `/add-api GET /products?page=1 — paginated product list`

## Instructions

When this command is run with `$ARGUMENTS`:

### Step 1: Parse the API
Extract from description:
- HTTP method (GET/POST/PUT/DELETE)
- Endpoint path
- Request parameters or body
- Expected response shape

Ask for clarification if response shape is unknown.

### Step 2: Generate All Layers

#### API Constant
```dart
// core/network/api_constants.dart
static const {name} = '{path}';
// or for parameterized:
static String {name}(String id) => '/endpoint/$id';
```

#### Request Model (if POST/PUT)
```dart
class {Name}Request {
  final String field;
  const {Name}Request({required this.field});
  Map<String, dynamic> toJson() => {'field': field};
}
```

#### Response Model
```dart
class {Name}Model extends {Name} {
  const {Name}Model({required super.field});
  factory {Name}Model.fromJson(Map<String, dynamic> json) => {Name}Model(
    field: json['field'] as String,
  );
}
```

#### Remote Data Source Method
```dart
Future<{Name}Model> {methodName}({params}) async {
  try {
    final response = await dio.{method}(ApiConstants.{name}, data: {...});
    return {Name}Model.fromJson(response.data['data']);
  } on DioException catch (e) {
    throw _handleDioError(e);
  }
}
```

#### Repository Interface Method
```dart
Future<Either<Failure, {Name}>> {methodName}({params});
```

#### Repository Implementation Method
```dart
@override
Future<Either<Failure, {Name}>> {methodName}({params}) async {
  if (await networkInfo.isConnected) {
    try {
      final result = await remoteDataSource.{methodName}({params});
      return Right(result);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    }
  }
  return Left(NetworkFailure());
}
```

#### Use Case
```dart
class {MethodName} {
  final {Name}Repository repository;
  {MethodName}(this.repository);
  Future<Either<Failure, {Name}>> call({params}) => repository.{methodName}({params});
}
```

#### Cubit Method
```dart
Future<void> {methodName}({params}) async {
  emit({Name}Loading());
  final result = await {useCase}({params});
  result.fold(
    (failure) => emit({Name}Error(failure.message)),
    (data) => emit({Name}Loaded(data)),
  );
}
```

#### DI Registration
```dart
sl.registerLazySingleton(() => {MethodName}(sl()));
```

### Step 3: Summary
List all modified/created files with their changes.

## Rules
- Always use `Either<Failure, T>` 
- Handle network connectivity check
- Map all DioExceptions to appropriate Failures
- Register use case in GetIt
