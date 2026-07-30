import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../providers/app_provider.dart';
import '../theme/app_theme.dart';
import '../widgets/glass_container.dart';

class CallLogView extends StatelessWidget {
  const CallLogView({super.key});

  Color _getGroupColor(String groupTag) {
    switch (groupTag.toLowerCase()) {
      case 'family':
        return AppTheme.groupFamily;
      case 'friends':
        return AppTheme.groupFriends;
      case 'work':
        return AppTheme.groupWork;
      default:
        return AppTheme.groupUnknown;
    }
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<AppProvider>();
    final logs = provider.callLogs;

    return Scaffold(
      backgroundColor: AppTheme.bgBase,
      appBar: AppBar(
        backgroundColor: AppTheme.bgBase,
        elevation: 0,
        title: Text(
          'Missed Call Activity',
          style: GoogleFonts.outfit(fontWeight: FontWeight.bold, color: AppTheme.primaryLavender),
        ),
      ),
      body: logs.isEmpty
          ? Center(
              child: Text(
                'No missed calls recorded.',
                style: GoogleFonts.inter(color: AppTheme.onSurfaceVariant, fontSize: 15),
              ),
            )
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: logs.length,
              itemBuilder: (context, index) {
                final log = logs[index];
                final groupColor = _getGroupColor(log.groupTag);
                final dateStr = DateFormat('HH:mm').format(
                  DateTime.fromMillisecondsSinceEpoch(log.timestampMs),
                );

                return GlassContainer(
                  margin: const EdgeInsets.only(bottom: 10),
                  leftAccentColor: groupColor,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            log.contactName.isNotEmpty ? log.contactName : log.phoneNumber,
                            style: GoogleFonts.inter(fontWeight: FontWeight.bold, fontSize: 15, color: AppTheme.onSurface),
                          ),
                          Text(
                            dateStr,
                            style: GoogleFonts.jetBrainsMono(fontSize: 12, color: AppTheme.onSurfaceVariant.withOpacity(0.50)),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Text(
                            'Missed Call · ',
                            style: GoogleFonts.inter(fontSize: 12, color: const Color(0xFF958DA1)),
                          ),
                          Text(
                            log.groupTag,
                            style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: groupColor),
                          ),
                        ],
                      ),
                      if (log.messageSent.isNotEmpty) ...[
                        const Divider(color: AppTheme.glassBorder, height: 20),
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Icon(Icons.reply, size: 14, color: AppTheme.onSurfaceVariant.withOpacity(0.60)),
                            const SizedBox(width: 6),
                            Expanded(
                              child: Text(
                                log.messageSent,
                                style: GoogleFonts.inter(fontSize: 12, fontStyle: FontStyle.italic, color: Colors.white70),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ],
                  ),
                );
              },
            ),
    );
  }
}
