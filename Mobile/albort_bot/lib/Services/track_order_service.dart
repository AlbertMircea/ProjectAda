import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../Models/medication_request.dart';

class RequestPrescriptionService {
  final String baseUrl = 'https://aleznauerdtc2.azurewebsites.net/Prescription'; 

  Future<String?> _getToken() async {
  final prefs = await SharedPreferences.getInstance();
  return prefs.getString('authToken');
  }

  Future<List<MedicationRequest>> getAllRequestsSorted() async {
    final token = await _getToken();
    final url = Uri.parse('$baseUrl/GetAllMedicationRequests'); 
    final response = await http.get(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );
  

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      final requests = data.map((json) => MedicationRequest.fromJson(json)).toList();

      requests.sort((a, b) {
        const statusPriority = {'Transporting': 0, 'Pending': 1, 'Delievered': 2};
        return (statusPriority[a.status] ?? 3).compareTo(statusPriority[b.status] ?? 3);
      });

      return requests;
    } 
    else {
      throw Exception('Failed to load requests');
    }
  }

  
  Future<bool> updateRequestStatus(int requestId, String newStatus) async {
    final url = Uri.parse('$baseUrl/UpdateStatus/$requestId');
    final token = await _getToken();
    final response = await http.put(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({
        'status': newStatus,
      }),
    );

    return response.statusCode == 200;
  }
}
 