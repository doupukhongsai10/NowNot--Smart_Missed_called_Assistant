import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import '../models/status_model.dart';
import '../theme/app_theme.dart';
import '../widgets/glass_container.dart';
import '../widgets/active_status_card.dart';
import '../widgets/status_tile.dart';
import 'status_editor_view.dart';
import 'call_log_view.dart';

class DashboardView extends StatelessWidget {
  const DashboardView({super.key});

  void _showDurationPicker(BuildContext context, StatusModel status) {
    int selectedMinutes = 60;

    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.background,
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
                      Text(status.emoji, style: const TextStyle(fontSize: 28)),
                      const SizedBox(width: 12),
                      Text(
                        'Activate "${status.name}"',
                        style: Theme.of(context).textTheme.titleLarge,
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  Text(
                    'Select Duration: ${selectedMinutes >= 60 ? "${selectedMinutes ~/ 60}h" : "$selectedMinutes mins"}',
                    style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.secondaryAccent),
                  ),
                  Slider(
                    value: selectedMinutes.toDouble(),
                    min: 15,
                    max: 480,
                    divisions: 31,
                    activeColor: AppTheme.primaryAccent,
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
                      backgroundColor: AppTheme.primaryAccent,
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

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<AppProvider>();
    final activeStatus = provider.activeStatus;

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: const BoxDecoration(
                color: AppTheme.primaryAccent,
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.shield_outlined, color: Colors.white, size: 20),
            ),
            const SizedBox(width: 10),
            const Text(
              'NowNot',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 22),
            ),
          ],
        ),
        actions: [
          IconButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const CallLogView()),
              );
            },
            icon: const Icon(Icons.history_outlined, color: AppTheme.textPrimary),
            tooltip: 'Call Logs',
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Active Status Card or Banner
            if (activeStatus != null) ...[
              ActiveStatusCard(
                activeStatus: activeStatus,
                onDeactivate: () => provider.clearActiveStatus(),
              ),
              const SizedBox(height: 24),
            ] else ...[
              GlassContainer(
                color: Colors.white.withOpacity(0.03),
                child: Row(
                  children: [
                    const Icon(Icons.info_outline, color: AppTheme.secondaryAccent, size: 28),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'No Status Currently Active',
                            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            'Select a status below to enable missed call auto-replies.',
                            style: Theme.of(context).textTheme.bodyMedium,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
            ],

            // Section: Saved Statuses
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Availability Statuses',
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(fontSize: 20),
                ),
                TextButton.icon(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const StatusEditorView()),
                    );
                  },
                  icon: const Icon(Icons.add, size: 20),
                  label: const Text('Add Custom'),
                  style: TextButton.styleFrom(foregroundColor: AppTheme.secondaryAccent),
                ),
              ],
            ),
            const SizedBox(height: 12),

            ...provider.statuses.map((status) {
              return StatusTile(
                status: status,
                onActivate: () => _showDurationPicker(context, status),
                onEdit: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => StatusEditorView(statusToEdit: status),
                    ),
                  );
                },
              );
            }),

            const SizedBox(height: 24),

            // Section: Recent Missed Call Activity
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Recent Activity',
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(fontSize: 20),
                ),
                if (provider.callLogs.isNotEmpty)
                  TextButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const CallLogView()),
                      );
                    },
                    child: const Text('View All', style: TextStyle(color: AppTheme.secondaryAccent)),
                  ),
              ],
            ),
            const SizedBox(height: 12),

            if (provider.callLogs.isEmpty)
              const GlassContainer(
                child: Center(
                  child: Padding(
                    padding: EdgeInsets.all(16.0),
                    child: Text(
                      'No missed calls recorded yet.',
                      style: TextStyle(color: AppTheme.textSecondary),
                    ),
                  ),
                ),
              )
            else
              ...provider.callLogs.take(3).map((log) {
                return GlassContainer(
                  margin: const EdgeInsets.only(bottom: 8),
                  padding: const EdgeInsets.all(12),
                  child: Row(
                    children: [
                      const CircleAvatar(
                        backgroundColor: AppTheme.cardBackground,
                        child: Icon(Icons.phone_missed, color: AppTheme.dangerRose, size: 20),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              log.contactName.isNotEmpty ? log.contactName : log.phoneNumber,
                              style: const TextStyle(fontWeight: FontWeight.bold),
                            ),
                            Text(
                              'Group: ${log.groupTag} • Replied: ${log.autoReplied ? "Yes" : "Failed"}',
                              style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                );
              }),
          ],
        ),
      ),
    );
  }
}
