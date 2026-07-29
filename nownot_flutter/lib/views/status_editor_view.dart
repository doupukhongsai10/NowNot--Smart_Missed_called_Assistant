import 'package:flutter/material.dart';
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
      appBar: AppBar(
        title: Text(isEditing ? 'Edit Status' : 'New Custom Status'),
        actions: [
          IconButton(
            onPressed: _saveStatus,
            icon: const Icon(Icons.check, color: AppTheme.successGreen),
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
                child: Column(
                  children: [
                    Row(
                      children: [
                        SizedBox(
                          width: 60,
                          child: TextFormField(
                            controller: _emojiController,
                            textAlign: TextAlign.center,
                            style: const TextStyle(fontSize: 24),
                            decoration: const InputDecoration(
                              labelText: 'Emoji',
                              border: OutlineInputBorder(),
                            ),
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: TextFormField(
                            controller: _nameController,
                            style: const TextStyle(color: Colors.white),
                            decoration: const InputDecoration(
                              labelText: 'Status Name',
                              hintText: 'e.g. Focus Mode',
                              border: OutlineInputBorder(),
                            ),
                            validator: (val) => val == null || val.isEmpty ? 'Required' : null,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              Text(
                'Group-Tailored Auto-Reply Messages',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(fontSize: 18),
              ),
              const SizedBox(height: 8),
              Text(
                'Different contact groups will receive distinct messages when they call during this status.',
                style: Theme.of(context).textTheme.bodyMedium,
              ),
              const SizedBox(height: 16),

              _buildMessageField(
                controller: _familyMsgController,
                label: 'Family Message 🏠',
                hint: 'e.g. At dinner with family, will call back later!',
              ),
              const SizedBox(height: 12),
              _buildMessageField(
                controller: _friendsMsgController,
                label: 'Friends Message 🤝',
                hint: 'e.g. Out right now! Text me if urgent.',
              ),
              const SizedBox(height: 12),
              _buildMessageField(
                controller: _workMsgController,
                label: 'Work Message 💼',
                hint: 'e.g. In a meeting. Will check emails shortly.',
              ),
              const SizedBox(height: 12),
              _buildMessageField(
                controller: _unknownMsgController,
                label: 'Unknown Callers Message ❓',
                hint: 'e.g. Unavailable right now. Auto-reply via NowNot.',
              ),

              const SizedBox(height: 30),
              ElevatedButton(
                onPressed: _saveStatus,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primaryAccent,
                  minimumSize: const Size.fromHeight(50),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: Text(isEditing ? 'Update Status' : 'Save Status', style: const TextStyle(fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMessageField({
    required TextEditingController controller,
    required String label,
    required String hint,
  }) {
    return GlassContainer(
      padding: const EdgeInsets.all(12),
      child: TextFormField(
        controller: controller,
        maxLines: 2,
        style: const TextStyle(fontSize: 14, color: Colors.white),
        decoration: InputDecoration(
          labelText: label,
          hintText: hint,
          alignLabelWithHint: true,
          border: const OutlineInputBorder(),
        ),
      ),
    );
  }
}
