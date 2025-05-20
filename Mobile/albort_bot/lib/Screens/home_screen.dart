import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // Extract button style for reuse
    final ButtonStyle buttonStyle = ElevatedButton.styleFrom(
      padding: const EdgeInsets.symmetric(vertical: 14),
      textStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
      backgroundColor: const Color(0xFF450d80),
      foregroundColor: Colors.white,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      elevation: 6,
    );

    return Scaffold(
      appBar: AppBar(title: const Text('Welcome')),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 320),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                SizedBox(
                  width: 300,
                  height: 48,
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.pushNamed(context, '/patients');
                    },
                    style: buttonStyle,
                    child: const Text('See Patients'),
                  ),
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: 300,
                  height: 48,
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.pushNamed(context, '/trackOrder');
                    },
                    style: buttonStyle,
                    child: const Text('Track Order'),
                  ),
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: 300,
                  height: 48,
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.pushNamed(context, '/requestMedicine');
                    },
                    style: buttonStyle,
                    child: const Text('Request Medicine'),
                  ),
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: 300,
                  height: 48,
                  child: ElevatedButton(
                    onPressed: () async {
                      final prefs = await SharedPreferences.getInstance();
                      await prefs.remove('authToken');
                      await prefs.remove('username');
                      Navigator.pushReplacementNamed(context, '/');
                    },
                    style: buttonStyle,
                    child: const Text('Logout'),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
