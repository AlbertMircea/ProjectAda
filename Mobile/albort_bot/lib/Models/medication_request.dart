class MedicationRequest {
  final int? requestId;
  final int patientId;
  final int nurseId;
  final int medicationId;
  final int quantity;
  final DateTime? requestedAt;
  final String status;

  MedicationRequest({
    this.requestId,
    required this.patientId,
    required this.nurseId,
    required this.medicationId,
    required this.quantity,
    this.requestedAt,
    this.status = 'Pending',
  });

  Map<String, dynamic> toJson() => {
  if (requestId != null) 'RequestId': requestId,
  'PatientId': patientId,
  'NurseId': nurseId,
  'MedicationId': medicationId,
  'Quantity': quantity,
   if (requestedAt != null) 'RequestedAt': requestedAt!.toIso8601String(),
  'Status': status,
};

  factory MedicationRequest.fromJson(Map<String, dynamic> json) {
    return MedicationRequest(
      requestId: json['requestId'] as int,
      patientId: json['patientId'] as int,
      nurseId: json['nurseId'] as int,
      medicationId: json['medicationId'] as int,
      quantity: json['quantity'] as int,
      requestedAt: DateTime.parse(json['requestedAt'] as String),
      status: json['status'] as String,
    );
  }
}
