import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

// Declare the Patient model here or import it from a models file
class Patient {
  final int userId;
  final String firstName;
  final String lastName;
  final String email;
  final String gender;
  final bool active;
  final int doctorID;
  final String ward;
  final String room;

  Patient({
    required this.userId,
    required this.firstName,
    required this.lastName,
    required this.email,
    required this.gender,
    required this.active,
    required this.doctorID,
    required this.ward,
    required this.room,
  });

  factory Patient.fromJson(Map<String, dynamic> json) {
  return Patient(
    userId: (json['userId'] as int?) ?? 0,
    firstName: (json['firstName'] as String?) ?? 'Unknown',
    lastName: (json['lastName'] as String?) ?? 'Unknown',
    email: (json['email'] as String?) ?? 'Unknown',
    gender: (json['gender'] as String?) ?? 'Unknown',
    active: (json['active'] as bool?) ?? false,
    doctorID: (json['doctorID'] as int?) ?? 0,
    ward: (json['ward'] as String?) ?? 'Unknown',
    room: (json['room'] as String?) ?? 'Unknown',
  );
  }
}


Future<String?> _getToken() async {
  final prefs = await SharedPreferences.getInstance();
  return prefs.getString('authToken');
}

Future<List<Patient>> fetchAllPatients() async {
  final token = await _getToken();

  if (token == null) {
    throw Exception('Missing auth token');
  }

  final url = Uri.parse('https://aleznauerdtc1.azurewebsites.net/PatientComplete/GetPatients/0/true');
  final response = await http.get(
    url,
    headers: {'Authorization': 'Bearer $token'},
  );

  if (response.statusCode == 200) {
    final List<dynamic> data = json.decode(response.body);
    return data.map((json) => Patient.fromJson(json)).toList();
  } else {
    throw Exception('Failed to load all patients');
  }
}
