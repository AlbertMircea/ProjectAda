import 'package:albort_bot/Models/patient.dart';
import 'package:albort_bot/Models/prescription.dart';

class PatientComplete{

  final Patient patient;
  final List<Prescription> prescriptions;

  PatientComplete({
    required this.patient,
    required this.prescriptions
    });
  
  factory PatientComplete.fromJson(Map<String, dynamic> json){
    return PatientComplete(
      patient: Patient.fromJson(json['patient']),
      prescriptions: (json['prescriptions'] as List<dynamic>)
          .map((medJson) => Prescription.fromJson(medJson))
          .toList());
  }
}
