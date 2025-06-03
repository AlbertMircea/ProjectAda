import 'package:flutter/material.dart';

class SimulationState {
  Offset position;
  int currentSegment;
  bool reached;

  SimulationState({
    required this.position,
    this.currentSegment = 0,
    this.reached = false,
  });
}
