import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final emailController = TextEditingController();
  final passwordController = TextEditingController();

  bool isLoading = false;
  String? error;
  bool success = false;

  Future<void> login() async {
    setState(() {
      isLoading = true;
      error = null;
      success = false;
    });

    final url = Uri.parse('https://aleznauerdtc1.azurewebsites.net/Auth/Login');
    final body = jsonEncode({
      'email': emailController.text.trim(),
      'password': passwordController.text.trim(),
    });

    try {
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: body,
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final token = data['token'];

        if (token != null && token is String) {
          final prefs = await SharedPreferences.getInstance();
          await prefs.setString('authToken', token);
          await prefs.setString('username', emailController.text.trim());

          // Optional: apel functie pentru rol, ex: await getRoleWorkerOfLoggedInUser();

          setState(() {
            success = true;
            error = null;
          });

          Navigator.pushReplacementNamed(context, '/home');
        } else {
          setState(() {
            error = 'Token not found in response.';
            success = false;
          });
        }
      } else {
        setState(() {
          error = 'Invalid email or password.';
          success = false;
        });
      }
    } catch (e) {
      setState(() {
    error = 'Error connecting to server: $e';
    success = false;
  });
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
  return Scaffold(
    appBar: AppBar(
      automaticallyImplyLeading: true, // hides back button
    ),
    body: Center(
      child: SingleChildScrollView(
        child: Container(
          margin: const EdgeInsets.only(top: 32),
          padding: const EdgeInsets.all(24),
          width: MediaQuery.of(context).size.width * 0.9,
          constraints: const BoxConstraints(maxWidth: 480),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.03),
            borderRadius: BorderRadius.circular(16),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Column(
                children: [
                  Image.asset(
                    'assets/image.png',
                    height: 80,
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Login',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              TextField(
                controller: emailController,
                decoration: const InputDecoration(
                  labelText: 'Email',
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.emailAddress,
              ),
              const SizedBox(height: 16),
              TextField(
                controller: passwordController,
                obscureText: true,
                decoration: const InputDecoration(
                  labelText: 'Password',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 20),

              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: isLoading ? null : login,
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    textStyle: const TextStyle(
                        fontSize: 16, fontWeight: FontWeight.w600),
                    backgroundColor: const Color(0xFF450d80),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    elevation: 6,
                  ),
                  child: isLoading
                      ? const SizedBox(
                          height: 16,
                          width: 16,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: Colors.white,
                          ),
                        )
                      : const Text('Login'),
                ),
              ),

              const SizedBox(height: 20),

              const Text(
                "No account?",
                style: TextStyle(color: Colors.grey),
              ),
              GestureDetector(
                onTap: () {
                  Navigator.pushNamed(context, '/register');
                },
                child: const Text(
                  'Register',
                  style: TextStyle(
                    color: Color(0xFF9c73ca),
                    decoration: TextDecoration.underline,
                    fontWeight: FontWeight.w500,
                  ),
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