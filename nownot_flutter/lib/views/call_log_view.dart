import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../providers/app_provider.dart';
import '../theme/app_theme.dart';
import '../widgets/glass_container.dart';
import '../models/call_log_model.dart';

// ── Color Constants ──────────────────────────────────────────────────────────

const Color kEmerald = Color(0xFF10B981);
const Color kEmeraldAccent = Color(0xFF34D399);
const Color kEmeraldDark = Color(0xFF059669);

// ── Color Helper Config ───────────────────────────────────────────────────────

Color getGroupColor(String groupTag) {
  final tag = groupTag.toLowerCase();
  if (tag.contains('family')) return AppTheme.groupFamily;
  if (tag.contains('friend')) return AppTheme.groupFriends;
  if (tag.contains('work')) return AppTheme.groupWork;
  return AppTheme.groupUnknown;
}

Color getGroupBg(String groupTag) {
  return getGroupColor(groupTag).withOpacity(0.15);
}

Color getGroupBorder(String groupTag) {
  return getGroupColor(groupTag).withOpacity(0.50);
}

const List<String> kFilterTabs = [
  'All',
  'Family',
  'Friends & Relatives',
  'Work',
  'Unknown',
];

const List<String> kContactGroupsList = [
  'Family',
  'Friends & Relatives',
  'Work',
  'Unknown',
];

// ── Sample Logs Fallback ──────────────────────────────────────────────────────

final List<CallLogModel> kSampleLogs = [
  CallLogModel(
    id: 's1',
    phoneNumber: '+1 (555) 234-5678',
    contactName: 'Mom',
    groupTag: 'Family',
    messageSent:
        "Hey Mom, I'm currently catching up on some sleep. I'll call you back as soon as I'm awake! ✨",
    timestampMs:
        DateTime.now().subtract(const Duration(hours: 2, minutes: 22)).millisecondsSinceEpoch,
    autoReplied: true,
  ),
  CallLogModel(
    id: 's2',
    phoneNumber: '+1 (555) 876-5432',
    contactName: 'Julian (Project Lead)',
    groupTag: 'Work',
    messageSent:
        "Currently in a focused meeting. For anything urgent, please ping Sarah. Otherwise, I'll be back at 12:30.",
    timestampMs:
        DateTime.now().subtract(const Duration(hours: 3, minutes: 55)).millisecondsSinceEpoch,
    autoReplied: true,
  ),
  CallLogModel(
    id: 's3',
    phoneNumber: '+1 (555) 012-3456',
    contactName: '+1(555) 012-3456',
    groupTag: 'Unknown',
    messageSent:
        "I'm at the cinema right now! 🍿 Will get back to you after the credits roll.",
    timestampMs:
        DateTime.now().subtract(const Duration(days: 1, hours: 2, minutes: 15)).millisecondsSinceEpoch,
    autoReplied: true,
  ),
  CallLogModel(
    id: 's4',
    phoneNumber: '+1 (555) 345-6789',
    contactName: 'Alex Chen',
    groupTag: 'Friends & Relatives',
    messageSent:
        "Out on the trails! 🌿 Can't talk right now but I'll hit you up when I'm done with this loop.",
    timestampMs:
        DateTime.now().subtract(const Duration(days: 1, hours: 3, minutes: 20)).millisecondsSinceEpoch,
    autoReplied: true,
  ),
];

// ── Main CallLogView Screen ────────────────────────────────────────────────────

class CallLogView extends StatefulWidget {
  const CallLogView({super.key});

  @override
  State<CallLogView> createState() => _CallLogViewState();
}

class _CallLogViewState extends State<CallLogView> {
  String _selectedFilter = 'All';
  String _searchQuery = '';
  final Set<String> _expandedLogIds = {};

  void _toggleExpand(String id) {
    setState(() {
      if (_expandedLogIds.contains(id)) {
        _expandedLogIds.remove(id);
      } else {
        _expandedLogIds.add(id);
      }
    });
  }

