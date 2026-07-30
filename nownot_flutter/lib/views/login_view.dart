import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_theme.dart';
import 'dashboard_view.dart';

class LoginView extends StatefulWidget {
  const LoginView({super.key});

  @override
  State<LoginView> createState() => _LoginViewState();
}

class _LoginViewState extends State<LoginView> {
  final _phoneController = TextEditingController(text: '+44 7700 900000');
  final _passwordController = TextEditingController(text: 'password123');
  final _nameController = TextEditingController();
  bool _isSignUp = false;
  bool _showPassword = false;

  void _handleLogin() {
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(builder: (_) => const DashboardView()),
    );
  }

  @override
  void dispose() {
    _phoneController.dispose();
    _passwordController.dispose();
    _nameController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.bgVoid,
      body: Stack(
        children: [
          // ── Background Image ─────────────────────────
          Positioned.fill(
            child: Image.network(
              'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1920&q=80',
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) => Container(color: AppTheme.bgBase),
            ),
          ),
          // ── Ambient Dark Glass Backdrop Overlay ──────
          Positioned.fill(
            child: Container(
              color: const Color(0xFF0B0D1A).withOpacity(0.65),
            ),
          ),

          // ── Scrollable Body ──────────────────────────
          SafeArea(
            child: Center(
              child: SingleChildScrollView(
                physics: const BouncingScrollPhysics(),
                padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 24.0),
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 440),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      // ── Brand Logo Header ──
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Container(
                            width: 12,
                            height: 12,
                            decoration: const BoxDecoration(
                              color: AppTheme.primaryContainer,
                              shape: BoxShape.circle,
                              boxShadow: [
                                BoxShadow(
                                  color: AppTheme.primaryContainer,
                                  blurRadius: 12,
                                  spreadRadius: 2,
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            'NowNot',
                            style: GoogleFonts.outfit(
                              fontSize: 36,
                              fontWeight: FontWeight.w800,
                              color: Colors.white,
                              letterSpacing: -0.5,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Your calls, intelligently handled.',
                        textAlign: TextAlign.center,
                        style: GoogleFonts.inter(
                          fontSize: 13,
                          fontWeight: FontWeight.w500,
                          color: AppTheme.onSurfaceVariant.withOpacity(0.90),
                        ),
                      ),
                      const SizedBox(height: 28),

                      // ── Dark Glassmorphic Card ──
                      Container(
                        decoration: BoxDecoration(
                          color: const Color(0xFF14182D).withOpacity(0.80),
                          borderRadius: BorderRadius.circular(28),
                          border: Border.all(
                            color: Colors.white.withOpacity(0.12),
                            width: 1.0,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.50),
                              blurRadius: 40,
                              offset: const Offset(0, 20),
                            ),
                          ],
                        ),
                        padding: const EdgeInsets.all(28.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            Text(
                              _isSignUp ? 'Create Account' : 'Welcome Back',
                              textAlign: TextAlign.center,
                              style: GoogleFonts.outfit(
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              _isSignUp
                                  ? 'Join NowNot to handle missed calls intelligently'
                                  : 'Please enter your details to sign in',
                              textAlign: TextAlign.center,
                              style: GoogleFonts.inter(
                                fontSize: 12,
                                color: const Color(0xFF94A3B8),
                              ),
                            ),
                            const SizedBox(height: 24),

                            // ── Full Name Input (Sign Up) ──
                            if (_isSignUp) ...[
                              _buildInputLabel('Full Name'),
                              const SizedBox(height: 6),
                              _buildTextField(
                                controller: _nameController,
                                hintText: 'John Doe',
                                icon: Icons.person_outline,
                              ),
                              const SizedBox(height: 16),
                            ],

                            // ── Phone Input ──
                            _buildInputLabel('Phone Number'),
                            const SizedBox(height: 6),
                            _buildTextField(
                              controller: _phoneController,
                              hintText: '+44 7700 900000',
                              icon: Icons.call_outlined,
                              isMono: true,
                            ),
                            const SizedBox(height: 16),

                            // ── Password Input ──
                            _buildInputLabel('Password'),
                            const SizedBox(height: 6),
                            _buildTextField(
                              controller: _passwordController,
                              hintText: '••••••••••••',
                              icon: Icons.lock_outline,
                              isPassword: true,
                              showPassword: _showPassword,
                              onTogglePassword: () {
                                setState(() => _showPassword = !_showPassword);
                              },
                            ),
                            const SizedBox(height: 24),

                            // ── Log In Button ──
                            InkWell(
                              onTap: _handleLogin,
                              borderRadius: BorderRadius.circular(16),
                              child: Container(
                                height: 50,
                                decoration: BoxDecoration(
                                  gradient: const LinearGradient(
                                    colors: [Color(0xFF7C3AED), Color(0xFF6D28D9)],
                                  ),
                                  borderRadius: BorderRadius.circular(16),
                                  boxShadow: [
                                    BoxShadow(
                                      color: const Color(0xFF7C3AED).withOpacity(0.45),
                                      blurRadius: 20,
                                      offset: const Offset(0, 6),
                                    ),
                                  ],
                                ),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Text(
                                      _isSignUp ? 'Sign Up' : 'Log In',
                                      style: GoogleFonts.inter(
                                        fontSize: 14,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.white,
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    const Icon(Icons.arrow_forward, color: Colors.white, size: 18),
                                  ],
                                ),
                              ),
                            ),

                            const SizedBox(height: 20),

                            // ── OR CONTINUE WITH Divider ──
                            Row(
                              children: [
                                const Expanded(child: Divider(color: Colors.white12)),
                                Padding(
                                  padding: const EdgeInsets.symmetric(horizontal: 10),
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFF131627),
                                      borderRadius: BorderRadius.circular(12),
                                      border: Border.all(color: Colors.white12),
                                    ),
                                    child: Text(
                                      'OR CONTINUE WITH',
                                      style: GoogleFonts.inter(
                                        fontSize: 9,
                                        fontWeight: FontWeight.bold,
                                        color: const Color(0xFF94A3B8),
                                        letterSpacing: 0.8,
                                      ),
                                    ),
                                  ),
                                ),
                                const Expanded(child: Divider(color: Colors.white12)),
                              ],
                            ),

                            const SizedBox(height: 20),

                            // ── Social Login Buttons ──
                            Row(
                              children: [
                                Expanded(
                                  child: _buildSocialButton(
                                    label: 'Google',
                                    iconWidget: Image.network(
                                      'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg',
                                      width: 16,
                                      height: 16,
                                      errorBuilder: (context, error, stackTrace) =>
                                          const Text('G', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                                    ),
                                    onTap: _handleLogin,
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: _buildSocialButton(
                                    label: 'Github',
                                    iconWidget: const Icon(Icons.code, color: Colors.white, size: 18),
                                    onTap: _handleLogin,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),

                      const SizedBox(height: 20),

                      // ── Bottom Footer Link ──
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            _isSignUp ? 'Already have an account? ' : "Don't have an account? ",
                            style: GoogleFonts.inter(fontSize: 12, color: const Color(0xFFCBD5E1)),
                          ),
                          GestureDetector(
                            onTap: () => setState(() => _isSignUp = !_isSignUp),
                            child: Text(
                              _isSignUp ? 'Log In' : 'Sign Up',
                              style: GoogleFonts.inter(
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                                decoration: TextDecoration.underline,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInputLabel(String label) {
    return Text(
      label,
      style: GoogleFonts.inter(
        fontSize: 12,
        fontWeight: FontWeight.w600,
        color: const Color(0xFFCBD5E1),
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String hintText,
    required IconData icon,
    bool isPassword = false,
    bool showPassword = false,
    bool isMono = false,
    VoidCallback? onTogglePassword,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF131627).withOpacity(0.80),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.10)),
      ),
      child: TextField(
        controller: controller,
        obscureText: isPassword && !showPassword,
        style: isMono
            ? GoogleFonts.jetBrainsMono(color: Colors.white, fontSize: 13)
            : GoogleFonts.inter(color: Colors.white, fontSize: 13),
        decoration: InputDecoration(
          prefixIcon: Icon(icon, color: const Color(0xFF94A3B8), size: 18),
          suffixIcon: isPassword
              ? IconButton(
                  icon: Icon(
                    showPassword ? Icons.visibility_off : Icons.visibility,
                    color: const Color(0xFF94A3B8),
                    size: 18,
                  ),
                  onPressed: onTogglePassword,
                )
              : null,
          hintText: hintText,
          hintStyle: GoogleFonts.inter(color: Colors.white24, fontSize: 13),
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        ),
      ),
    );
  }

  Widget _buildSocialButton({
    required String label,
    required Widget iconWidget,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: const Color(0xFF131627).withOpacity(0.90),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.white.withOpacity(0.15)),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            iconWidget,
            const SizedBox(width: 8),
            Text(
              label,
              style: GoogleFonts.inter(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: Colors.white,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
