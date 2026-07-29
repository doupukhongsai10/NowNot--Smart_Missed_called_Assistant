import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/status_model.dart';
import '../models/active_status_model.dart';
import '../models/schedule_model.dart';
import '../models/call_log_model.dart';

class StorageService {
  static const String _kStatusesKey = 'nownot_statuses';
  static const String _kActiveStatusKey = 'nownot_active_status';
  static const String _kSchedulesKey = 'nownot_schedules';
  static const String _kCallLogsKey = 'nownot_call_logs';
  static const String _kContactGroupsKey = 'nownot_contact_groups';

  final SharedPreferences _prefs;

  StorageService(this._prefs);

  static Future<StorageService> init() async {
    final prefs = await SharedPreferences.getInstance();
    return StorageService(prefs);
  }

  // Statuses
  List<StatusModel> getStatuses() {
    final jsonString = _prefs.getString(_kStatusesKey);
    if (jsonString == null || jsonString.isEmpty) {
      final defaults = StatusModel.defaultStatuses;
      saveStatuses(defaults);
      return defaults;
    }
    final List<dynamic> decoded = jsonDecode(jsonString);
    return decoded.map((e) => StatusModel.fromJson(e)).toList();
  }

  Future<void> saveStatuses(List<StatusModel> statuses) async {
    final encoded = jsonEncode(statuses.map((e) => e.toJson()).toList());
    await _prefs.setString(_kStatusesKey, encoded);
  }

  // Active Status
  ActiveStatusModel? getActiveStatus() {
    final jsonString = _prefs.getString(_kActiveStatusKey);
    if (jsonString == null || jsonString.isEmpty) return null;
    try {
      final decoded = jsonDecode(jsonString);
      final active = ActiveStatusModel.fromJson(decoded);
      if (active.isExpired) {
        clearActiveStatus();
        return null;
      }
      return active;
    } catch (_) {
      return null;
    }
  }

  Future<void> saveActiveStatus(ActiveStatusModel activeStatus) async {
    final encoded = jsonEncode(activeStatus.toJson());
    await _prefs.setString(_kActiveStatusKey, encoded);
  }

  Future<void> clearActiveStatus() async {
    await _prefs.remove(_kActiveStatusKey);
  }

  // Schedules
  List<ScheduleModel> getSchedules() {
    final jsonString = _prefs.getString(_kSchedulesKey);
    if (jsonString == null || jsonString.isEmpty) return [];
    final List<dynamic> decoded = jsonDecode(jsonString);
    return decoded.map((e) => ScheduleModel.fromJson(e)).toList();
  }

  Future<void> saveSchedules(List<ScheduleModel> schedules) async {
    final encoded = jsonEncode(schedules.map((e) => e.toJson()).toList());
    await _prefs.setString(_kSchedulesKey, encoded);
  }

  // Call Logs
  List<CallLogModel> getCallLogs() {
    final jsonString = _prefs.getString(_kCallLogsKey);
    if (jsonString == null || jsonString.isEmpty) return [];
    final List<dynamic> decoded = jsonDecode(jsonString);
    return decoded.map((e) => CallLogModel.fromJson(e)).toList();
  }

  Future<void> saveCallLogs(List<CallLogModel> logs) async {
    final encoded = jsonEncode(logs.map((e) => e.toJson()).toList());
    await _prefs.setString(_kCallLogsKey, encoded);
  }

  Future<void> addCallLog(CallLogModel log) async {
    final current = getCallLogs();
    current.insert(0, log);
    await saveCallLogs(current);
  }

  // Contact Groups Mapping
  Map<String, String> getContactGroups() {
    final jsonString = _prefs.getString(_kContactGroupsKey);
    if (jsonString == null || jsonString.isEmpty) return {};
    return Map<String, String>.from(jsonDecode(jsonString));
  }

  Future<void> setContactGroup(String phoneNumber, String groupTag) async {
    final current = getContactGroups();
    current[phoneNumber] = groupTag;
    await _prefs.setString(_kContactGroupsKey, jsonEncode(current));
  }
}
