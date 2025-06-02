import 'dart:async';
import 'package:flutter/material.dart';
import '../Models/medication_request.dart';
import '../Services/track_order_service.dart';

class TrackOrderScreen extends StatefulWidget {
  const TrackOrderScreen({super.key});

  @override
  State<TrackOrderScreen> createState() => _RequestScreenState();
}

class _RequestScreenState extends State<TrackOrderScreen> {
  final RequestPrescriptionService _service = RequestPrescriptionService();
  List<MedicationRequest> _requests = [];
  bool _loading = true;
  String? _error;

  int? trackingRequestId;

  bool isLoadingStatusUpdate = false;

  
  @override
  void initState() {
    super.initState();
    _loadRequests();
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
        _error = e.toString();
        _loading = false;
      });
    }
  }


  Future<void> _markAsDelivered(int requestId) async {
    final success = await _service.updateRequestStatus(requestId, 'delivered');
    if (success) {
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
      return Container(
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
                Text("Request ID: ${req.requestId}", style: TextStyle(fontWeight: FontWeight.bold)),
              SizedBox(height: 4),
              Text("Patient ID: ${req.patientId}"),
              Text("Medication ID: ${req.medicationId}"),
              Text("Quantity: ${req.quantity}"),
              Text("Status: ${req.status}", style: TextStyle(color: _getStatusColor(req.status))),
              Text(
                "Requested at: ${req.requestedAt != null ? req.requestedAt!.toLocal().toString() : 'N/A'}",
              ),
              if (req.status.toLowerCase() == 'transporting') ...[
              SizedBox(height: 8),
              ElevatedButton(
                onPressed: () => _markAsDelivered(req.requestId!),
                child: Text("Mark as Delivered"),
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
    return Scaffold(
      appBar: AppBar(title: Text("Medication Requests")),
      body: _loading
          ? Center(child: CircularProgressIndicator())
          : _error != null
              ? Center(child: Text("Error: $_error", style: TextStyle(color: Colors.red)))
              : _requests.isEmpty
                  ? Center(child: Text("No requests found."))
                  : RefreshIndicator(
                      onRefresh: _loadRequests,
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

