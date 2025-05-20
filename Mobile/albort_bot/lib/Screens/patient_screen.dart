import 'package:albort_bot/Services/patient_service.dart';
import 'package:flutter/material.dart';

class PatientsScreen extends StatefulWidget {
  const PatientsScreen({super.key});
  
  @override
  _PatientsScreenState createState() => _PatientsScreenState();
}

class _PatientsScreenState extends State<PatientsScreen> {
  List<Patient> _patients = [];
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadPatients(); // 👈 Auto-load on screen open
  }

  void _loadPatients() async {
    try {
      final patients = await fetchAllPatients();
      setState(() {
        _patients = patients;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
      });
    } finally {
      setState(() {
        _loading = false;
      });
    }
  }

  Widget _buildExpandablePatientCard(Patient patient) {
  return Card(
    elevation: 3,
    margin: EdgeInsets.symmetric(vertical: 8),
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
    child: ExpansionTile(
      leading: CircleAvatar(child: Icon(Icons.person)),
      title: Text('${patient.firstName} ${patient.lastName}',
          style: TextStyle(fontWeight: FontWeight.bold)),
      children: [
        ListTile(
          leading: Icon(Icons.email),
          title: Text("Email"),
          subtitle: Text(patient.email),
        ),
        ListTile(
          leading: Icon(Icons.person_outline),
          title: Text("Gender"),
          subtitle: Text(patient.gender),
        ),
        ListTile(
          leading: Icon(Icons.local_hospital),
          title: Text("Doctor ID"),
          subtitle: Text(patient.doctorID.toString()),
        ),
        ListTile(
          leading: Icon(Icons.room),
          title: Text("Ward"),
          subtitle: Text(patient.ward),
        ),
        ListTile(
          leading: Icon(Icons.meeting_room),
          title: Text("Room"),
          subtitle: Text(patient.room),
        ),
        ListTile(
          leading: Icon(patient.active ? Icons.check_circle : Icons.cancel,
              color: patient.active ? Colors.green : Colors.red),
          title: Text("Active Status"),
          subtitle: Text(patient.active ? "Active" : "Inactive"),
        ),
      ],
    ),
  );
}

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Patient Records")),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: _loading
            ? Center(child: CircularProgressIndicator())
            : _error != null
                ? Center(child: Text("Error: $_error", style: TextStyle(color: Colors.red)))
                : _patients.isEmpty
                    ? Center(child: Text("No patients found."))
                    : ListView.builder(
                        itemCount: _patients.length,
                        itemBuilder: (context, index) {
                          return _buildExpandablePatientCard(_patients[index]);
                        },
                      ),
      ),
    );
  }
}
