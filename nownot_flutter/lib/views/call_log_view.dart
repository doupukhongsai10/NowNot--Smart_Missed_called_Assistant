import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../providers/app_provider.dart';
import '../theme/app_theme.dart';
import '../widgets/glass_container.dart';

class CallLogView extends StatelessWidget {
  const CallLogView({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<AppProvider>();
    final logs = provider.callLogs;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Missed Call History'),
      ),
      body: logs.isEmpty
          ? const Center(
              child: Text(
                'No missed calls recorded.',
                style: TextStyle(color: AppTheme.textSecondary, fontSize: 16),
              ),
            )
          : ListView.builder(
              padding: const EdgeInsets.all(20),
              itemCount: logs.length,
              itemBuilder: (context, index) {
                final log = logs[index];
                final dateStr = DateFormat('MMM dd, hh:mm a').format(
                  DateTime.fromMillisecondsSinceEpoch(log.timestampMs),
                );

                return GlassContainer(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              const Icon(Icons.phone_missed, color: AppTheme.dangerRose, size: 20),
                              const SizedBox(width: 8),
                              Text(
                                log.contactName.isNotEmpty ? log.contactName : log.phoneNumber,
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                              ),
                            ],
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: AppTheme.secondaryAccent.withOpacity(0.2),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              log.groupTag,
                              style: const TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                color: AppTheme.secondaryAccent,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Phone: ${log.phoneNumber} • $dateStr',
                        style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary),
                      ),
                      const Divider(color: AppTheme.glassBorder, height: 20),
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Icon(Icons.reply, size: 16, color: AppTheme.textSecondary),
                          const SizedBox(width: 6),
                          Expanded(
                            child: Text(
                              log.messageSent,
                              style: const TextStyle(fontSize: 13, fontStyle: FontStyle.italic, color: Colors.white70),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                );
              },
            ),
    );
  }
}
