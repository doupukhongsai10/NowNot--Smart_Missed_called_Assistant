import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import '../models/status_model.dart';
import '../theme/app_theme.dart';
import '../widgets/glass_container.dart';
import '../widgets/active_status_card.dart';
import 'status_editor_view.dart';
import 'call_log_view.dart';
import 'login_view.dart';

class DashboardView extends StatefulWidget {
  const DashboardView({super.key});

  @override
  State<DashboardView> createState() => _DashboardViewState();
}

class _DashboardViewState extends State<DashboardView> {
  int _selectedNavIndex = 0;

  void _showDurationPicker(BuildContext context, StatusModel status) {
    int selectedMinutes = 60;

    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.bgElevated,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Row(
                    children: [
                      Text(
                        status.emoji,
                        style: GoogleFonts.notoColorEmoji(fontSize: 28),
                      ),
                      const SizedBox(width: 12),
                      Text(
                        'Activate "${status.name}"',
                        style: GoogleFonts.outfit(
                          fontSize: 20,
                          fontWeight: FontWeight.w600,
                          color: AppTheme.primaryLavender,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  Text(
                    'Select Duration: ${selectedMinutes >= 60 ? "${selectedMinutes ~/ 60} hours" : "$selectedMinutes mins"}',
                    style: GoogleFonts.inter(
                      fontWeight: FontWeight.bold,
                      color: AppTheme.groupFriends,
                    ),
                  ),
                  Slider(
                    value: selectedMinutes.toDouble(),
                    min: 15,
                    max: 480,
                    divisions: 31,
                    activeColor: AppTheme.primaryContainer,
                    inactiveColor: Colors.white10,
                    onChanged: (val) {
                      setModalState(() => selectedMinutes = val.round());
                    },
                  ),
                  const SizedBox(height: 20),
                  ElevatedButton(
                    onPressed: () {
                      context.read<AppProvider>().activateStatus(
                        status: status,
                        durationMinutes: selectedMinutes,
                      );
                      Navigator.pop(context);
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.primaryContainer,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: const Text('Start Status', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  void _activatePreset(BuildContext context, String name, String emoji) {
    final status = StatusModel(
      id: name.toLowerCase().replaceAll(' ', '_'),
      name: name,
      emoji: emoji,
      groupMessages: {
        'Family': 'I am currently $name $emoji. Will call back soon!',
        'Friends': '$name right now! Text if urgent.',
        'Work': 'Busy in $name. Will get back to you shortly.',
        'Unknown': 'Unavailable right now. Auto-reply via NowNot.',
      },
    );
    _showDurationPicker(context, status);
  }

  void _handleLogOut() {
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(builder: (_) => const LoginView()),
    );
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<AppProvider>();
    final activeStatus = provider.activeStatus;
    final logs = provider.callLogs;

    return Scaffold(
      backgroundColor: AppTheme.bgVoid,
      appBar: AppBar(
        backgroundColor: const Color(0xFF0B0D1A).withOpacity(0.90),
        elevation: 0,
        titleSpacing: 16,
        title: Row(
          children: [
            Container(
              width: 10,
              height: 10,
              decoration: const BoxDecoration(
                color: AppTheme.primaryContainer,
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                    color: AppTheme.primaryContainer,
                    blurRadius: 10,
                    spreadRadius: 1,
                  ),
                ],
              ),
            ),
            const SizedBox(width: 8),
            Text(
              'NowNot',
              style: GoogleFonts.outfit(
                fontSize: 20,
                fontWeight: FontWeight.w800,
                color: Colors.white,
              ),
            ),
          ],
        ),
        actions: [
          // Log Out Button
          Center(
            child: InkWell(
              onTap: _handleLogOut,
              borderRadius: BorderRadius.circular(20),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.04),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: Colors.redAccent.withOpacity(0.40)),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.logout, color: Color(0xFFEF4444), size: 14),
                    const SizedBox(width: 5),
                    Text(
                      'Log Out',
                      style: GoogleFonts.inter(
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        color: const Color(0xFFEF4444),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          const SizedBox(width: 8),

          // Active Status indicator pill
          Center(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
              decoration: BoxDecoration(
                color: AppTheme.primaryContainer.withOpacity(0.20),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppTheme.primaryContainer.withOpacity(0.40)),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 6,
                    height: 6,
                    decoration: BoxDecoration(
                      color: activeStatus != null ? AppTheme.statusActive : Colors.grey,
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(width: 6),
                  Text(
                    activeStatus != null ? 'Active' : 'Active',
                    style: GoogleFonts.inter(
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      color: AppTheme.primaryLavender,
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(width: 6),

          // Settings Gear Icon
          IconButton(
            icon: const Icon(Icons.settings_outlined, color: Colors.white70, size: 20),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const StatusEditorView()),
              );
            },
          ),
          const SizedBox(width: 8),
        ],
      ),

      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.all(16.0),
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 520),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 8),
                // ── Active Status Section / Idle Card ──
                if (activeStatus != null) ...[
                  ActiveStatusCard(
                    activeStatus: activeStatus,
                    onDeactivate: () => provider.clearActiveStatus(),
                  ),
                  const SizedBox(height: 24),
                ] else ...[
                  GlassContainer(
                    child: SizedBox(
                      width: double.infinity,
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const SizedBox(height: 6),
                          const Text(
                            '🌙',
                            style: TextStyle(
                              fontSize: 32,
                              inherit: false,
                              fontFamilyFallback: ['Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji'],
                            ),
                          ),
                          const SizedBox(height: 10),
                          Text(
                            'No Status Active',
                            style: GoogleFonts.outfit(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Select a quick status below to turn on auto-replies.',
                            style: GoogleFonts.inter(
                              fontSize: 12,
                              color: const Color(0xFF94A3B8),
                            ),
                          ),
                          const SizedBox(height: 6),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                ],

                // ── ⚡ Quick Select Bento Section ──
                Row(
                  children: [
                    const Icon(Icons.bolt, color: AppTheme.primaryLavender, size: 18),
                    const SizedBox(width: 6),
                    Text(
                      'Quick Select',
                      style: GoogleFonts.outfit(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: Colors.white,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),

                // 6 Bento Grid Buttons (3 columns x 2 rows)
                GridView.count(
                  crossAxisCount: 3,
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  crossAxisSpacing: 10,
                  mainAxisSpacing: 10,
                  childAspectRatio: 1.25,
                  children: [
                    _buildBentoTile(
                      emoji: '😴',
                      label: 'Sleeping',
                      onTap: () => _activatePreset(context, 'Sleeping', '😴'),
                    ),
                    _buildBentoTile(
                      emoji: '💼',
                      label: 'In a Meeting',
                      onTap: () => _activatePreset(context, 'In a Meeting', '💼'),
                    ),
                    _buildBentoTile(
                      emoji: '📚',
                      label: 'Studying',
                      onTap: () => _activatePreset(context, 'Studying', '📚'),
                    ),
                    _buildBentoTile(
                      emoji: '🚗',
                      label: 'Driving',
                      onTap: () => _activatePreset(context, 'Driving', '🚗'),
                    ),
                    _buildBentoTile(
                      emoji: '💪',
                      label: 'Gym',
                      onTap: () => _activatePreset(context, 'Gym', '💪'),
                    ),
                    _buildSetStatusButton(
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => const StatusEditorView()),
                        );
                      },
                    ),
                  ],
                ),

                const SizedBox(height: 28),

                // ── 🕒 Missed Activity Feed Section ──
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.history, color: AppTheme.primaryLavender, size: 18),
                        const SizedBox(width: 6),
                        Text(
                          'Missed Activity',
                          style: GoogleFonts.outfit(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: Colors.white,
                          ),
                        ),
                      ],
                    ),
                    TextButton(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => const CallLogView()),
                        );
                      },
                      child: Text(
                        'View All',
                        style: GoogleFonts.inter(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: const Color(0xFF94A3B8),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),

                if (logs.isEmpty) ...[
                  GlassContainer(
                    child: Container(
                      width: double.infinity,
                      padding: const EdgeInsets.symmetric(vertical: 24),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(Icons.history, color: Color(0xFF64748B), size: 28),
                          const SizedBox(height: 10),
                          Text(
                            'No missed call activity yet',
                            style: GoogleFonts.inter(
                              fontSize: 13,
                              color: const Color(0xFF94A3B8),
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ] else ...[
                  for (final log in logs.take(4))
                    _buildActivityTile(
                      name: log.contactName,
                      time: '${log.timestamp.hour.toString().padLeft(2, '0')}:${log.timestamp.minute.toString().padLeft(2, '0')}',
                      groupTag: log.groupTag,
                      avatarEmoji: _getGroupEmoji(log.groupTag),
                    ),
                ],

                const SizedBox(height: 20),
              ],
            ),
          ),
        ),
      ),

      // ── Custom Bottom Navigation Bar with Top Active Line ──
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: const Color(0xFF0B0D1A).withOpacity(0.95),
          border: Border(top: BorderSide(color: Colors.white.withOpacity(0.08))),
        ),
        child: SafeArea(
          child: SizedBox(
            height: 60,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildNavItem(0, Icons.grid_view_rounded, 'Dashboard'),
                _buildNavItem(1, Icons.radio_button_checked, 'Statuses'),
                _buildNavItem(2, Icons.chat_bubble_outline, 'Messages'),
                _buildNavItem(3, Icons.call_outlined, 'Log'),
                _buildNavItem(4, Icons.calendar_today_outlined, 'Scheduler'),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem(int index, IconData icon, String label) {
    final isSelected = _selectedNavIndex == index;
    return InkWell(
      onTap: () {
        setState(() => _selectedNavIndex = index);
        if (index == 1 || index == 2) {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const StatusEditorView()),
          );
        } else if (index == 3) {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const CallLogView()),
          );
        }
      },
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          // Active Top Indicator Bar
          AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            height: 3,
            width: isSelected ? 24 : 0,
            decoration: BoxDecoration(
              color: AppTheme.primaryContainer,
              borderRadius: BorderRadius.circular(2),
              boxShadow: isSelected
                  ? [
                      const BoxShadow(
                        color: AppTheme.primaryContainer,
                        blurRadius: 6,
                        spreadRadius: 1,
                      ),
                    ]
                  : [],
            ),
          ),
          const Spacer(),
          Icon(
            icon,
            size: 20,
            color: isSelected ? Colors.white : const Color(0xFF64748B),
          ),
          const SizedBox(height: 3),
          Text(
            label,
            style: GoogleFonts.inter(
              fontSize: 10,
              fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
              color: isSelected ? Colors.white : const Color(0xFF64748B),
            ),
          ),
          const SizedBox(height: 6),
        ],
      ),
    );
  }

  Widget _buildBentoTile({
    required String emoji,
    required String label,
    required VoidCallback onTap,
  }) {
    return GlassContainer(
      padding: EdgeInsets.zero,
      onTap: onTap,
      child: SizedBox.expand(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              emoji,
              style: GoogleFonts.notoColorEmoji(
                fontSize: 24,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: GoogleFonts.inter(
                fontSize: 11,
                fontWeight: FontWeight.w600,
                color: Colors.white,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSetStatusButton({required VoidCallback onTap}) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        decoration: BoxDecoration(
          color: const Color(0xFF059669), // Vibrant Green
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: const Color(0xFF059669).withOpacity(0.35),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: SizedBox.expand(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.add_circle_outline, color: Colors.white, size: 24),
              const SizedBox(height: 4),
              Text(
                'Set Status',
                style: GoogleFonts.inter(
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _getGroupEmoji(String groupTag) {
    switch (groupTag.toLowerCase()) {
      case 'family':
        return '👩';
      case 'friends':
        return '👧';
      case 'work':
        return '👨‍💼';
      default:
        return '👤';
    }
  }

  Widget _buildActivityTile({
    required String name,
    required String time,
    required String groupTag,
    required String avatarEmoji,
  }) {
    return GlassContainer(
      margin: const EdgeInsets.only(bottom: 8),
      child: Row(
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: AppTheme.bgSurface,
              shape: BoxShape.circle,
              border: Border.all(color: Colors.white12),
            ),
            child: Center(
              child: Text(
                avatarEmoji,
                style: const TextStyle(
                  fontSize: 16,
                  inherit: false,
                  fontFamilyFallback: ['Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji'],
                ),
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  style: GoogleFonts.inter(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: Colors.white,
                  ),
                ),
                Text(
                  'Missed Call · $groupTag',
                  style: GoogleFonts.inter(
                    fontSize: 11,
                    color: const Color(0xFF94A3B8),
                  ),
                ),
              ],
            ),
          ),
          Text(
            time,
            style: GoogleFonts.jetBrainsMono(
              fontSize: 11,
              color: const Color(0xFF64748B),
            ),
          ),
        ],
      ),
    );
  }
}
