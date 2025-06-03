import 'package:albort_bot/Services/patient_service.dart' as patient_service;
import 'package:flutter/material.dart';
import 'package:albort_bot/Models/patient_complete.dart';


class PatientProvider extends ChangeNotifier {
  List<PatientComplete> _patientsComplete = [];

  List<PatientComplete> get patientsComplete => _patientsComplete;

  void setPatientsComplete(List<PatientComplete> patients) {
    _patientsComplete = patients;
    notifyListeners();
  }

  Future<void> fetchPatients() async {
    try {
      final fetched = await patient_service.fetchPatients();
      _patientsComplete = fetched;
      notifyListeners();
    } catch (e) {
      throw("Error fetching patients: $e");
    }
  }
}
