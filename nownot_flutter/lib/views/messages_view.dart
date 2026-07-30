import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import '../theme/app_theme.dart';

class MessagesView extends StatefulWidget {
  const MessagesView({super.key});

  @override
  State<MessagesView> createState() => _MessagesViewState();
}

class _MessagesViewState extends State<MessagesView> {
  final List<Map<String, dynamic>> _groups = [
    {
      'key': 'Family',
      'icon': '🩷',
      'color': const Color(0xFFF472B6),
      'borderColor': const Color(0x73F472B6),
      'bgColor': const Color(0x10F472B6),
      'badge': 'PRIORITY',
      'badgeBg': const Color(0x26F472B6),
    },
    {
      'key': 'Friends',
      'icon': '👥',
      'color': const Color(0xFF38BDF8),
      'borderColor': const Color(0x7338BDF8),
      'bgColor': const Color(0x1038BDF8),
      'badge': 'ACTIVE',
      'badgeBg': const Color(0x2638BDF8),
    },
    {
      'key': 'Work',
      'icon': '💼',
      'color': const Color(0xFFFBBF24),
      'borderColor': const Color(0x73FBBF24),
      'bgColor': const Color(0x10FBBF24),
      'badge': 'SCHEDULED',
      'badgeBg': const Color(0x26FBBF24),
    },
    {
      'key': 'Unknown',
      'icon': '👤',
      'color': const Color(0xFF94A3B8),
      'borderColor': const Color(0x5994A3B8),
      'bgColor': const Color(0x0A94A3B8),
      'badge': 'DEFAULT',
      'badgeBg': const Color(0x1A94A3B8),
    },
  ];

