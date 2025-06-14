import 'dart:async';
import 'package:albort_bot/Providers/patient_provider.dart';
import 'package:albort_bot/Widgets/simulate_map_widget.dart';
import 'package:albort_bot/Models/simulation_state.dart';
import 'package:albort_bot/Services/auth_service.dart';
import 'package:albort_bot/Services/track_order_service.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../Models/medication_request.dart';
import '../Models/prescription.dart';


class TrackOrderScreen extends StatefulWidget {
  const TrackOrderScreen({super.key});

  @override
  State<TrackOrderScreen> createState() => _TrackOrderScreenState();
}

class _TrackOrderScreenState extends State<TrackOrderScreen> {
  final AuthService _authService = AuthService();
  final RequestPrescriptionService _service = RequestPrescriptionService();
  List<MedicationRequest> _requests = [];
  bool _loading = true;
  String? _error;
  int? trackingRequestId;
  bool isLoadingStatusUpdate = false;
  Map<int, SimulationState> _simulationStates = {};
  Timer? _pollingTimer;
  String? _loginFirstName;
  String? _loginLastName;
  final Map<int, Prescription> _medicationCache = {};


  
@override
  void initState() {
    super.initState();
    _initializeUser();
    _loadData();
    _loadRequests();

    _pollingTimer = Timer.periodic(Duration(seconds: 3), (timer) {
      _loadRequests();
    });
  }

  Future<void> _initializeUser() async {
    final userDetails = await _authService.fetchUserDetails();
    if (userDetails != null) {
      setState(() {
        _loginFirstName = userDetails['firstName'];
        _loginLastName = userDetails['lastName'];
      });
    }
  }
   @override
  void dispose() {
    _pollingTimer?.cancel();
    super.dispose();
  }


  Future<void> _loadData() async {
    try {
      await Provider.of<PatientProvider>(context, listen: false).fetchPatients();
    } catch (e) {
      setState(() {
        _error = "Error loading patients: $e";
        _loading = false;
      });
    }
  }

  Future<void> _loadRequests() async {
    try {
      final allRequests = await _service.getAllRequestsSorted();
      setState(() {
        _requests = allRequests;
        _loading = false;
      });
    } catch (e) {
      setState(() {
        _error = "Error loading requests: $e";
        _loading = false;
      });
    }
  }

  Future<void> _markAsDelivered(int requestId) async {
    final success = await _service.updateRequestStatus(requestId, 'Delivered');
    if (success) {
      _simulationStates.remove(requestId); // Clear state
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Marked as delivered")),
      );
      _loadRequests();
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Failed to update status")),
      );
    }
  }

  Widget _buildRequestCard(MedicationRequest req) {
    final patientsComplete = Provider.of<PatientProvider>(context, listen: false).patientsComplete;
    final patientComplete = patientsComplete.firstWhere((p) => p.patient.userId == req.patientId);
    final existingState = _simulationStates[req.requestId!];
    final simState = existingState ??
      SimulationState(position: Offset.zero);

    _simulationStates[req.requestId!] = simState;
    if (!_medicationCache.containsKey(req.medicationId)) {
      _service.getMedicationById(req.medicationId).then((medication) {
        if (mounted) {
          setState(() {
            _medicationCache[req.medicationId] = medication;
          });
        }
      });
    }
    return Container(
    key: PageStorageKey('request_${req.requestId}'),
    margin: const EdgeInsets.symmetric(vertical: 8),
    decoration: BoxDecoration(
      color: _getBackgroundColor(req.status),
      borderRadius: BorderRadius.circular(12),
    ),
    child: Card(
      elevation: 3,
      margin: EdgeInsets.zero,
      color: Colors.transparent,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (req.requestId != null)
              Text("Request ID: ${req.requestId}",
                  style: TextStyle(fontWeight: FontWeight.bold)),
              SizedBox(height: 4),
              Text("Patient: ${patientComplete.patient.firstName} ${patientComplete.patient.lastName}"),
              Text("Nurse: ${_loginFirstName ?? ''} ${_loginLastName ?? ''}"),
              Text("Medication: ${_medicationCache[req.medicationId]?.medication ?? 'Loading...'}",),
              Text("Quantity: ${req.quantity}"),
              Text("Status: ${req.status}",style: TextStyle(color: _getStatusColor(req.status))),
              Text("Requested at: ${req.requestedAt != null ? req.requestedAt!.toLocal().toString() : 'N/A'}",),
              Text('Ward: ${patientComplete.patient.ward}'),
              Text('Room: ${patientComplete.patient.room}'),
              if (req.status.toLowerCase() == 'transporting') ...[
                SizedBox(height: 12),
                MultiWardMapWidget(
                  ward: patientComplete.patient.ward,
                  room: patientComplete.patient.room,
                  simulationState: simState,
                  onDelivered: () => _markAsDelivered(req.requestId!),
                ),
              ],
          ],
        ),
      ),
    ),
  );
}

  Color _getBackgroundColor(String status) {
    switch (status.toLowerCase()) {
      case 'pending':
        return Colors.orange.shade100;
      case 'transporting':
        return Colors.blue.shade100;
      case 'delivered':
        return Colors.green.shade100;
      default:
        return Colors.grey.shade200;
    }
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'pending':
        return Colors.orange.shade800;
      case 'transporting':
        return Colors.blue.shade800;
      case 'delivered':
        return Colors.green.shade800;
      default:
        return Colors.grey.shade800;
    }
  }

  @override
  Widget build(BuildContext context) {
    final patientsComplete = Provider.of<PatientProvider>(context).patientsComplete;

    return Scaffold(
      appBar: AppBar(title: Text("Medication Requests")),
      body: _loading || patientsComplete.isEmpty
          ? Center(child: CircularProgressIndicator())
          : _error != null
              ? Center(child: Text("Error: $_error", style: TextStyle(color: Colors.red)))
              : _requests.isEmpty
                  ? Center(child: Text("No requests found."))
                  : RefreshIndicator(
                      onRefresh: () async {
                        await _loadData();
                        await _loadRequests();
                      },
                      child: ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: _requests.length,
                        itemBuilder: (context, index) {
                          return _buildRequestCard(_requests[index]);
                        },
                      ),
                    ),
    );
  }
}
