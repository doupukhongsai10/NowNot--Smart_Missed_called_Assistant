import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/status_model.dart';
import '../theme/app_theme.dart';
import 'glass_container.dart';

class StatusTile extends StatelessWidget {
  final StatusModel status;
  final VoidCallback onActivate;
  final VoidCallback onEdit;

  const StatusTile({
    super.key,
    required this.status,
    required this.onActivate,
    required this.onEdit,
  });

  @override
  Widget build(BuildContext context) {
    return GlassContainer(
      margin: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.05),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Text(
              status.emoji,
              style: GoogleFonts.notoColorEmoji(fontSize: 24),
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  status.name,
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontSize: 18,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '${status.groupMessages.length} tailored group messages',
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
              ],
            ),
          ),
          IconButton(
            onPressed: onEdit,
            icon: const Icon(Icons.edit_outlined, color: AppTheme.textSecondary),
            tooltip: 'Edit Status',
          ),
          ElevatedButton(
            onPressed: onActivate,
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.primaryAccent,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10),
              ),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            ),
            child: const Text('Activate'),
          ),
        ],
      ),
    );
  }
}
