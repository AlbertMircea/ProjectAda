import 'dart:convert';
import 'package:albort_bot/Models/medication_request.dart';
import 'package:albort_bot/Models/patient_complete.dart';
import 'package:albort_bot/Models/prescription.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../Models/patient.dart';


Future<String?> _getToken() async {
  final prefs = await SharedPreferences.getInstance();
  return prefs.getString('authToken');
}

Future<List<PatientComplete>> fetchPatients() async {
  final token = await _getToken();

  if (token == null) throw Exception('Missing auth token');

  final patientUrl = Uri.parse('https://aleznauerdtc2.azurewebsites.net/PatientComplete/GetOnlyPatients');
  final response = await http.get(
    patientUrl,
    headers: {'Authorization': 'Bearer $token'},
  );

  if (response.statusCode != 200) {
    throw Exception('Failed to load patients');
  }

  final List<dynamic> patientJsonList = json.decode(response.body);
  final List<Patient> patientsList = patientJsonList.map((json) => Patient.fromJson(json)).toList();

  // ⚡ Apelăm în paralel toate requesturile pentru medicamente
  final List<Future<PatientComplete>> futures = patientsList.map((pt) async {
    final prescriptionUrl = Uri.parse('https://aleznauerdtc2.azurewebsites.net/Prescription/GetMedicationByUserId/${pt.userId}');
    
    try {
      final presResponse = await http.get(
        prescriptionUrl,
        headers: {'Authorization': 'Bearer $token'},
      );

      if (presResponse.statusCode == 200) {
        final List<dynamic> prescriptionJson = jsonDecode(presResponse.body);
        final prescriptions = prescriptionJson.map((json) => Prescription.fromJson(json)).toList();

        return PatientComplete(patient: pt, prescriptions: prescriptions);
      } else {
        throw('Failed to retrieve prescription');
      }
    } catch (e) {
      throw('Failed to retrieve prescription');
    }
  }).toList();

  // 🔄 Așteptăm să se termine TOATE requesturile în paralel
  final List<PatientComplete> fullPatients = await Future.wait(futures);

  return fullPatients;
}

Future<PatientComplete> fetchPatientById(int userId) async {
  final token = await _getToken();

  if (token == null) {
    throw Exception('Missing auth token');
  }

  final url = Uri.parse('https://aleznauerdtc2.azurewebsites.net/PatientComplete/GetPatientByUserId/$userId');
  final response = await http.get(url, headers: {'Authorization': 'Bearer $token'});

  if (response.statusCode == 200) {
    final data = json.decode(response.body);
    return PatientComplete.fromJson(data);
  } else {
    throw Exception('Failed to load patient');
  }
}

Future<void> sendMedicationRequest(MedicationRequest request) async {
  final prefs = await SharedPreferences.getInstance();
  final token = prefs.getString('authToken'); 

  if (token == null || token.isEmpty) {
    throw Exception('Authentication token not found.');
  }

  final response = await http.put(
    Uri.parse('https://aleznauerdtc2.azurewebsites.net/Prescription/UpsertMedicationRequest'),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token', 
    },
    body: jsonEncode(request.toJson()),
  );

  if (response.statusCode != 200) {
    throw Exception('Failed to send medication request: ${response.body}');
  }
}