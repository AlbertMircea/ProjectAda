class Prescription{
  final int medicationId;
  final String medication;
  final String dosage;
  final int quantity;

  Prescription({
    required this.medicationId,
    required this.medication,
    required this.dosage,
    required this.quantity
  });

  factory Prescription.fromJson(Map<String, dynamic> json){
    return Prescription(
      medicationId: (json['medicationId'] as int?) ?? 0,
      medication: (json['medication'] as String?) ?? 'Unknown', 
      dosage: (json['dosage'] as String?) ?? 'Unknown', 
      quantity: (json['quantity'] as int?) ?? 0);
  }

}