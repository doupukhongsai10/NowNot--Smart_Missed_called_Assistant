import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../models/status_model.dart';
import '../providers/app_provider.dart';
import '../theme/app_theme.dart';
import '../widgets/glass_container.dart';

class StatusEditorView extends StatefulWidget {
  final StatusModel? statusToEdit;

  const StatusEditorView({super.key, this.statusToEdit});

  @override
  State<StatusEditorView> createState() => _StatusEditorViewState();
}

class _StatusEditorViewState extends State<StatusEditorView> {
  final _formKey = GlobalKey<FormState>();

  late TextEditingController _nameController;
  late TextEditingController _emojiController;
  late TextEditingController _familyMsgController;
  late TextEditingController _friendsMsgController;
  late TextEditingController _workMsgController;
  late TextEditingController _unknownMsgController;

  @override
  void initState() {
    super.initState();
    final status = widget.statusToEdit;
    _nameController = TextEditingController(text: status?.name ?? '');
    _emojiController = TextEditingController(text: status?.emoji ?? '📱');
    _familyMsgController = TextEditingController(text: status?.groupMessages['Family'] ?? '');
    _friendsMsgController = TextEditingController(text: status?.groupMessages['Friends'] ?? '');
    _workMsgController = TextEditingController(text: status?.groupMessages['Work'] ?? '');
    _unknownMsgController = TextEditingController(text: status?.groupMessages['Unknown'] ?? '');
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emojiController.dispose();
    _familyMsgController.dispose();
    _friendsMsgController.dispose();
    _workMsgController.dispose();
    _unknownMsgController.dispose();
    super.dispose();
  }

  void _saveStatus() {
    if (_formKey.currentState!.validate()) {
      final id = widget.statusToEdit?.id ?? DateTime.now().millisecondsSinceEpoch.toString();

      final newStatus = StatusModel(
        id: id,
        name: _nameController.text.trim(),
        emoji: _emojiController.text.trim(),
        groupMessages: {
          'Family': _familyMsgController.text.trim(),
          'Friends': _friendsMsgController.text.trim(),
          'Work': _workMsgController.text.trim(),
          'Unknown': _unknownMsgController.text.trim(),
        },
      );

      context.read<AppProvider>().saveStatus(newStatus);
      Navigator.pop(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isEditing = widget.statusToEdit != null;

    return Scaffold(
      backgroundColor: AppTheme.bgBase,
      appBar: AppBar(
        backgroundColor: AppTheme.bgBase,
        elevation: 0,
        title: Text(
          isEditing ? 'Edit Status' : 'New Custom Status',
          style: GoogleFonts.outfit(fontWeight: FontWeight.bold, color: AppTheme.primaryLavender),
        ),
        actions: [
          IconButton(
            onPressed: _saveStatus,
            icon: const Icon(Icons.check, color: AppTheme.primaryLavender),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              GlassContainer(
                child: Row(
                  children: [
                    SizedBox(
                      width: 60,
                      child: TextFormField(
                        controller: _emojiController,
                        textAlign: TextAlign.center,
                        style: GoogleFonts.notoColorEmoji(fontSize: 24),
                        decoration: InputDecoration(
                          labelText: 'Emoji',
                          labelStyle: GoogleFonts.inter(color: AppTheme.primaryLavender),
                          border: const OutlineInputBorder(),
                        ),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: TextFormField(
                        controller: _nameController,
                        style: GoogleFonts.inter(color: Colors.white),
                        decoration: InputDecoration(
                          labelText: 'Status Name',
                          hintText: 'e.g. Focus Mode',
                          labelStyle: GoogleFonts.inter(color: AppTheme.primaryLavender),
                          border: const OutlineInputBorder(),
                        ),
                        validator: (val) => val == null || val.isEmpty ? 'Required' : null,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              Text(
                'Group-Tailored Messages',
                style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.onSurface),
              ),
              const SizedBox(height: 4),
              Text(
                'Specify distinct messages dispatched to different contact groups upon missed calls.',
                style: GoogleFonts.inter(fontSize: 13, color: AppTheme.onSurfaceVariant),
              ),
              const SizedBox(height: 16),

              _buildGroupMessageCard(
                controller: _familyMsgController,
                groupName: 'Family',
                accentColor: AppTheme.groupFamily,
                emojiIcon: '🏠',
                hint: 'e.g. Having dinner with family, will call back later!',
              ),
              const SizedBox(height: 12),
              _buildGroupMessageCard(
                controller: _friendsMsgController,
                groupName: 'Friends',
                accentColor: AppTheme.groupFriends,
                emojiIcon: '🤝',
                hint: 'e.g. Out right now! Text me if urgent.',
              ),
              const SizedBox(height: 12),
              _buildGroupMessageCard(
                controller: _workMsgController,
                groupName: 'Work',
                accentColor: AppTheme.groupWork,
                emojiIcon: '💼',
                hint: 'e.g. In a meeting. Will check emails shortly.',
              ),
              const SizedBox(height: 12),
              _buildGroupMessageCard(
                controller: _unknownMsgController,
                groupName: 'Unknown Callers',
                accentColor: AppTheme.groupUnknown,
                emojiIcon: '❓',
                hint: 'e.g. Unavailable right now. Auto-reply via NowNot.',
              ),

              const SizedBox(height: 30),
              ElevatedButton(
                onPressed: _saveStatus,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primaryContainer,
                  foregroundColor: Colors.white,
                  minimumSize: const Size.fromHeight(50),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: Text(
                  isEditing ? 'Update Status' : 'Save Status',
                  style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildGroupMessageCard({
    required TextEditingController controller,
    required String groupName,
    required Color accentColor,
    required String emojiIcon,
    required String hint,
  }) {
    return GlassContainer(
      leftAccentColor: accentColor,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text(
                emojiIcon,
                style: GoogleFonts.notoColorEmoji(fontSize: 16),
              ),
              const SizedBox(width: 6),
              Text(
                groupName,
                style: GoogleFonts.inter(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: accentColor,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          TextFormField(
            controller: controller,
            maxLines: 2,
            style: GoogleFonts.inter(fontSize: 13, color: Colors.white),
            decoration: InputDecoration(
              hintText: hint,
              hintStyle: GoogleFonts.inter(fontSize: 12, color: Colors.white30),
              border: OutlineInputBorder(
                borderSide: BorderSide(color: accentColor.withOpacity(0.30)),
              ),
              enabledBorder: const OutlineInputBorder(
                borderSide: BorderSide(color: AppTheme.glassBorder),
              ),
              focusedBorder: OutlineInputBorder(
                borderSide: BorderSide(color: accentColor),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
