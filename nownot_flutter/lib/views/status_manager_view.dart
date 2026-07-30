import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import '../theme/app_theme.dart';
import '../widgets/glass_container.dart';
import 'status_editor_view.dart';

class StatusManagerView extends StatefulWidget {
  const StatusManagerView({super.key});

  @override
  State<StatusManagerView> createState() => _StatusManagerViewState();
}

class _StatusManagerViewState extends State<StatusManagerView> {
  final List<int> _quickDurations = [30, 60, 120, 240, 480];

  String _formatPillLabel(int mins) {
    if (mins >= 60) {
      return '${mins ~/ 60}h';
    }
    return '${mins}m';
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AppProvider>(
      builder: (context, provider, child) {
        final activeStatus = provider.activeStatus;
        final statuses = provider.statuses;

        return Scaffold(
          backgroundColor: AppTheme.bgBase,
          body: SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // ── Header & New Status Button ──
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Status Manager',
                            style: GoogleFonts.outfit(
                              fontSize: 22,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                              letterSpacing: -0.5,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            'Select or create availability statuses',
                            style: GoogleFonts.inter(
                              fontSize: 12,
                              color: const Color(0xFF94A3B8),
                            ),
                          ),
                        ],
                      ),
                      ElevatedButton.icon(
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => const StatusEditorView(),
                            ),
                          );
                        },
                        icon: const Icon(Icons.add_rounded, size: 18),
                        label: Text(
                          'New Status',
                          style: GoogleFonts.inter(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF7C3AED),
                          foregroundColor: Colors.white,
                          elevation: 4,
                          shadowColor: const Color(0x667C3AED),
                          padding: const EdgeInsets.symmetric(
                            horizontal: 14,
                            vertical: 10,
                          ),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 20),

