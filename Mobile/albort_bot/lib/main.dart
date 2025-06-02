import 'package:albort_bot/Providers/patient_provider.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'Screens/login_screen.dart';
import 'Screens/home_screen.dart';
import 'Screens/patient_screen.dart';
import 'Screens/track_order_screen.dart';


void main() {
  runApp(MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => PatientProvider()),
      ],
      child: MyApp()),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Your App',
      theme: ThemeData(primarySwatch: Colors.blue),
      initialRoute: '/',
      routes: {
        '/': (context) => const LoginScreen(),
        '/home': (context) => const HomeScreen(),
        '/patients': (context) => PatientsScreen(),
        '/trackOrder': (context) => TrackOrderScreen(),
        '/requestMedicine': (context) => PlaceholderScreen(title: 'Request Medicine'),
      },
    );
  }
}

class PlaceholderScreen extends StatelessWidget {
  final String title;
  const PlaceholderScreen({super.key, required this.title});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: Center(child: Text('This is the $title screen.')),
    );
  }
}
