  // lib/services/auth_service.dart

import 'package:shared_preferences/shared_preferences.dart';
import 'package:jwt_decoder/jwt_decoder.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

Future<int?> getUserIdFromToken() async {
  final prefs = await SharedPreferences.getInstance();
  final token = prefs.getString('authToken');

  if (token != null && token.isNotEmpty) {
    try {
      final decodedToken = JwtDecoder.decode(token);
      return int.tryParse(decodedToken['userId'].toString());
    } catch (e) {
      print('Error decoding token: $e');
    }
  }
  return null;
}

Future<String?> getRoleWorkerOfLoggedInUser() async {
  final prefs = await SharedPreferences.getInstance();
  final token = prefs.getString('authToken');
  final userId = await getUserIdFromToken();

  if (token == null || userId == null) return null;

  final response = await http.get(
    Uri.parse('https://aleznauerdtc1.azurewebsites.net/api/auth/login'),
    headers: {'Authorization': 'Bearer $token'},
  );

  print('Status: ${response.statusCode}');
  print('Body: ${response.body}');
  
  if (response.statusCode == 200) {
    final List users = jsonDecode(response.body);
    final user = users.firstWhere(
      (u) => u['userId'] == userId,
      orElse: () => null,
    );

    if (user != null && user['roleWorker'] != null) {
      prefs.setString('role', user['roleWorker']);
      return user['roleWorker'];
    }
  }
  return null;
}