                  // ── Currently Active Banner (if active) ──
                  if (activeStatus != null) ...[
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: const Color(0x1A7C3AED), // rgba(124, 58, 237, 0.10)
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: const Color(0x668B5CF6),
                          width: 1.2,
                        ),
                        boxShadow: const [
                          BoxShadow(
                            color: Color(0x267C3AED),
                            blurRadius: 16,
                            spreadRadius: 1,
                          ),
                        ],
                      ),
                      child: Row(
                        children: [
                          Text(
                            activeStatus.status.emoji,
                            style: GoogleFonts.notoColorEmoji(fontSize: 28),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'CURRENTLY ACTIVE',
                                  style: GoogleFonts.inter(
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                    letterSpacing: 1.2,
                                    color: AppTheme.primaryLavender.withOpacity(0.8),
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  activeStatus.status.name,
                                  style: GoogleFonts.outfit(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          InkWell(
                            onTap: () => provider.clearActiveStatus(),
                            borderRadius: BorderRadius.circular(8),
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 12,
                                vertical: 6,
                              ),
                              decoration: BoxDecoration(
                                color: const Color(0x33EF4444), // rgba(239, 68, 68, 0.2)
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(
                                  color: const Color(0x66EF4444),
                                ),
                              ),
                              child: Text(
                                'End Now',
                                style: GoogleFonts.inter(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600,
                                  color: const Color(0xFFF87171),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                  ],

                  // ── Statuses List ──
                  ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: statuses.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 12),
                    itemBuilder: (context, index) {
                      final status = statuses[index];
                      final isThisActive = activeStatus?.status.id == status.id;

                      return GlassContainer(
                        borderColor: isThisActive
                            ? const Color(0x808B5CF6)
                            : Colors.white.withOpacity(0.08),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // ── Top Row: Emoji, Info & Actions ──
                            Row(
                              children: [
                                Text(
                                  status.emoji,
                                  style: GoogleFonts.notoColorEmoji(fontSize: 30),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        status.name,
                                        style: GoogleFonts.outfit(
                                          fontSize: 16,
                                          fontWeight: FontWeight.bold,
                                          color: Colors.white,
                                        ),
                                      ),
                                      const SizedBox(height: 2),
                                      Text(
                                        'Default: ${status.defaultDurationMinutes} mins',
                                        style: GoogleFonts.inter(
                                          fontSize: 11,
                                          color: const Color(0xFF94A3B8),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),

                                // Edit Button
                                IconButton(
                                  onPressed: () {
                                    Navigator.push(
                                      context,
                                      MaterialPageRoute(
                                        builder: (_) => StatusEditorView(
                                          statusToEdit: status,
                                        ),
                                      ),
                                    );
                                  },
                                  icon: const Icon(
                                    Icons.edit_note_rounded,
                                    color: Color(0xFF94A3B8),
                                    size: 22,
                                  ),
                                  tooltip: 'Edit Status',
                                  padding: EdgeInsets.zero,
                                  constraints: const BoxConstraints(
                                    minWidth: 32,
                                    minHeight: 32,
                                  ),
                                ),

                                // Delete Button (Custom Statuses only)
                                if (!status.isSystem)
                                  IconButton(
                                    onPressed: () => provider.deleteStatus(status.id),
                                    icon: const Icon(
                                      Icons.delete_outline_rounded,
                                      color: Color(0xFFF87171),
                                      size: 20,
                                    ),
                                    tooltip: 'Delete Status',
                                    padding: EdgeInsets.zero,
                                    constraints: const BoxConstraints(
                                      minWidth: 32,
                                      minHeight: 32,
                                    ),
                                  ),

                                const SizedBox(width: 4),

                                // Activate Button / Active Badge
                                if (isThisActive) ...[
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 10,
                                      vertical: 6,
                                    ),
                                    decoration: BoxDecoration(
                                      color: const Color(0x337C3AED),
                                      borderRadius: BorderRadius.circular(10),
                                      border: Border.all(
                                        color: const Color(0x668B5CF6),
                                      ),
                                    ),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        Container(
                                          width: 6,
                                          height: 6,
                                          decoration: const BoxDecoration(
                                            color: Color(0xFF10B981),
                                            shape: BoxShape.circle,
                                          ),
                                        ),
                                        const SizedBox(width: 6),
                                        Text(
                                          'Active',
                                          style: GoogleFonts.inter(
                                            fontSize: 12,
                                            fontWeight: FontWeight.bold,
                                            color: AppTheme.primaryLavender,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ] else ...[
                                  ElevatedButton(
                                    onPressed: () {
                                      provider.activateStatus(
                                        status: status,
                                        durationMinutes: status.defaultDurationMinutes,
                                      );
                                    },
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: const Color(0x2E7C3AED),
                                      foregroundColor: AppTheme.primaryLavender,
                                      elevation: 0,
                                      side: const BorderSide(
                                        color: Color(0x598B5CF6),
                                      ),
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 14,
                                        vertical: 8,
                                      ),
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(10),
                                      ),
                                    ),
                                    child: Text(
                                      'Activate',
                                      style: GoogleFonts.inter(
                                        fontSize: 12,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ),
                                ],
                              ],
                            ),

                            const SizedBox(height: 12),
                            Divider(color: Colors.white.withOpacity(0.06), height: 1),
                            const SizedBox(height: 10),

                            // ── Quick Activate Duration Pills ──
                            Row(
                              children: [
                                Text(
                                  isThisActive
                                      ? 'SET ACTIVE DURATION:'
                                      : 'QUICK ACTIVATE:',
                                  style: GoogleFonts.inter(
                                    fontSize: 9,
                                    fontWeight: FontWeight.bold,
                                    letterSpacing: 0.8,
                                    color: const Color(0xFF64748B),
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: Wrap(
                                    spacing: 6,
                                    runSpacing: 4,
                                    children: _quickDurations.map((mins) {
                                      return InkWell(
                                        onTap: () {
                                          provider.activateStatus(
                                            status: status,
                                            durationMinutes: mins,
                                          );
                                        },
                                        borderRadius: BorderRadius.circular(6),
                                        child: Container(
                                          padding: const EdgeInsets.symmetric(
                                            horizontal: 8,
                                            vertical: 4,
                                          ),
                                          decoration: BoxDecoration(
                                            color: Colors.white.withOpacity(0.04),
                                            borderRadius: BorderRadius.circular(6),
                                            border: Border.all(
                                              color: Colors.white.withOpacity(0.08),
                                            ),
                                          ),
                                          child: Text(
                                            _formatPillLabel(mins),
                                            style: GoogleFonts.inter(
                                              fontSize: 11,
                                              fontWeight: FontWeight.w500,
                                              color: const Color(0xFFCBD5E1),
                                            ),
                                          ),
                                        ),
                                      );
                                    }).toList(),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      );
                    },
                  ),

                  const SizedBox(height: 24),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}
