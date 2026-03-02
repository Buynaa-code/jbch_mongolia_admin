---
name: flutter-api-integration
description: Generate complete Flutter API integration code including Dio setup, interceptors, authentication (JWT/Bearer), request/response models, error handling, and repository layer. Use this skill whenever a user wants to connect Flutter to a REST API, needs Dio configuration, wants to handle tokens or refresh logic, needs to parse JSON responses, or asks about http/dio/network calls, API integration, authentication flow, or backend connection. Also trigger for "API холбох", "backend дуудах", "token", "REST", "JSON parse" keywords.
---

# Flutter API Integration Skill

Generates complete, production-ready API integration code for Flutter apps.

---

## Complete Setup

### 1. Dio Client with Interceptors

```dart
// core/network/dio_client.dart
class DioClient {
  static Dio createDio({required String baseUrl}) {
    final dio = Dio(
      BaseOptions(
        baseUrl: baseUrl,
        connectTimeout: const Duration(seconds: 15),
        receiveTimeout: const Duration(seconds: 15),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    dio.interceptors.addAll([
      AuthInterceptor(),
      LogInterceptor(requestBody: true, responseBody: true),
      RetryInterceptor(dio: dio),
    ]);

    return dio;
  }
}
```

### 2. Auth Interceptor (JWT / Bearer Token)

```dart
// core/network/auth_interceptor.dart
class AuthInterceptor extends Interceptor {
  final TokenStorage tokenStorage;
  AuthInterceptor({required this.tokenStorage});

  @override
  Future<void> onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    final token = await tokenStorage.getAccessToken();
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }

  @override
  Future<void> onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    if (err.response?.statusCode == 401) {
      // Token expired — attempt refresh
      final refreshed = await _refreshToken();
      if (refreshed) {
        // Retry original request
        final token = await tokenStorage.getAccessToken();
        err.requestOptions.headers['Authorization'] = 'Bearer $token';
        final response = await Dio().fetch(err.requestOptions);
        return handler.resolve(response);
      }
      // Refresh failed — logout user
      await tokenStorage.clearTokens();
    }
    handler.next(err);
  }

  Future<bool> _refreshToken() async {
    try {
      final refreshToken = await tokenStorage.getRefreshToken();
      final response = await Dio().post(
        '${ApiConstants.baseUrl}/auth/refresh',
        data: {'refresh_token': refreshToken},
      );
      await tokenStorage.saveTokens(
        accessToken: response.data['access_token'],
        refreshToken: response.data['refresh_token'],
      );
      return true;
    } catch (_) {
      return false;
    }
  }
}
```

### 3. Token Storage (SharedPreferences)

```dart
// core/network/token_storage.dart
class TokenStorage {
  static const _accessKey = 'access_token';
  static const _refreshKey = 'refresh_token';

  final SharedPreferences prefs;
  TokenStorage(this.prefs);

  Future<void> saveTokens({
    required String accessToken,
    required String refreshToken,
  }) async {
    await prefs.setString(_accessKey, accessToken);
    await prefs.setString(_refreshKey, refreshToken);
  }

  Future<String?> getAccessToken() async => prefs.getString(_accessKey);
  Future<String?> getRefreshToken() async => prefs.getString(_refreshKey);
  Future<void> clearTokens() async {
    await prefs.remove(_accessKey);
    await prefs.remove(_refreshKey);
  }
}
```

### 4. API Constants

```dart
// core/network/api_constants.dart
class ApiConstants {
  static const baseUrl = 'https://api.yourapp.com/v1';

  // Auth
  static const login = '/auth/login';
  static const register = '/auth/register';
  static const refresh = '/auth/refresh';

  // Users
  static const users = '/users';
  static String userById(String id) => '/users/$id';

  // Timeouts
  static const connectTimeout = Duration(seconds: 15);
  static const receiveTimeout = Duration(seconds: 15);
}
```

### 5. Base API Response Model

