import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/active_status_model.dart';
import '../theme/app_theme.dart';

class ActiveStatusCard extends StatelessWidget {
  final ActiveStatusModel activeStatus;
  final VoidCallback onDeactivate;

  const ActiveStatusCard({
    super.key,
    required this.activeStatus,
    required this.onDeactivate,
  });

  String _formatDigitalCountdown(int totalSeconds) {
    final hours = (totalSeconds ~/ 3600).toString().padLeft(2, '0');
    final minutes = ((totalSeconds % 3600) ~/ 60).toString().padLeft(2, '0');
    final seconds = (totalSeconds % 60).toString().padLeft(2, '0');
    return '$hours:$minutes:$seconds';
  }

  @override
  Widget build(BuildContext context) {
    final status = activeStatus.status;
    final remaining = activeStatus.remainingSeconds;

    return Container(
      decoration: BoxDecoration(
        color: const Color(0x1A7C3AED), // rgba(124,58,237,0.10)
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppTheme.glassBorderActive, width: 1.2),
        boxShadow: const [
          BoxShadow(
            color: Color(0x388B5CF6),
            blurRadius: 28,
            spreadRadius: 2,
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: Stack(
          children: [
            // Atmospheric Top Radial Glow Overlay
            Positioned.fill(
              child: Container(
                decoration: const BoxDecoration(
                  gradient: RadialGradient(
                    center: Alignment(0.0, -1.0),
                    radius: 1.2,
                    colors: [
                      Color(0x387C3AED), // rgba(124,58,237,0.22)
                      Colors.transparent,
                    ],
                  ),
                ),
              ),
            ),
            // Background Watermark Emoji
            Positioned(
              top: 8,
              right: 12,
              child: Opacity(
                opacity: 0.15,
                child: Text(
                  status.emoji,
                  style: GoogleFonts.notoColorEmoji(fontSize: 72),
                ),
              ),
            ),
            // Content
            Padding(
              padding: const EdgeInsets.all(22.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Label: CURRENT STATUS
                  Text(
                    'CURRENT STATUS',
                    style: GoogleFonts.inter(
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      letterSpacing: 1.5,
                      color: AppTheme.primaryLavender.withOpacity(0.65),
                    ),
                  ),
                  const SizedBox(height: 8),

                  // Emoji + Status Name
                  Row(
                    children: [
                      Text(
                        status.emoji,
                        style: GoogleFonts.notoColorEmoji(fontSize: 32),
                      ),
                      const SizedBox(width: 12),
                      Text(
                        status.name,
                        style: GoogleFonts.outfit(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.primaryLavender,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),

                  // Schedule Indicator (Mono)
                  Row(
                    children: [
                      const Icon(Icons.schedule, size: 14, color: AppTheme.primaryLavender),
                      const SizedBox(width: 4),
                      Text(
                        'until 5:00 PM',
                        style: GoogleFonts.jetBrainsMono(
                          fontSize: 13,
                          color: AppTheme.primaryLavender.withOpacity(0.75),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),

                  // Digital Timer & Deactivate Button
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'TIME REMAINING',
                            style: GoogleFonts.inter(
                              fontSize: 10,
                              fontWeight: FontWeight.w500,
                              letterSpacing: 1.2,
                              color: AppTheme.primaryLavender.withOpacity(0.50),
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            _formatDigitalCountdown(remaining),
                            style: GoogleFonts.jetBrainsMono(
                              fontSize: 34,
                              fontWeight: FontWeight.bold,
                              color: AppTheme.primaryLavender,
                              height: 1.0,
                            ),
                          ),
                        ],
                      ),
                      ElevatedButton.icon(
                        onPressed: onDeactivate,
                        icon: const Icon(Icons.stop_circle_outlined, size: 18),
                        label: const Text('End'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0x26EF4444),
                          foregroundColor: const Color(0xFFF87171),
                          elevation: 0,
                          side: const BorderSide(color: Color(0x59EF4444)),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(30),
                          ),
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Auto-reply Note
                  Row(
                    children: [
                      const Icon(Icons.auto_awesome, size: 13, color: AppTheme.primaryLavender),
                      const SizedBox(width: 6),
                      Text(
                        'Auto-replying to missed calls',
                        style: GoogleFonts.inter(
                          fontSize: 12,
                          color: AppTheme.primaryLavender.withOpacity(0.50),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
