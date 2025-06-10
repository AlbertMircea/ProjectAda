import 'dart:async';
import 'dart:math';
import 'package:albort_bot/Models/simulation_state.dart';
import 'package:flutter/material.dart';

class MultiWardMapWidget extends StatefulWidget {
  final String ward; // "Emergency" or "General Medicine"
  final String room; // "1", "2", "3"
  final VoidCallback onDelivered;
  final SimulationState simulationState;

  const MultiWardMapWidget({
    super.key,
    required this.ward,
    required this.room,
    required this.simulationState,
    required this.onDelivered,
  });


  @override
  State<MultiWardMapWidget> createState() => _MultiWardMapWidgetState();
}

class _MultiWardMapWidgetState extends State<MultiWardMapWidget> {
  late Timer _timer;

  final double cellWidth = 100;
  final double cellHeight = 100;
  final double corridorHeight = 40;

  late List<Offset> _pathPoints;
  
  int get roomIndex {
    final parsed = int.tryParse(widget.room);
    if (parsed == null || parsed < 1 || parsed > 3) return 0;
    return parsed - 1;
  }

  int get wardIndex {
    if (widget.ward == "Emergency") return 2;
    if (widget.ward == "General Medicine") return 1;
    return 0;
  }

  @override
  void initState() {
    super.initState();
    _buildPath();

    if (widget.simulationState.position == Offset.zero) {
      widget.simulationState.position = _pathPoints[0];
      widget.simulationState.currentSegment = 0;
      widget.simulationState.reached = false;
    }

    _timer = Timer.periodic(const Duration(milliseconds: 50), _moveAlongPath);
  }


  void _buildPath() {
    double verticalCorridorX = 0;
    double startX = verticalCorridorX;
    double startY = 3 * cellHeight + 2 * corridorHeight; // Ward 0

    double targetRoomX = roomIndex * cellWidth + cellWidth / 2;
    double targetRoomY = switch (wardIndex) {
      2 => 0.0 + cellHeight / 2, // Emergency
      1 => cellHeight + corridorHeight + cellHeight / 2, // General Medicine
      _ => 2 * (cellHeight + corridorHeight) + cellHeight / 2, // Ward 0
    };

    double targetCorridorY = switch (wardIndex) {
      2 => cellHeight, // Corridor above General Medicine
      1 => 2 * cellHeight + corridorHeight, // Corridor above Ward 0
      _ => 3 * cellHeight + 2 * corridorHeight, // Base
    };

    _pathPoints = [
      Offset(startX, startY),
      Offset(startX, targetCorridorY),
      Offset(targetRoomX, targetCorridorY),
      Offset(targetRoomX, targetRoomY),
    ];
  }

  void _moveAlongPath(Timer timer) {
  if (widget.simulationState.currentSegment >= _pathPoints.length - 1) {
   if (!widget.simulationState.reached) {
    setState(() {
      widget.simulationState.reached = true;
    });
    }
    _timer.cancel();
    return;
  }

  final currentPos = widget.simulationState.position;
  final targetPos = _pathPoints[widget.simulationState.currentSegment + 1];
  const speed = 2;

  double dx = targetPos.dx - currentPos.dx;
  double dy = targetPos.dy - currentPos.dy;
  double dist = sqrt(dx * dx + dy * dy);

  if (dist < speed) {
    setState(() {
      widget.simulationState.position = targetPos;
      widget.simulationState.currentSegment++;
    });
  } else {
    double stepX = speed * dx / dist;
    double stepY = speed * dy / dist;
    setState(() {
      widget.simulationState.position = Offset(currentPos.dx + stepX, currentPos.dy + stepY);
    });
  }
}


  @override
  void dispose() {
    _timer.cancel();
    super.dispose();
  }

  Widget _buildWardRow(int wardIdx, String wardName) {
    return Row(
      children: List.generate(3, (roomIdx) {
        bool isTarget = wardIdx == wardIndex && roomIdx == roomIndex;
        return Container(
          width: cellWidth,
          height: cellHeight,
          decoration: BoxDecoration(
            border: Border.all(color: Colors.grey),
            color: isTarget ? Colors.lightGreen[200] : Colors.white,
          ),
          child: Center(
            child: Text(
              '$wardName\nRoom ${roomIdx + 1}',
              textAlign: TextAlign.center,
            ),
          ),
        );
      }),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        SizedBox(
          width: 3 * cellWidth,
          height: 3 * cellHeight + 2 * corridorHeight,
          child: Stack(
            children: [
              // Ward 2 - Emergency
              Positioned(top: 0, left: 0, child: _buildWardRow(2, "Emergency")),
              // Corridor 2
              Positioned(top: cellHeight, left: 0, child: Container(width: 3 * cellWidth, height: corridorHeight, color: Colors.grey[300])),

              // Ward 1 - General Medicine
              Positioned(top: cellHeight + corridorHeight, left: 0, child: _buildWardRow(1, "General Medicine")),
              // Corridor 1
              Positioned(top: 2 * cellHeight + corridorHeight, left: 0, child: Container(width: 3 * cellWidth, height: corridorHeight, color: Colors.grey[300])),

              // Ward 0 - base
              Positioned(top: 2 * (cellHeight + corridorHeight), left: 0, child: Container(width: cellWidth, height: cellHeight, decoration: BoxDecoration(border: Border.all(color: Colors.grey), color: wardIndex == 0 ? Colors.lightGreen[200] : Colors.white), child: const Center(child: Text("Ward 0\nRoom 1", textAlign: TextAlign.center)))),

              // Vertical corridor (left side)
              Positioned(top: 0, left: 0, child: Container(width: 10, height: 3 * cellHeight + 2 * corridorHeight, color: Colors.grey[400])),

              // Robot
              Positioned(
              left: widget.simulationState.position.dx,
              top: widget.simulationState.position.dy - 8,
              child: Container(
                width: 16,
                height: 16,
                decoration: BoxDecoration(
                  color: Colors.red,
                  shape: BoxShape.circle,
                  boxShadow: [BoxShadow(color: Colors.black26, blurRadius: 4)],
                ),
              ),
            ),
            ],
          ),
        ),
        if (widget.simulationState.reached)
          Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.check_circle, color: Colors.green, size: 32),
              Text("Delivery complete!", style: TextStyle(color: Colors.green, fontWeight: FontWeight.bold)),
              SizedBox(height: 8),
              ElevatedButton.icon(
                onPressed: widget.onDelivered,
                icon: Icon(Icons.check),
                label: Text("Mark as Delivered"),
              ),
            ],
          ),
      ],
    );
  }
}
