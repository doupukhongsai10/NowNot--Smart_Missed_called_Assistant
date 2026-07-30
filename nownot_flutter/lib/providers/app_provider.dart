import 'dart:async';
import 'package:flutter/foundation.dart';
import '../models/status_model.dart';
import '../models/active_status_model.dart';
import '../models/schedule_model.dart';
import '../models/call_log_model.dart';
import '../services/storage_service.dart';
import '../services/sms_service.dart';
import '../services/foreground_service.dart';

class AppProvider extends ChangeNotifier {
  final StorageService _storage;
  final SmsService _smsService = SmsService();

  List<StatusModel> _statuses = [];
  ActiveStatusModel? _activeStatus;
  List<ScheduleModel> _schedules = [];
  List<CallLogModel> _callLogs = [];
  Map<String, String> _contactGroups = {};

  Timer? _tickerTimer;

  AppProvider(this._storage) {
    _loadAllData();
    _startTicker();
  }

  List<StatusModel> get statuses => _statuses;
  ActiveStatusModel? get activeStatus => _activeStatus;
  List<ScheduleModel> get schedules => _schedules;
  List<CallLogModel> get callLogs => _callLogs;
  Map<String, String> get contactGroups => _contactGroups;

  void _loadAllData() {
    _statuses = _storage.getStatuses();
    _activeStatus = _storage.getActiveStatus();
    _schedules = _storage.getSchedules();
    _callLogs = _storage.getCallLogs();
    _contactGroups = _storage.getContactGroups();
    notifyListeners();
  }

  void _startTicker() {
    _tickerTimer?.cancel();
    _tickerTimer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (_activeStatus != null) {
        if (_activeStatus!.isExpired) {
          clearActiveStatus();
        } else {
          notifyListeners();
        }
      }
    });
  }

  // Activate Status manually
  Future<void> activateStatus({
    required StatusModel status,
    required int durationMinutes,
  }) async {
    final nowMs = DateTime.now().millisecondsSinceEpoch;
    final endMs = nowMs + (durationMinutes * 60 * 1000);

    _activeStatus = ActiveStatusModel(
      status: status,
      startTimeMs: nowMs,
      endTimeMs: endMs,
      isManual: true,
    );

    await _storage.saveActiveStatus(_activeStatus!);

    // Start Foreground Notification
    await ForegroundServiceManager.startService(
      statusTitle: '${status.emoji} ${status.name} Active',
      statusMessage: 'NowNot is auto-replying to missed calls',
    );

    notifyListeners();
  }

  // Clear Active Status
  Future<void> clearActiveStatus() async {
    _activeStatus = null;
    await _storage.clearActiveStatus();
    await ForegroundServiceManager.stopService();
    notifyListeners();
  }

  // Create or Update Custom Status
  Future<void> saveStatus(StatusModel status) async {
    final index = _statuses.indexWhere((s) => s.id == status.id);
    if (index >= 0) {
      _statuses[index] = status;
    } else {
      _statuses.add(status);
    }
    await _storage.saveStatuses(_statuses);
    notifyListeners();
  }

  // Delete Custom Status
  Future<void> deleteStatus(String statusId) async {
    _statuses.removeWhere((s) => s.id == statusId);
    await _storage.saveStatuses(_statuses);
    notifyListeners();
  }

  // Update Group Message for Active/Default Status
  Future<void> updateGroupMessage(String groupKey, String newMessage) async {
    if (_activeStatus != null) {
      final updatedGroupMsgs = Map<String, String>.from(_activeStatus!.status.groupMessages);
      updatedGroupMsgs[groupKey] = newMessage;

      final updatedStatus = StatusModel(
        id: _activeStatus!.status.id,
        name: _activeStatus!.status.name,
        emoji: _activeStatus!.status.emoji,
        defaultDurationMinutes: _activeStatus!.status.defaultDurationMinutes,
        isSystem: _activeStatus!.status.isSystem,
        groupMessages: updatedGroupMsgs,
      );

      _activeStatus = ActiveStatusModel(
        status: updatedStatus,
        startTimeMs: _activeStatus!.startTimeMs,
        endTimeMs: _activeStatus!.endTimeMs,
        isManual: _activeStatus!.isManual,
      );

      await _storage.saveActiveStatus(_activeStatus!);
      await saveStatus(updatedStatus);
    } else if (_statuses.isNotEmpty) {
      final firstStatus = _statuses.first;
      final updatedGroupMsgs = Map<String, String>.from(firstStatus.groupMessages);
      updatedGroupMsgs[groupKey] = newMessage;

      final updatedStatus = StatusModel(
        id: firstStatus.id,
        name: firstStatus.name,
        emoji: firstStatus.emoji,
        defaultDurationMinutes: firstStatus.defaultDurationMinutes,
        isSystem: firstStatus.isSystem,
        groupMessages: updatedGroupMsgs,
      );

      await saveStatus(updatedStatus);
    }
    notifyListeners();
  }

  // Handle Missed Call Event
  Future<void> onMissedCallDetected({
    required String phoneNumber,
    String contactName = 'Unknown Caller',
  }) async {
    // 1. Invariant: Check if Active Status exists and is valid
    if (_activeStatus == null || _activeStatus!.isExpired) {
      return; // Do nothing if no active status
    }

    // 2. Identify Contact Group Tag
    final groupTag = _contactGroups[phoneNumber] ?? 'Unknown';

    // 3. Extract Group Message
    final message = _activeStatus!.status.groupMessages[groupTag] ??
        _activeStatus!.status.groupMessages['Unknown'] ??
        'I am currently away. (Sent via NowNot)';

    // 4. Dispatch SMS
    final sentSuccess = await _smsService.sendSms(
      recipient: phoneNumber,
      message: message,
    );

    // 5. Create Call Log Record
    final log = CallLogModel(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      phoneNumber: phoneNumber,
      contactName: contactName,
      groupTag: groupTag,
      messageSent: message,
      timestampMs: DateTime.now().millisecondsSinceEpoch,
      autoReplied: sentSuccess,
    );

    await _storage.addCallLog(log);
    _callLogs = _storage.getCallLogs();
    notifyListeners();
  }

  // Assign Contact to Group
  Future<void> setContactGroup(String phoneNumber, String groupTag) async {
    await _storage.setContactGroup(phoneNumber, groupTag);
    _contactGroups = _storage.getContactGroups();
    notifyListeners();
  }

  @override
  void dispose() {
    _tickerTimer?.cancel();
    super.dispose();
  }
}
