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