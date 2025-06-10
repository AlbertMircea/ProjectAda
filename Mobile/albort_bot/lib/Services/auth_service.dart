import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:jwt_decoder/jwt_decoder.dart';

class AuthService {
  final String baseUrl = 'https://aleznauerdtc2.azurewebsites.net';

  Future<bool> login(String email, String password) async {
    final url = Uri.parse('$baseUrl/Auth/Login');
    final body = jsonEncode({'email': email, 'password': password});

    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: body,
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      final token = data['token'];
      if (token != null && token is String) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('authToken', token);
        await prefs.setString('username', email);

        final role = await getRoleWorkerOfLoggedInUser(token);
        if (role == null) {
          throw Exception('User role not found.');
        }

        if (role.toLowerCase() != 'nurse') {
          throw Exception('Access denied: Only Nurses can use this app.');
        }

        await prefs.setString('role', role);
        return true;
      } else {
        throw Exception('Token not found in response.');
      }
    } else if (response.statusCode == 401) {
      throw Exception('Invalid email or password.');
    } else {
      throw Exception('Login failed with status code: ${response.statusCode}');
    }
  }

  Future<String?> getRoleWorkerOfLoggedInUser(String token) async {
    final decodedToken = JwtDecoder.decode(token);
    final userId = decodedToken['userId']?.toString();

    if (userId == null) return null;

    final response = await http.get(
      Uri.parse('$baseUrl/Auth/GetAuthenticatedUsers'),
      headers: {'Authorization': 'Bearer $token'},
    );

    if (response.statusCode == 200) {
      final List users = jsonDecode(response.body);
      final user = users.firstWhere(
        (u) => u['userId'].toString() == userId,
        orElse: () => null,
      );
      return user != null ? user['roleWorker'] : null;
    }
    return null;
  }
}
