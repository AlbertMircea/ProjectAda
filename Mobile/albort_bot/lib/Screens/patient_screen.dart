import 'package:albort_bot/Models/medication_request.dart';
import 'package:albort_bot/Models/patient_complete.dart';
import 'package:albort_bot/Providers/patient_provider.dart';
import 'package:albort_bot/Services/auth_service.dart';
import 'package:albort_bot/Services/patient_service.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class PatientsScreen extends StatefulWidget {
  const PatientsScreen({super.key});
  
  @override
  PatientsScreenState createState() => PatientsScreenState();
}

class PatientsScreenState extends State<PatientsScreen> {
  final AuthService _authService = AuthService();

  String? _loginFirstName;
  String? _loginLastName;
  int? _nurseId;
  List<PatientComplete> _filteredPatients = [];
  bool _loading = true;
  String? _error;
  final TextEditingController _userIdController = TextEditingController();
  
  
  @override
  void dispose() {
    _userIdController.dispose();
    super.dispose();
  }

  @override
  void initState() {
    super.initState();
    _initializeUserAndLoadPatients();

    // Initialize filtered patients once after patients are fetched:
    _userIdController.addListener(() {
      _filterPatients(_userIdController.text);
    });
  }

  Future<void> _loadPatients() async {
    try {
      await Provider.of<PatientProvider>(context, listen: false).fetchPatients();
      _filterPatients(_userIdController.text);
      setState(() {
        _loading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _loading = false;
      });
    }
  }



  Future<void> _initializeUserAndLoadPatients() async {
    final userDetails = await _authService.fetchUserDetails();
    if (userDetails != null) {
      setState(() {
        _nurseId = userDetails['userId'];
        _loginFirstName = userDetails['firstName'];
        _loginLastName = userDetails['lastName'];
      });
    }
    _loadPatients();
  }
  
  void _filterPatients(String filter) {
    final patients = Provider.of<PatientProvider>(context, listen: false).patientsComplete;

    setState(() {
      if (filter.isEmpty) {
        _filteredPatients = patients;
      } else {
        _filteredPatients = patients.where((p) {
          final fullName = '${p.patient.firstName} ${p.patient.lastName}'.toLowerCase();
          return fullName.contains(filter.toLowerCase());
        }).toList();
      }
    });
  }

  

  @override
  Widget build(BuildContext context) {
    return Consumer<PatientProvider>(
      builder: (context, patientProvider, child) {
        // Update _filteredPatients if the provider's patients change and search text is empty or unchanged
        if (_filteredPatients.isEmpty || _userIdController.text.isEmpty) {
          WidgetsBinding.instance.addPostFrameCallback((_) {
            _filterPatients(_userIdController.text);
          });
        }

        if (_loading) return Center(child: CircularProgressIndicator());
        if (_error != null) return Center(child: Text('Error: $_error'));

        return Scaffold(
          appBar: AppBar(title: Text("Patient Records")),
          body: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              children: [
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _userIdController,
                        decoration: InputDecoration(
                          labelText: 'Patient Name',
                          prefixIcon: Icon(Icons.search),
                          suffixIcon: _userIdController.text.isNotEmpty
                              ? IconButton(
                                  icon: Icon(Icons.clear),
                                  onPressed: () {
                                    _userIdController.clear();
                                    _filterPatients('');
                                  },
                                )
                              : null,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 16),
                Expanded(
                  child: _filteredPatients.isEmpty
                      ? Center(child: Text("No patients found."))
                      : ListView.builder(
                          itemCount: _filteredPatients.length,
                          itemBuilder: (context, index) {
                            return _buildExpandablePatientCard(_filteredPatients[index]);
                          },
                        ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  
    void _showMedicationRequestDialog(PatientComplete patientComplete) {
    final TextEditingController medicationIdController = TextEditingController();
    final TextEditingController quantityController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text('Request Medication'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: medicationIdController,
                  decoration: InputDecoration(labelText: 'Medication ID'),
                  keyboardType: TextInputType.number,
                ),
                TextField(
                  controller: quantityController,
                  decoration: InputDecoration(labelText: 'Quantity'),
                  keyboardType: TextInputType.number,
                ),
                SizedBox(height: 12),
                Text("Patient: ${patientComplete.patient.firstName} ${patientComplete.patient.lastName}"),
                Text("Nurse: $_loginFirstName $_loginLastName"),
                Text("Status: Pending"),
                Text("Ward: ${patientComplete.patient.ward}"),
                Text("Room: ${patientComplete.patient.room}")
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () async {
                if (_nurseId == null) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text("Nurse ID not available")),
                  );
                  return;
                }
                final medId = int.tryParse(medicationIdController.text.trim());
                final qty = int.tryParse(quantityController.text.trim());

                if (medId == null || qty == null) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text("Please insert medication")),
                  );
                  return;
                }
                final ward = patientComplete.patient.ward;
                final request = MedicationRequest(
                  patientId: patientComplete.patient.userId,
                  nurseId: _nurseId!,
                  medicationId: medId,
                  quantity: qty,
                );
                try {
                  await sendMedicationRequest(request,ward);
                  Navigator.of(context).pop();
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text("Request sent succesfully.")),
                  );
                } catch (e) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text("Eroare: $e")),
                  );
                }
              },
              child: Text('Submit'),
            ),
          ],
        );
      },
    );
  }


  Widget _buildExpandablePatientCard(PatientComplete patientComplete) {
    final patient = patientComplete.patient;
    final prescriptions = patientComplete.prescriptions;

    return Card(
      elevation: 3,
      margin: EdgeInsets.symmetric(vertical: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ExpansionTile(
        leading: CircleAvatar(child: Icon(Icons.person)),
        title: Text('${patient.firstName} ${patient.lastName}',
            style: TextStyle(fontWeight: FontWeight.bold)),
        children: [
          ElevatedButton(
            onPressed: () {
              _showMedicationRequestDialog(patientComplete);
            },
            child: Text("Request Medicine"),
          ),
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
          Divider(),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Align(
              alignment: Alignment.centerLeft,
              child: Text(
                'Prescriptions:',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              ),
          ),
          ...prescriptions.map((prescription) => ListTile(
            leading: Icon(Icons.medication),
            title: Text('${prescription.medication} (ID: ${prescription.medicationId})'),
            subtitle: Text('Dosage: ${prescription.dosage}, Quantity: ${prescription.quantity}'),
           
          )),
        ],
      ),
    );
  }

}
