import 'package:flutter/material.dart';
import 'package:permission_handler/permission_handler.dart';
import '../theme/app_theme.dart';
import '../widgets/glass_container.dart';
import 'dashboard_view.dart';

class OnboardingView extends StatefulWidget {
  const OnboardingView({super.key});

  @override
  State<OnboardingView> createState() => _OnboardingViewState();
}

class _OnboardingViewState extends State<OnboardingView> {
  bool _isLoading = false;

  Future<void> _requestPermissionsAndProceed() async {
    setState(() => _isLoading = true);

    await [
      Permission.phone,
      Permission.sms,
      Permission.contacts,
      Permission.notification,
    ].request();

    setState(() => _isLoading = false);

    if (mounted) {
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (_) => const DashboardView()),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Spacer(),
              Center(
                child: Container(
                  width: 90,
                  height: 90,
                  decoration: BoxDecoration(
                    color: AppTheme.primaryAccent.withOpacity(0.2),
                    shape: BoxShape.circle,
                    border: Border.all(color: AppTheme.primaryAccent, width: 2),
                  ),
                  child: const Center(
                    child: Text('📱', style: TextStyle(fontSize: 48)),
                  ),
                ),
              ),
              const SizedBox(height: 24),
              Text(
                'Welcome to NowNot',
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.displayLarge?.copyWith(
                  fontSize: 28,
                ),
              ),
              const SizedBox(height: 12),
              Text(
                'Smart availability assistant that automatically replies to missed calls with tailored status messages.',
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  fontSize: 16,
                  height: 1.5,
                ),
              ),
              const SizedBox(height: 36),
              GlassContainer(
                child: Column(
                  children: [
                    _buildPermissionItem(
                      icon: Icons.phone_android,
                      title: 'Phone State & Call Log',
                      subtitle: 'To detect when a call is missed while away',
                    ),
                    const Divider(color: AppTheme.glassBorder, height: 24),
                    _buildPermissionItem(
                      icon: Icons.sms_outlined,
                      title: 'Send Auto-SMS',
                      subtitle: 'To dispatch your group-specific replies',
                    ),
                    const Divider(color: AppTheme.glassBorder, height: 24),
                    _buildPermissionItem(
                      icon: Icons.contacts_outlined,
                      title: 'Contacts Access',
                      subtitle: 'To identify Family, Friends, or Work groups',
                    ),
                  ],
                ),
              ),
              const Spacer(),
              ElevatedButton(
                onPressed: _isLoading ? null : _requestPermissionsAndProceed,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primaryAccent,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14),
                  ),
                ),
                child: _isLoading
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text(
                        'Grant Permissions & Get Started',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                      ),
              ),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPermissionItem({
    required IconData icon,
    required String title,
    required String subtitle,
  }) {
    return Row(
      children: [
        Icon(icon, color: AppTheme.secondaryAccent, size: 24),
        const SizedBox(width: 14),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
              const SizedBox(height: 2),
              Text(subtitle, style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary)),
            ],
          ),
        ),
      ],
    );
  }
}