```dart
// core/network/api_response.dart
class ApiResponse<T> {
  final bool success;
  final T? data;
  final String? message;
  final int? statusCode;

  const ApiResponse({
    required this.success,
    this.data,
    this.message,
    this.statusCode,
  });

  factory ApiResponse.fromJson(
    Map<String, dynamic> json,
    T Function(dynamic) fromJsonT,
  ) {
    return ApiResponse(
      success: json['success'] ?? false,
      data: json['data'] != null ? fromJsonT(json['data']) : null,
      message: json['message'],
      statusCode: json['status_code'],
    );
  }
}
```

### 6. Remote Data Source Pattern

```dart
// features/auth/data/datasources/auth_remote_datasource.dart
abstract class AuthRemoteDataSource {
  Future<AuthTokenModel> login(String email, String password);
  Future<UserModel> getProfile();
}

class AuthRemoteDataSourceImpl implements AuthRemoteDataSource {
  final Dio dio;
  AuthRemoteDataSourceImpl(this.dio);

  @override
  Future<AuthTokenModel> login(String email, String password) async {
    try {
      final response = await dio.post(
        ApiConstants.login,
        data: {'email': email, 'password': password},
      );
      return AuthTokenModel.fromJson(response.data);
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  @override
  Future<UserModel> getProfile() async {
    try {
      final response = await dio.get('/profile');
      return UserModel.fromJson(response.data['data']);
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  Exception _handleDioError(DioException e) {
    switch (e.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.receiveTimeout:
        return TimeoutException('Request timed out');
      case DioExceptionType.badResponse:
        final statusCode = e.response?.statusCode;
        final message = e.response?.data['message'] ?? 'Server error';
        if (statusCode == 401) return UnauthorizedException(message);
        if (statusCode == 404) return NotFoundException(message);
        if (statusCode == 422) return ValidationException(message);
        return ServerException(message);
      case DioExceptionType.connectionError:
        return NetworkException('No internet connection');
      default:
        return UnknownException('Something went wrong');
    }
  }
}
```

### 7. Paginated List Response

```dart
// core/network/paginated_response.dart
class PaginatedResponse<T> {
  final List<T> items;
  final int currentPage;
  final int totalPages;
  final int totalCount;
  final bool hasNextPage;

  const PaginatedResponse({
    required this.items,
    required this.currentPage,
    required this.totalPages,
    required this.totalCount,
  }) : hasNextPage = currentPage < totalPages;

  factory PaginatedResponse.fromJson(
    Map<String, dynamic> json,
    T Function(Map<String, dynamic>) fromJsonT,
  ) {
    return PaginatedResponse(
      items: (json['data'] as List).map((e) => fromJsonT(e)).toList(),
      currentPage: json['meta']['current_page'],
      totalPages: json['meta']['total_pages'],
      totalCount: json['meta']['total'],
    );
  }
}
```

### 8. Cubit for API Calls

```dart
// Follows architecture skill pattern
class ProfileCubit extends Cubit<ProfileState> {
  final GetProfile getProfile;
  ProfileCubit({required this.getProfile}) : super(ProfileInitial());

  Future<void> fetchProfile() async {
    emit(ProfileLoading());
    final result = await getProfile();
    result.fold(
      (failure) => emit(ProfileError(failure.message)),
      (user) => emit(ProfileLoaded(user)),
    );
  }
}
```

---

## pubspec.yaml Dependencies

```yaml
dependencies:
  dio: ^5.3.2
  shared_preferences: ^2.2.1
  connectivity_plus: ^5.0.1
  pretty_dio_logger: ^1.3.1   # optional: beautiful request logs
  retrofit: ^4.0.3             # optional: type-safe API generation
  json_annotation: ^4.8.1

dev_dependencies:
  retrofit_generator: ^8.0.4
  json_serializable: ^6.7.1
  build_runner: ^2.4.6
```

---

## Quick Checklist

When integrating a new API endpoint:
- [ ] Add URL constant in `ApiConstants`
- [ ] Create request/response model with `fromJson`/`toJson`
- [ ] Add method to remote data source
- [ ] Add method to repository interface (domain)
- [ ] Implement in repository impl (data)
- [ ] Create use case (domain)
- [ ] Add to Cubit
- [ ] Register in GetIt DI container
- [ ] Add error handling at every layer