  void _showTestToast(BuildContext context, String groupKey, String message, Color color) {
    ScaffoldMessenger.of(context).hideCurrentSnackBar();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        elevation: 8,
        behavior: SnackBarBehavior.floating,
        backgroundColor: const Color(0xF7161A35),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: BorderSide(color: color.withOpacity(0.5)),
        ),
        margin: const EdgeInsets.only(bottom: 24, left: 16, right: 16),
        duration: const Duration(seconds: 4),
        content: Row(
          children: [
            Icon(Icons.sms_outlined, color: color, size: 20),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'TEST REPLY · $groupKey'.toUpperCase(),
                    style: GoogleFonts.inter(
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1.1,
                      color: color,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    message.isEmpty ? '(No message set)' : message,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      color: const Color(0xFFE3E1EC),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showEditModal(BuildContext context, String groupKey, String currentMessage, Color accentColor) {
    final controller = TextEditingController(text: currentMessage);
    final suggestions = [
      "I'll call you back soon!",
      'Currently unavailable.',
      'In a meeting, will reply later.',
      'Text me instead.',
    ];

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return Container(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(context).viewInsets.bottom + 20,
            left: 20,
            right: 20,
            top: 16,
          ),
          decoration: BoxDecoration(
            color: const Color(0xFF161A35),
            borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
            border: Border.all(color: Colors.white.withOpacity(0.12)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.white24,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Edit $groupKey Message',
                    style: GoogleFonts.outfit(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: accentColor,
                    ),
                  ),
                  IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(Icons.close, color: Colors.white54, size: 20),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Text(
                'AUTO-REPLY MESSAGE',
                style: GoogleFonts.inter(
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.1,
                  color: AppTheme.primaryLavender.withOpacity(0.6),
                ),
              ),
              const SizedBox(height: 6),
              TextFormField(
                controller: controller,
                maxLines: 4,
                maxLength: 160,
                style: GoogleFonts.inter(fontSize: 13, color: Colors.white),
                decoration: InputDecoration(
                  hintText: 'Enter auto-reply text...',
                  hintStyle: GoogleFonts.inter(color: Colors.white38),
                  filled: true,
                  fillColor: accentColor.withOpacity(0.06),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: BorderSide(color: accentColor),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: BorderSide(color: accentColor.withOpacity(0.4)),
                  ),
                ),
              ),
              const SizedBox(height: 12),
              Text(
                'QUICK SUGGESTIONS',
                style: GoogleFonts.inter(
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.1,
                  color: Colors.white38,
                ),
              ),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: suggestions.map((s) {
                  return InkWell(
                    onTap: () => controller.text = s,
                    borderRadius: BorderRadius.circular(20),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.05),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: Colors.white10),
                      ),
                      child: Text(
                        s,
                        style: GoogleFonts.inter(fontSize: 11, color: AppTheme.primaryLavender),
                      ),
                    ),
                  );
                }).toList(),
              ),
              const SizedBox(height: 20),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => Navigator.pop(context),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        side: const BorderSide(color: Colors.white24),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: Text('Cancel', style: GoogleFonts.inter(color: Colors.white70)),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () {
                        final text = controller.text.trim();
                        if (text.isNotEmpty) {
                          context.read<AppProvider>().updateGroupMessage(groupKey, text);
                        }
                        Navigator.pop(context);
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF7C3AED),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: Text('Save Message', style: GoogleFonts.inter(fontWeight: FontWeight.bold)),
                    ),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AppProvider>(
      builder: (context, provider, child) {
        final activeStatus = provider.activeStatus;
        final currentStatus = activeStatus?.status ?? (provider.statuses.isNotEmpty ? provider.statuses.first : null);
        final messagesMap = currentStatus?.groupMessages ?? {};

        return Scaffold(
          backgroundColor: AppTheme.bgBase,
          body: SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // ── Title & Subtitle ──
                  Text(
                    'Messages',
                    style: GoogleFonts.outfit(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.primaryLavender,
                      letterSpacing: -0.5,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    'Configure auto-replies for your contact groups. NowNot will handle responses based on your active status.',
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      color: const Color(0xFF94A3B8),
                      height: 1.4,
                    ),
                  ),

                  const SizedBox(height: 16),

                  // ── Active Status Banner (if active) ──
                  if (activeStatus != null) ...[
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                      decoration: BoxDecoration(
                        color: const Color(0x1A8B5CF6),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: const Color(0x408B5CF6)),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.auto_awesome, color: Color(0xFF8B5CF6), size: 18),
                          const SizedBox(width: 10),
                          Expanded(
                            child: RichText(
                              text: TextSpan(
                                children: [
                                  TextSpan(
                                    text: '${activeStatus.status.emoji} ${activeStatus.status.name} ',
                                    style: GoogleFonts.inter(
                                      fontSize: 12,
                                      fontWeight: FontWeight.bold,
                                      color: AppTheme.primaryLavender,
                                    ),
                                  ),
                                  TextSpan(
                                    text: 'is active — these messages are being sent to missed callers right now.',
                                    style: GoogleFonts.inter(
                                      fontSize: 12,
                                      color: const Color(0xFFCBD5E1),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                  ],

                  // ── Group Cards ──
                  ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: _groups.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 12),
                    itemBuilder: (context, index) {
                      final group = _groups[index];
                      final groupKey = group['key'] as String;
                      final icon = group['icon'] as String;
                      final color = group['color'] as Color;
                      final borderColor = group['borderColor'] as Color;
                      final badge = group['badge'] as String;
                      final badgeBg = group['badgeBg'] as Color;

                      String defaultFallback = 'I am currently away. (Sent via NowNot)';
                      if (groupKey == 'Work') {
                        defaultFallback = 'I am currently in a meeting and not checking messages. For immediate assistance, please contact the support desk.';
                      } else if (groupKey == 'Unknown') {
                        defaultFallback = 'The recipient is currently unavailable. Your message has been logged and will be seen once they are back online.';
                      }

                      final msg = (messagesMap[groupKey]?.isNotEmpty == true)
                          ? messagesMap[groupKey]!
                          : (messagesMap[groupKey == 'Friends' ? 'Friends & Relatives' : groupKey]?.isNotEmpty == true)
                              ? messagesMap[groupKey == 'Friends' ? 'Friends & Relatives' : groupKey]!
                              : defaultFallback;

                      return Container(
                        padding: const EdgeInsets.all(18),
                        decoration: BoxDecoration(
                          color: const Color(0xFF13172E).withOpacity(0.8),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: borderColor),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Header Row: Icon, Name & Badge
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  children: [
                                    Container(
                                      width: 38,
                                      height: 38,
                                      decoration: BoxDecoration(
                                        color: color.withOpacity(0.12),
                                        shape: BoxShape.circle,
                                        border: Border.all(color: borderColor),
                                      ),
                                      child: Center(
                                        child: Text(
                                          icon,
                                          style: GoogleFonts.notoColorEmoji(fontSize: 18),
                                        ),
                                      ),
                                    ),
                                    const SizedBox(width: 12),
                                    Text(
                                      groupKey,
                                      style: GoogleFonts.outfit(
                                        fontSize: 16,
                                        fontWeight: FontWeight.bold,
                                        color: color,
                                      ),
                                    ),
                                  ],
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: badgeBg,
                                    borderRadius: BorderRadius.circular(20),
                                    border: Border.all(color: borderColor),
                                  ),
                                  child: Text(
                                    badge,
                                    style: GoogleFonts.inter(
                                      fontSize: 9,
                                      fontWeight: FontWeight.bold,
                                      letterSpacing: 0.9,
                                      color: color,
                                    ),
                                  ),
                                ),
                              ],
                            ),

                            const SizedBox(height: 14),

                            Text(
                              'AUTO-REPLY MESSAGE',
                              style: GoogleFonts.inter(
                                fontSize: 9,
                                fontWeight: FontWeight.bold,
                                letterSpacing: 1.1,
                                color: const Color(0xFF64748B),
                              ),
                            ),
                            const SizedBox(height: 6),

                            Text(
                              msg,
                              style: GoogleFonts.inter(
                                fontSize: 13,
                                color: const Color(0xFFE2E8F0),
                                height: 1.5,
                              ),
                            ),

                            const SizedBox(height: 16),

                            // Footer: Timestamp, Circular Edit Button & Pill Test Reply Button
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  children: [
                                    const Icon(Icons.schedule_outlined, size: 14, color: Color(0xFF64748B)),
                                    const SizedBox(width: 6),
                                    Text(
                                      'Updated 22h ago',
                                      style: GoogleFonts.inter(fontSize: 11, color: const Color(0xFF64748B)),
                                    ),
                                  ],
                                ),
                                Row(
                                  children: [
                                    InkWell(
                                      onTap: () => _showEditModal(context, groupKey, msg, color),
                                      borderRadius: BorderRadius.circular(20),
                                      child: Container(
                                        width: 36,
                                        height: 36,
                                        decoration: BoxDecoration(
                                          color: Colors.white.withOpacity(0.04),
                                          shape: BoxShape.circle,
                                          border: Border.all(color: Colors.white.withOpacity(0.08)),
                                        ),
                                        child: const Icon(
                                          Icons.edit_note_rounded,
                                          color: Color(0xFF94A3B8),
                                          size: 18,
                                        ),
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    ElevatedButton.icon(
                                      onPressed: () => _showTestToast(context, groupKey, msg, color),
                                      icon: Icon(Icons.play_arrow_rounded, size: 16, color: color),
                                      label: Text(
                                        'Test Reply',
                                        style: GoogleFonts.inter(
                                          fontSize: 12,
                                          fontWeight: FontWeight.w600,
                                          color: color,
                                        ),
                                      ),
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: color.withOpacity(0.08),
                                        elevation: 0,
                                        side: BorderSide(color: borderColor),
                                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                                        shape: RoundedRectangleBorder(
                                          borderRadius: BorderRadius.circular(20),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ],
                        ),
                      );
                    },
                  ),

                  const SizedBox(height: 16),

                  // ── Bottom Info Note ──
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: const Color(0x147C3AED),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: const Color(0x337C3AED)),
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          width: 28,
                          height: 28,
                          decoration: const BoxDecoration(
                            color: Color(0x338B5CF6),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.info_rounded, color: Color(0xFFA78BFA), size: 16),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            'Auto-replies are only sent when a status is active. Each contact group receives the message set for it. Unknown callers get the Default reply.',
                            style: GoogleFonts.inter(
                              fontSize: 12,
                              color: const Color(0xFF94A3B8),
                              height: 1.4,
                            ),
                          ),
                        ),
                      ],
                    ),
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
