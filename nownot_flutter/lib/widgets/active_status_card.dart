import 'package:flutter/material.dart';
import '../models/active_status_model.dart';
import '../theme/app_theme.dart';
import 'glass_container.dart';

class ActiveStatusCard extends StatelessWidget {
  final ActiveStatusModel activeStatus;
  final VoidCallback onDeactivate;

  const ActiveStatusCard({
    super.key,
    required this.activeStatus,
    required this.onDeactivate,
  });

  String _formatRemainingTime(int totalSeconds) {
    final hours = totalSeconds ~/ 3600;
    final minutes = (totalSeconds % 3600) ~/ 60;
    final seconds = totalSeconds % 60;

    if (hours > 0) {
      return '${hours}h ${minutes}m ${seconds}s';
    } else if (minutes > 0) {
      return '${minutes}m ${seconds}s';
    } else {
      return '${seconds}s';
    }
  }

  @override
  Widget build(BuildContext context) {
    final status = activeStatus.status;
    final remaining = activeStatus.remainingSeconds;
    final progress = activeStatus.progress;

    return GlassContainer(
      borderColor: AppTheme.primaryAccent.withOpacity(0.5),
      color: const Color(0xCC1E1B4B), // Deep indigo tinted glass
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: AppTheme.primaryAccent.withOpacity(0.2),
                      shape: BoxShape.circle,
                    ),
                    child: Text(
                      status.emoji,
                      style: const TextStyle(fontSize: 24),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        status.name,
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        activeStatus.isManual ? 'Manual Status' : 'Scheduled Window',
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: AppTheme.secondaryAccent,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              IconButton(
                onPressed: onDeactivate,
                icon: const Icon(Icons.stop_circle_outlined, color: AppTheme.dangerRose, size: 28),
                tooltip: 'Deactivate Status',
              ),
            ],
          ),
          const SizedBox(height: 16),
          // Progress Bar
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: LinearProgressIndicator(
              value: progress,
              minHeight: 8,
              backgroundColor: Colors.white10,
              valueColor: const AlwaysStoppedAnimation<Color>(AppTheme.secondaryAccent),
            ),
          ),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Auto-reply active',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: AppTheme.successGreen),
              ),
              Text(
                _formatRemainingTime(remaining),
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: AppTheme.textPrimary,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
