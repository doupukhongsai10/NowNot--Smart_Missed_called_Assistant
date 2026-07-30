import 'dart:convert';
import 'package:flutter/foundation.dart';
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

  final SharedPreferences? _prefs;
  final Map<String, String> _memoryCache = {};

  StorageService(this._prefs);

  static Future<StorageService> init() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      return StorageService(prefs);
    } catch (e) {
      debugPrint('SharedPreferences init fallback: $e');
      return StorageService(null);
    }
  }

  String? _getString(String key) {
    if (_prefs != null) {
      try {
        return _prefs.getString(key);
      } catch (_) {}
    }
    return _memoryCache[key];
  }

  Future<void> _setString(String key, String value) async {
    _memoryCache[key] = value;
    if (_prefs != null) {
      try {
        await _prefs.setString(key, value);
      } catch (_) {}
    }
  }

  Future<void> _remove(String key) async {
    _memoryCache.remove(key);
    if (_prefs != null) {
      try {
        await _prefs.remove(key);
      } catch (_) {}
    }
  }

  // Statuses
  List<StatusModel> getStatuses() {
    final jsonString = _getString(_kStatusesKey);
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
    await _setString(_kStatusesKey, encoded);
  }

  // Active Status
  ActiveStatusModel? getActiveStatus() {
    final jsonString = _getString(_kActiveStatusKey);
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
    await _setString(_kActiveStatusKey, encoded);
  }

  Future<void> clearActiveStatus() async {
    await _remove(_kActiveStatusKey);
  }

  // Schedules
  List<ScheduleModel> getSchedules() {
    final jsonString = _getString(_kSchedulesKey);
    if (jsonString == null || jsonString.isEmpty) return [];
    final List<dynamic> decoded = jsonDecode(jsonString);
    return decoded.map((e) => ScheduleModel.fromJson(e)).toList();
  }

  Future<void> saveSchedules(List<ScheduleModel> schedules) async {
    final encoded = jsonEncode(schedules.map((e) => e.toJson()).toList());
    await _setString(_kSchedulesKey, encoded);
  }

  // Call Logs
  List<CallLogModel> getCallLogs() {
    final jsonString = _getString(_kCallLogsKey);
    if (jsonString == null || jsonString.isEmpty) return [];
    final List<dynamic> decoded = jsonDecode(jsonString);
    return decoded.map((e) => CallLogModel.fromJson(e)).toList();
  }

  Future<void> saveCallLogs(List<CallLogModel> logs) async {
    final encoded = jsonEncode(logs.map((e) => e.toJson()).toList());
    await _setString(_kCallLogsKey, encoded);
  }

  Future<void> addCallLog(CallLogModel log) async {
    final current = getCallLogs();
    current.insert(0, log);
    await saveCallLogs(current);
  }

  // Contact Groups Mapping
  Map<String, String> getContactGroups() {
    final jsonString = _getString(_kContactGroupsKey);
    if (jsonString == null || jsonString.isEmpty) return {};
    return Map<String, String>.from(jsonDecode(jsonString));
  }

  Future<void> setContactGroup(String phoneNumber, String groupTag) async {
    final current = getContactGroups();
    current[phoneNumber] = groupTag;
    await _setString(_kContactGroupsKey, jsonEncode(current));
  }
}
