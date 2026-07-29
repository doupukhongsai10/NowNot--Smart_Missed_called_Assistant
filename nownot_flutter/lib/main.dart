import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'services/storage_service.dart';
import 'services/foreground_service.dart';
import 'providers/app_provider.dart';
import 'theme/app_theme.dart';
import 'views/onboarding_view.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize Storage & Foreground Service
  final storage = await StorageService.init();
  ForegroundServiceManager.initService();

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AppProvider(storage)),
      ],
      child: const NowNotApp(),
    ),
  );
}

class NowNotApp extends StatelessWidget {
  const NowNotApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'NowNot Assistant',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      home: const OnboardingView(),
    );
  }
}