  void _openKeypadModal(BuildContext context, {String initialDigits = ''}) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => _KeypadModalSheet(initialDigits: initialDigits),
    );
  }

  void _openContactsModal(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => _SavedContactsModalSheet(
        onSelectContactToCall: (phoneNumber) {
          Navigator.pop(ctx);
          _openKeypadModal(context, initialDigits: phoneNumber);
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<AppProvider>();
    final rawLogs = provider.callLogs.isNotEmpty ? provider.callLogs : kSampleLogs;

    // Filter logs by group and search query
    final filteredLogs = rawLogs.where((log) {
      // Group filter
      if (_selectedFilter != 'All') {
        final matchesGroup = _selectedFilter.toLowerCase() == 'friends & relatives'
            ? (log.groupTag.toLowerCase().contains('friend') || log.groupTag.toLowerCase().contains('relative'))
            : log.groupTag.toLowerCase() == _selectedFilter.toLowerCase();
        if (!matchesGroup) return false;
      }

      // Search filter
      if (_searchQuery.trim().isNotEmpty) {
        final q = _searchQuery.trim().toLowerCase();
        final nameMatch = log.contactName.toLowerCase().contains(q);
        final phoneMatch = log.phoneNumber.toLowerCase().contains(q);
        final msgMatch = log.messageSent.toLowerCase().contains(q);
        return nameMatch || phoneMatch || msgMatch;
      }

      return true;
    }).toList();

    // Matching Saved Contacts from Provider
    final savedContactNames = provider.contactNames;
    final savedContactGroups = provider.contactGroups;
    final matchingSavedContacts = <Map<String, String>>[];

    if (_searchQuery.trim().isNotEmpty) {
      final q = _searchQuery.trim().toLowerCase();
      savedContactNames.forEach((phone, name) {
        if (name.toLowerCase().contains(q) || phone.toLowerCase().contains(q)) {
          matchingSavedContacts.add({
            'name': name,
            'phone': phone,
            'group': savedContactGroups[phone] ?? 'Unknown',
          });
        }
      });
    }

    return Scaffold(
      backgroundColor: AppTheme.bgBase,
      body: Stack(
        children: [
          // ── Scrollable Body ──
          SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.only(left: 16, right: 16, top: 16, bottom: 90),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // ── Header & Subtitle ──
                  Text(
                    'Call Log',
                    style: GoogleFonts.outfit(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.textPrimary,
                      letterSpacing: -0.5,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Track missed calls and automated replies sent while your status was active.',
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      color: AppTheme.onSurfaceVariant.withOpacity(0.60),
                      height: 1.4,
                    ),
                  ),

                  const SizedBox(height: 16),

                  // ── Controls Row (Search Input + Contacts Button) ──
                  Row(
                    children: [
                      Expanded(
                        child: Container(
                          height: 40,
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.05),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: Colors.white.withOpacity(0.10)),
                          ),
                          padding: const EdgeInsets.symmetric(horizontal: 12),
                          child: Row(
                            children: [
                              Icon(
                                Icons.search,
                                size: 18,
                                color: AppTheme.onSurfaceVariant.withOpacity(0.60),
                              ),
                              const SizedBox(width: 8),
                              Expanded(
                                child: TextField(
                                  onChanged: (val) => setState(() => _searchQuery = val),
                                  style: GoogleFonts.inter(fontSize: 13, color: AppTheme.onSurface),
                                  decoration: InputDecoration(
                                    hintText: 'Search call log or saved contacts...',
                                    hintStyle: GoogleFonts.inter(
                                      fontSize: 12,
                                      color: AppTheme.onSurfaceVariant.withOpacity(0.50),
                                    ),
                                    border: InputBorder.none,
                                    isDense: true,
                                    contentPadding: EdgeInsets.zero,
                                  ),
                                ),
                              ),
                              if (_searchQuery.isNotEmpty)
                                GestureDetector(
                                  onTap: () => setState(() => _searchQuery = ''),
                                  child: Icon(
                                    Icons.close,
                                    size: 16,
                                    color: AppTheme.onSurfaceVariant.withOpacity(0.70),
                                  ),
                                ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      InkWell(
                        onTap: () => _openContactsModal(context),
                        borderRadius: BorderRadius.circular(12),
                        child: Container(
                          height: 40,
                          padding: const EdgeInsets.symmetric(horizontal: 12),
                          decoration: BoxDecoration(
                            color: AppTheme.primaryContainer.withOpacity(0.18),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: AppTheme.primaryContainer.withOpacity(0.40)),
                          ),
                          child: Row(
                            children: [
                              const Icon(
                                Icons.contacts_rounded,
                                size: 18,
                                color: AppTheme.primaryLavender,
                              ),
                              const SizedBox(width: 6),
                              Text(
                                'Contacts',
                                style: GoogleFonts.inter(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600,
                                  color: AppTheme.primaryLavender,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 16),

                  // ── Stats Bar ──
                  _buildStatsBar(rawLogs),

                  const SizedBox(height: 16),

                  // ── Filter Tabs ──
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    physics: const BouncingScrollPhysics(),
                    child: Row(
                      children: kFilterTabs.map((tab) {
                        final isSel = _selectedFilter == tab;
                        final color = tab == 'All' ? AppTheme.primaryLavender : getGroupColor(tab);

                        return Padding(
                          padding: const EdgeInsets.only(right: 8),
                          child: InkWell(
                            onTap: () => setState(() => _selectedFilter = tab),
                            borderRadius: BorderRadius.circular(20),
                            child: AnimatedContainer(
                              duration: const Duration(milliseconds: 200),
                              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                              decoration: BoxDecoration(
                                color: isSel ? color.withOpacity(0.20) : Colors.white.withOpacity(0.05),
                                borderRadius: BorderRadius.circular(20),
                                border: Border.all(
                                  color: isSel ? color.withOpacity(0.60) : Colors.white.withOpacity(0.08),
                                ),
                              ),
                              child: Text(
                                tab,
                                style: GoogleFonts.inter(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600,
                                  color: isSel ? color : AppTheme.onSurfaceVariant.withOpacity(0.60),
                                ),
                              ),
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                  ),

                  const SizedBox(height: 20),

                  // ── Matching Saved Contacts Section (When searching) ──
                  if (_searchQuery.isNotEmpty && matchingSavedContacts.isNotEmpty) ...[
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: AppTheme.primaryContainer.withOpacity(0.12),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppTheme.primaryContainer.withOpacity(0.25)),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              const Icon(Icons.contacts, size: 16, color: AppTheme.primaryLavender),
                              const SizedBox(width: 6),
                              Text(
                                'MATCHING SAVED CONTACTS (${matchingSavedContacts.length})',
                                style: GoogleFonts.inter(
                                  fontSize: 11,
                                  fontWeight: FontWeight.bold,
                                  color: AppTheme.primaryLavender,
                                  letterSpacing: 0.5,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 10),
                          ListView.separated(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            itemCount: matchingSavedContacts.length,
                            separatorBuilder: (_, __) => const SizedBox(height: 8),
                            itemBuilder: (ctx, idx) {
                              final item = matchingSavedContacts[idx];
                              final grpColor = getGroupColor(item['group']!);
                              final initials = item['name']!.length >= 2
                                  ? item['name']!.substring(0, 2).toUpperCase()
                                  : item['name']!.toUpperCase();

                              return Container(
                                padding: const EdgeInsets.all(10),
                                decoration: BoxDecoration(
                                  color: Colors.white.withOpacity(0.04),
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(color: Colors.white.withOpacity(0.08)),
                                ),
                                child: Row(
                                  children: [
                                    Container(
                                      width: 34,
                                      height: 34,
                                      decoration: BoxDecoration(
                                        color: grpColor.withOpacity(0.20),
                                        shape: BoxShape.circle,
                                        border: Border.all(color: grpColor.withOpacity(0.50)),
                                      ),
                                      alignment: Alignment.center,
                                      child: Text(
                                        initials,
                                        style: GoogleFonts.inter(
                                          fontSize: 12,
                                          fontWeight: FontWeight.bold,
                                          color: grpColor,
                                        ),
                                      ),
                                    ),
                                    const SizedBox(width: 10),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            item['name']!,
                                            style: GoogleFonts.outfit(
                                              fontSize: 13,
                                              fontWeight: FontWeight.bold,
                                              color: AppTheme.onSurface,
                                            ),
                                          ),
                                          Text(
                                            item['phone']!,
                                            style: GoogleFonts.jetBrainsMono(
                                              fontSize: 11,
                                              color: AppTheme.onSurfaceVariant.withOpacity(0.60),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    InkWell(
                                      onTap: () => _openKeypadModal(context, initialDigits: item['phone']!),
                                      borderRadius: BorderRadius.circular(8),
                                      child: Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                        decoration: BoxDecoration(
                                          color: kEmerald.withOpacity(0.20),
                                          borderRadius: BorderRadius.circular(8),
                                          border: Border.all(color: kEmerald.withOpacity(0.40)),
                                        ),
                                        child: Row(
                                          children: [
                                            const Icon(Icons.call, size: 14, color: kEmeraldAccent),
                                            const SizedBox(width: 4),
                                            Text(
                                              'Call',
                                              style: GoogleFonts.inter(
                                                fontSize: 11,
                                                fontWeight: FontWeight.bold,
                                                color: kEmeraldAccent,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              );
                            },
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),
                  ],

                  // ── Call Log Cards List ──
                  if (filteredLogs.isEmpty)
                    _buildEmptyState()
                  else
                    ListView.separated(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: filteredLogs.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 12),
                      itemBuilder: (context, index) {
                        final log = filteredLogs[index];
                        final isExpanded = _expandedLogIds.contains(log.id);

                        return _buildLogCard(log, isExpanded);
                      },
                    ),

                  const SizedBox(height: 20),

                  // ── Footer Note Banner ──
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppTheme.statusActive.withOpacity(0.08),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppTheme.statusActive.withOpacity(0.18)),
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Icon(
                          Icons.info_outline_rounded,
                          size: 16,
                          color: AppTheme.statusActive,
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            'The log is read-only. Each entry is a permanent record of the call and the reply sent. Tap any entry to expand details.',
                            style: GoogleFonts.inter(
                              fontSize: 11,
                              color: AppTheme.onSurfaceVariant.withOpacity(0.60),
                              height: 1.4,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),

          // ── Fixed Floating Keypad Button (FAB) ──
          Positioned(
            right: 16,
            bottom: 20,
            child: Material(
              color: Colors.transparent,
              child: InkWell(
                onTap: () => _openKeypadModal(context),
                borderRadius: BorderRadius.circular(30),
                child: Container(
                  width: 56,
                  height: 56,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: const LinearGradient(
                      colors: [Color(0xFF7C3AED), Color(0xFF4F46E5)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFF7C3AED).withOpacity(0.50),
                        blurRadius: 20,
                        offset: const Offset(0, 6),
                      ),
                    ],
                    border: Border.all(color: Colors.white.withOpacity(0.20)),
                  ),
                  child: const Icon(
                    Icons.dialpad_rounded,
                    color: Colors.white,
                    size: 26,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ── Stats Bar Widget ───────────────────────────────────────────────────────

  Widget _buildStatsBar(List<CallLogModel> logs) {
    final total = logs.length;
    final replied = logs.where((l) => l.autoReplied || l.messageSent.isNotEmpty).length;
    final groupsCount = logs.map((l) => l.groupTag).toSet().length;

    final items = [
      {'label': 'Missed', 'value': total.toString(), 'icon': Icons.call_missed, 'color': AppTheme.primaryLavender},
      {'label': 'Replied', 'value': replied.toString(), 'icon': Icons.sms_rounded, 'color': const Color(0xFF4ADE80)},
      {'label': 'Groups', 'value': groupsCount.toString(), 'icon': Icons.group_rounded, 'color': const Color(0xFFF59E0B)},
    ];

    return Row(
      children: items.map((item) {
        return Expanded(
          child: Container(
            margin: const EdgeInsets.symmetric(horizontal: 4),
            padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.04),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.white.withOpacity(0.07)),
            ),
            child: Column(
              children: [
                Icon(item['icon'] as IconData, size: 20, color: item['color'] as Color),
                const SizedBox(height: 6),
                Text(
                  item['value'] as String,
                  style: GoogleFonts.outfit(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.textPrimary,
                  ),
                ),
                Text(
                  item['label'] as String,
                  style: GoogleFonts.inter(
                    fontSize: 10,
                    fontWeight: FontWeight.w600,
                    color: AppTheme.onSurfaceVariant.withOpacity(0.50),
                    letterSpacing: 0.5,
                  ),
                ),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }

  // ── Log Card Widget ────────────────────────────────────────────────────────

  Widget _buildLogCard(CallLogModel log, bool isExpanded) {
    final groupColor = getGroupColor(log.groupTag);
    final groupBg = getGroupBg(log.groupTag);
    final groupBorder = getGroupBorder(log.groupTag);
    final timeStr = DateFormat('HH:mm').format(
      DateTime.fromMillisecondsSinceEpoch(log.timestampMs),
    );

    return GlassContainer(
      leftAccentColor: groupColor,
      onTap: () => _toggleExpand(log.id),
      padding: const EdgeInsets.all(14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Row 1: Name + Group Badge
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Row(
                  children: [
                    Flexible(
                      child: Text(
                        log.contactName.isNotEmpty ? log.contactName : log.phoneNumber,
                        style: GoogleFonts.outfit(
                          fontSize: 15,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.onSurface,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: groupBg,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: groupBorder),
                      ),
                      child: Text(
                        log.groupTag,
                        style: GoogleFonts.inter(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          color: groupColor,
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              // Status Pill
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.05),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: Colors.white.withOpacity(0.08)),
                ),
                child: Row(
                  children: [
                    const Text('😴', style: TextStyle(fontSize: 12)),
                    const SizedBox(width: 4),
                    Text(
                      'Sleeping',
                      style: GoogleFonts.inter(
                        fontSize: 10,
                        fontWeight: FontWeight.w600,
                        color: AppTheme.primaryLavender.withOpacity(0.80),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: 6),

          // Row 2: Timestamp
          Text(
            timeStr,
            style: GoogleFonts.jetBrainsMono(
              fontSize: 11,
              color: AppTheme.primaryLavender.withOpacity(0.50),
            ),
          ),

          const SizedBox(height: 10),

          // Row 3: Message preview bubble
          if (log.messageSent.isNotEmpty)
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.04),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.white.withOpacity(0.06)),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(
                    Icons.chat_bubble_outline_rounded,
                    size: 14,
                    color: AppTheme.primaryLavender.withOpacity(0.50),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      '"${log.messageSent}"',
                      maxLines: isExpanded ? 10 : 2,
                      overflow: TextOverflow.ellipsis,
                      style: GoogleFonts.inter(
                        fontSize: 12,
                        fontStyle: FontStyle.italic,
                        color: AppTheme.onSurface.withOpacity(0.80),
                        height: 1.4,
                      ),
                    ),
                  ),
                ],
              ),
            ),

          const SizedBox(height: 10),

          // Row 4: Auto reply status + expand icon
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Icon(
                    log.autoReplied ? Icons.check_circle : Icons.cancel,
                    size: 14,
                    color: log.autoReplied ? const Color(0xFF4ADE80) : const Color(0xFFF87171),
                  ),
                  const SizedBox(width: 4),
                  Text(
                    log.autoReplied ? 'AUTO-REPLY SENT' : 'NO REPLY SENT',
                    style: GoogleFonts.inter(
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      color: log.autoReplied ? const Color(0xFF4ADE80) : const Color(0xFFF87171),
                      letterSpacing: 0.5,
                    ),
                  ),
                ],
              ),
              Icon(
                isExpanded ? Icons.keyboard_arrow_up : Icons.keyboard_arrow_down,
                size: 20,
                color: AppTheme.primaryLavender.withOpacity(0.40),
              ),
            ],
          ),

          // Expanded detail section
          if (isExpanded) ...[
            const SizedBox(height: 10),
            Divider(color: Colors.white.withOpacity(0.08), height: 1),
            const SizedBox(height: 10),
            Row(
              children: [
                Icon(Icons.call, size: 14, color: AppTheme.primaryLavender.withOpacity(0.60)),
                const SizedBox(width: 6),
                Text(
                  log.phoneNumber,
                  style: GoogleFonts.jetBrainsMono(
                    fontSize: 11,
                    color: AppTheme.primaryLavender.withOpacity(0.70),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 4),
            Row(
              children: [
                Icon(Icons.schedule, size: 14, color: AppTheme.primaryLavender.withOpacity(0.60)),
                const SizedBox(width: 6),
                Text(
                  'Status active at time of call: 😴 Sleeping',
                  style: GoogleFonts.inter(
                    fontSize: 11,
                    color: AppTheme.primaryLavender.withOpacity(0.70),
                  ),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }

  // ── Empty State Widget ────────────────────────────────────────────────────

  Widget _buildEmptyState() {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 40),
      child: Center(
        child: Column(
          children: [
            const Text('📭', style: TextStyle(fontSize: 48)),
            const SizedBox(height: 12),
            Text(
              _searchQuery.isNotEmpty ? 'No results for "$_searchQuery"' : 'No calls logged',
              style: GoogleFonts.outfit(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: AppTheme.primaryLavender.withOpacity(0.70),
              ),
            ),
            const SizedBox(height: 6),
            Text(
              _searchQuery.isNotEmpty
                  ? 'Check spelling or search for a different contact name or number.'
                  : 'Missed calls during an active status will appear here.',
              textAlign: TextAlign.center,
              style: GoogleFonts.inter(
                fontSize: 12,
                color: AppTheme.onSurfaceVariant.withOpacity(0.50),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ── Saved Contacts Modal Sheet ─────────────────────────────────────────────────

class _SavedContactsModalSheet extends StatefulWidget {
  final Function(String phoneNumber) onSelectContactToCall;

  const _SavedContactsModalSheet({required this.onSelectContactToCall});

  @override
  State<_SavedContactsModalSheet> createState() => _SavedContactsModalSheetState();
}

class _SavedContactsModalSheetState extends State<_SavedContactsModalSheet> {
  String _search = '';

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<AppProvider>();
    final names = provider.contactNames;
    final groups = provider.contactGroups;

    // Convert map to sorted contact list
    final contactList = <Map<String, String>>[];
    names.forEach((phone, name) {
      contactList.add({
        'phone': phone,
        'name': name,
        'group': groups[phone] ?? 'Unknown',
      });
    });

    // Add fallback contacts if list is empty for rich UI
    if (contactList.isEmpty) {
      contactList.addAll([
        {'name': 'Alex Chen', 'phone': '+1 (555) 345-6789', 'group': 'Friends & Relatives'},
        {'name': 'Julian (Project Lead)', 'phone': '+1 (555) 876-5432', 'group': 'Work'},
        {'name': 'Mom', 'phone': '+1 (555) 234-5678', 'group': 'Family'},
        {'name': 'Sarah Jenkins', 'phone': '+1 (555) 901-2345', 'group': 'Family'},
      ]);
    }

    // Sort ascending A-Z
    contactList.sort((a, b) => a['name']!.compareTo(b['name']!));

    final filtered = contactList.where((c) {
      if (_search.trim().isEmpty) return true;
      final q = _search.trim().toLowerCase();
      return c['name']!.toLowerCase().contains(q) || c['phone']!.toLowerCase().contains(q);
    }).toList();

    return Padding(
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
      ),
      child: Container(
        height: MediaQuery.of(context).size.height * 0.75,
        decoration: BoxDecoration(
          color: const Color(0xFF161A35),
          borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
          border: Border.all(color: Colors.white.withOpacity(0.15)),
        ),
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            // Sheet handle
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.20),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    const Icon(Icons.contacts_rounded, color: AppTheme.primaryLavender, size: 22),
                    const SizedBox(width: 8),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Saved Contacts',
                          style: GoogleFonts.outfit(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.primaryLavender,
                          ),
                        ),
                        Text(
                          'Displaying contacts in ascending order (A-Z)',
                          style: GoogleFonts.inter(
                            fontSize: 11,
                            color: AppTheme.onSurfaceVariant.withOpacity(0.50),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
                IconButton(
                  onPressed: () => Navigator.pop(context),
                  icon: const Icon(Icons.close, color: AppTheme.onSurfaceVariant),
                ),
              ],
            ),

            const SizedBox(height: 14),

            // Search Bar inside Modal
            Container(
              height: 40,
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.05),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.white.withOpacity(0.10)),
              ),
              padding: const EdgeInsets.symmetric(horizontal: 12),
              child: Row(
                children: [
                  Icon(Icons.search, size: 18, color: AppTheme.onSurfaceVariant.withOpacity(0.60)),
                  const SizedBox(width: 8),
                  Expanded(
                    child: TextField(
                      onChanged: (v) => setState(() => _search = v),
                      style: GoogleFonts.inter(fontSize: 13, color: AppTheme.onSurface),
                      decoration: InputDecoration(
                        hintText: 'Search saved contacts...',
                        hintStyle: GoogleFonts.inter(
                          fontSize: 12,
                          color: AppTheme.onSurfaceVariant.withOpacity(0.50),
                        ),
                        border: InputBorder.none,
                        isDense: true,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Contact List
            Expanded(
              child: filtered.isEmpty
                  ? Center(
                      child: Text(
                        'No contacts found.',
                        style: GoogleFonts.inter(color: AppTheme.onSurfaceVariant),
                      ),
                    )
                  : ListView.separated(
                      itemCount: filtered.length,
                      separatorBuilder: (_, __) => Divider(color: Colors.white.withOpacity(0.06)),
                      itemBuilder: (ctx, idx) {
                        final c = filtered[idx];
                        final grpColor = getGroupColor(c['group']!);
                        final initials = c['name']!.length >= 2
                            ? c['name']!.substring(0, 2).toUpperCase()
                            : c['name']!.toUpperCase();

                        return Padding(
                          padding: const EdgeInsets.symmetric(vertical: 4),
                          child: Row(
                            children: [
                              Container(
                                width: 40,
                                height: 40,
                                decoration: BoxDecoration(
                                  color: grpColor.withOpacity(0.15),
                                  shape: BoxShape.circle,
                                  border: Border.all(color: grpColor.withOpacity(0.50)),
                                ),
                                alignment: Alignment.center,
                                child: Text(
                                  initials,
                                  style: GoogleFonts.inter(
                                    fontSize: 13,
                                    fontWeight: FontWeight.bold,
                                    color: grpColor,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      c['name']!,
                                      style: GoogleFonts.outfit(
                                        fontSize: 14,
                                        fontWeight: FontWeight.bold,
                                        color: AppTheme.onSurface,
                                      ),
                                    ),
                                    Text(
                                      c['phone']!,
                                      style: GoogleFonts.jetBrainsMono(
                                        fontSize: 12,
                                        color: AppTheme.onSurfaceVariant.withOpacity(0.60),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                decoration: BoxDecoration(
                                  color: grpColor.withOpacity(0.15),
                                  borderRadius: BorderRadius.circular(10),
                                  border: Border.all(color: grpColor.withOpacity(0.40)),
                                ),
                                child: Text(
                                  c['group']!,
                                  style: GoogleFonts.inter(
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                    color: grpColor,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 8),
                              IconButton(
                                onPressed: () => widget.onSelectContactToCall(c['phone']!),
                                icon: const Icon(Icons.call, color: kEmeraldAccent, size: 20),
                                style: IconButton.styleFrom(
                                  backgroundColor: kEmerald.withOpacity(0.20),
                                  side: BorderSide(color: kEmerald.withOpacity(0.40)),
                                ),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }
}

// ── Interactive Keypad Modal Bottom Sheet ─────────────────────────────────────

class _KeypadModalSheet extends StatefulWidget {
  final String initialDigits;

  const _KeypadModalSheet({this.initialDigits = ''});

  @override
  State<_KeypadModalSheet> createState() => _KeypadModalSheetState();
}

class _KeypadModalSheetState extends State<_KeypadModalSheet> {
  late String _digits;
  bool _showSaveForm = false;
  String _contactName = '';
  String _selectedGroup = 'Family';

  bool _isCalling = false;
  int _callTimer = 0;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _digits = widget.initialDigits;
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _onDigitPressed(String digit) {
    if (_digits.length < 15) {
      setState(() {
        _digits += digit;
      });
    }
  }

  void _onBackspace() {
    if (_digits.isNotEmpty) {
      setState(() {
        _digits = _digits.substring(0, _digits.length - 1);
      });
    }
  }

  void _startCall() {
    if (_digits.isEmpty) return;
    setState(() {
      _isCalling = true;
      _callTimer = 0;
    });
    _timer = Timer.periodic(const Duration(seconds: 1), (_) {
      setState(() => _callTimer++);
    });
  }

  void _endCall() {
    _timer?.cancel();
    setState(() => _isCalling = false);
    Navigator.pop(context);
  }

  void _handleSaveContact() {
    if (_contactName.trim().isEmpty || _digits.trim().isEmpty) return;

    final provider = context.read<AppProvider>();
    provider.saveContact(
      phoneNumber: _digits.trim(),
      name: _contactName.trim(),
      groupTag: _selectedGroup,
    );

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Saved ${_contactName.trim()} to $_selectedGroup!'),
        backgroundColor: kEmerald,
        duration: const Duration(seconds: 2),
      ),
    );

    setState(() {
      _showSaveForm = false;
      _contactName = '';
    });
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
      ),
      child: Container(
        decoration: BoxDecoration(
          color: const Color(0xFF161A35),
          borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
          border: Border.all(color: Colors.white.withOpacity(0.15)),
        ),
        padding: const EdgeInsets.all(20),
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Sheet Handle Bar
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.20),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),

              const SizedBox(height: 12),

              // ── Header Row ──
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.dialpad_rounded, color: AppTheme.primaryLavender, size: 22),
                      const SizedBox(width: 8),
                      Text(
                        'Phone Keypad',
                        style: GoogleFonts.outfit(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.primaryLavender,
                        ),
                      ),
                    ],
                  ),
                  Row(
                    children: [
                      // Dynamic "+ Save Contact" Button
                      if (_digits.isNotEmpty && !_isCalling && !_showSaveForm)
                        InkWell(
                          onTap: () => setState(() => _showSaveForm = true),
                          borderRadius: BorderRadius.circular(12),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                            decoration: BoxDecoration(
                              color: AppTheme.primaryContainer.withOpacity(0.20),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: AppTheme.primaryContainer.withOpacity(0.50)),
                            ),
                            child: Row(
                              children: [
                                const Icon(Icons.person_add_rounded, size: 16, color: AppTheme.primaryLavender),
                                const SizedBox(width: 4),
                                Text(
                                  'Save Contact',
                                  style: GoogleFonts.inter(
                                    fontSize: 12,
                                    fontWeight: FontWeight.bold,
                                    color: AppTheme.primaryLavender,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      const SizedBox(width: 8),
                      IconButton(
                        onPressed: () => Navigator.pop(context),
                        icon: const Icon(Icons.close, color: AppTheme.onSurfaceVariant),
                      ),
                    ],
                  ),
                ],
              ),

              const SizedBox(height: 12),

              // ── CALLING VIEW ──
              if (_isCalling) ...[
                const SizedBox(height: 20),
                Stack(
                  alignment: Alignment.center,
                  children: [
                    Container(
                      width: 90,
                      height: 90,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: kEmerald.withOpacity(0.20),
                      ),
                    ),
                    Container(
                      width: 70,
                      height: 70,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: kEmerald.withOpacity(0.40),
                        border: Border.all(color: kEmeraldAccent.withOpacity(0.60)),
                      ),
                      child: const Icon(Icons.call, color: kEmeraldAccent, size: 36),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Text(
                  'CALLING...',
                  style: GoogleFonts.inter(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: kEmeraldAccent,
                    letterSpacing: 2,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  _digits,
                  style: GoogleFonts.jetBrainsMono(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.onSurface,
                  ),
                ),
                Text(
                  'Duration: ${_formatDuration(_callTimer)}',
                  style: GoogleFonts.jetBrainsMono(
                    fontSize: 12,
                    color: AppTheme.onSurfaceVariant.withOpacity(0.60),
                  ),
                ),
                const SizedBox(height: 24),
                IconButton(
                  onPressed: _endCall,
                  icon: const Icon(Icons.call_end, color: Colors.white, size: 32),
                  style: IconButton.styleFrom(
                    backgroundColor: Colors.redAccent,
                    fixedSize: const Size(60, 60),
                  ),
                ),
                const SizedBox(height: 20),

              // ── SAVE CONTACT FORM OVERLAY VIEW ──
              ] else if (_showSaveForm) ...[
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.04),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: Colors.white.withOpacity(0.12)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              const Icon(Icons.person_add_rounded, size: 18, color: AppTheme.primaryLavender),
                              const SizedBox(width: 6),
                              Text(
                                'Save Contact',
                                style: GoogleFonts.outfit(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                  color: AppTheme.primaryLavender,
                                ),
                              ),
                            ],
                          ),
                          GestureDetector(
                            onTap: () => setState(() => _showSaveForm = false),
                            child: Text(
                              'Cancel',
                              style: GoogleFonts.inter(
                                fontSize: 12,
                                color: AppTheme.onSurfaceVariant.withOpacity(0.60),
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 14),

                      // Phone Number Box
                      Text(
                        'PHONE NUMBER',
                        style: GoogleFonts.inter(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.onSurfaceVariant.withOpacity(0.60),
                        ),
                      ),
                      const SizedBox(height: 4),
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                        decoration: BoxDecoration(
                          color: AppTheme.bgBase,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: Colors.white.withOpacity(0.10)),
                        ),
                        child: Text(
                          _digits,
                          style: GoogleFonts.jetBrainsMono(
                            fontSize: 15,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.onSurface,
                          ),
                        ),
                      ),
                      const SizedBox(height: 12),

                      // Contact Name Input
                      Text(
                        'CONTACT NAME',
                        style: GoogleFonts.inter(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.onSurfaceVariant.withOpacity(0.60),
                        ),
                      ),
                      const SizedBox(height: 4),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12),
                        decoration: BoxDecoration(
                          color: AppTheme.bgBase,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: Colors.white.withOpacity(0.10)),
                        ),
                        child: TextField(
                          onChanged: (val) => setState(() => _contactName = val),
                          style: GoogleFonts.inter(fontSize: 13, color: AppTheme.onSurface),
                          decoration: InputDecoration(
                            hintText: 'Enter contact name (e.g. John Doe)',
                            hintStyle: GoogleFonts.inter(
                              fontSize: 12,
                              color: AppTheme.onSurfaceVariant.withOpacity(0.40),
                            ),
                            border: InputBorder.none,
                          ),
                        ),
                      ),
                      const SizedBox(height: 12),

                      // Group Choice
                      Text(
                        'ASSIGN CONTACT GROUP',
                        style: GoogleFonts.inter(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.onSurfaceVariant.withOpacity(0.60),
                        ),
                      ),
                      const SizedBox(height: 8),
                      GridView.count(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        crossAxisCount: 2,
                        childAspectRatio: 3.2,
                        crossAxisSpacing: 8,
                        mainAxisSpacing: 8,
                        children: kContactGroupsList.map((grp) {
                          final isSelected = _selectedGroup == grp;
                          final color = getGroupColor(grp);

                          return InkWell(
                            onTap: () => setState(() => _selectedGroup = grp),
                            borderRadius: BorderRadius.circular(12),
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10),
                              decoration: BoxDecoration(
                                color: isSelected ? color.withOpacity(0.18) : Colors.white.withOpacity(0.04),
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(
                                  color: isSelected ? color.withOpacity(0.60) : Colors.white.withOpacity(0.08),
                                ),
                              ),
                              child: Row(
                                children: [
                                  Container(
                                    width: 8,
                                    height: 8,
                                    decoration: BoxDecoration(
                                      color: color,
                                      shape: BoxShape.circle,
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: Text(
                                      grp,
                                      style: GoogleFonts.inter(
                                        fontSize: 11,
                                        fontWeight: FontWeight.bold,
                                        color: isSelected ? color : AppTheme.onSurfaceVariant.withOpacity(0.70),
                                      ),
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          );
                        }).toList(),
                      ),

                      const SizedBox(height: 16),

                      // Save Button
                      SizedBox(
                        width: double.infinity,
                        height: 44,
                        child: ElevatedButton(
                          onPressed: _contactName.trim().isEmpty ? null : _handleSaveContact,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppTheme.primaryContainer,
                            disabledBackgroundColor: AppTheme.primaryContainer.withOpacity(0.30),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          child: Text(
                            'Save to Contacts',
                            style: GoogleFonts.inter(
                              fontSize: 13,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

              // ── KEYPAD DIALPAD VIEW ──
              ] else ...[
                // Display Screen Container
                Container(
                  height: 56,
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.05),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Colors.white.withOpacity(0.10)),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          _digits.isNotEmpty ? _digits : 'Enter phone number...',
                          style: _digits.isNotEmpty
                              ? GoogleFonts.jetBrainsMono(
                                  fontSize: 22,
                                  fontWeight: FontWeight.bold,
                                  color: AppTheme.onSurface,
                                  letterSpacing: 1.5,
                                )
                              : GoogleFonts.inter(
                                  fontSize: 14,
                                  color: AppTheme.onSurfaceVariant.withOpacity(0.40),
                                ),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      if (_digits.isNotEmpty)
                        IconButton(
                          onPressed: _onBackspace,
                          icon: Icon(
                            Icons.backspace_outlined,
                            color: AppTheme.onSurfaceVariant.withOpacity(0.70),
                            size: 20,
                          ),
                        ),
                    ],
                  ),
                ),

                const SizedBox(height: 16),

                // Keypad Buttons Grid (3 x 4)
                GridView.count(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  crossAxisCount: 3,
                  childAspectRatio: 1.6,
                  crossAxisSpacing: 10,
                  mainAxisSpacing: 10,
                  children: [
                    _keypadButton('1', ''),
                    _keypadButton('2', 'ABC'),
                    _keypadButton('3', 'DEF'),
                    _keypadButton('4', 'GHI'),
                    _keypadButton('5', 'JKL'),
                    _keypadButton('6', 'MNO'),
                    _keypadButton('7', 'PQRS'),
                    _keypadButton('8', 'TUV'),
                    _keypadButton('9', 'WXYZ'),
                    _keypadButton('*', ''),
                    _keypadButton('0', '+'),
                    _keypadButton('#', ''),
                  ],
                ),

                const SizedBox(height: 16),

                // Green Call Button
                Center(
                  child: InkWell(
                    onTap: _digits.isEmpty ? null : _startCall,
                    borderRadius: BorderRadius.circular(32),
                    child: AnimatedOpacity(
                      duration: const Duration(milliseconds: 200),
                      opacity: _digits.isEmpty ? 0.4 : 1.0,
                      child: Container(
                        width: 60,
                        height: 60,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: const LinearGradient(
                            colors: [Color(0xFF22C55E), Color(0xFF16A34A)],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: const Color(0xFF22C55E).withOpacity(0.40),
                              blurRadius: 20,
                              offset: const Offset(0, 6),
                            ),
                          ],
                        ),
                        child: const Icon(
                          Icons.call,
                          color: Colors.white,
                          size: 28,
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _keypadButton(String digit, String sub) {
    return InkWell(
      onTap: () => _onDigitPressed(digit),
      borderRadius: BorderRadius.circular(16),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.05),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.white.withOpacity(0.08)),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              digit,
              style: GoogleFonts.jetBrainsMono(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: AppTheme.onSurface,
                height: 1,
              ),
            ),
            if (sub.isNotEmpty)
              Text(
                sub,
                style: GoogleFonts.inter(
                  fontSize: 9,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.onSurfaceVariant.withOpacity(0.45),
                  letterSpacing: 1.5,
                ),
              ),
          ],
        ),
      ),
    );
  }

  String _formatDuration(int sec) {
    final m = (sec ~/ 60).toString().padLeft(2, '0');
    final s = (sec % 60).toString().padLeft(2, '0');
    return '$m:$s';
  }
}
