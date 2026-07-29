import 'package:flutter_foreground_task/flutter_foreground_task.dart';

class ForegroundServiceManager {
  static void initService() {
    FlutterForegroundTask.init(
      androidNotificationOptions: AndroidNotificationOptions(
        channelId: 'nownot_foreground_service',
        channelName: 'NowNot Active Status Service',
        channelDescription: 'Maintains background call listener and availability status',
        channelImportance: NotificationChannelImportance.LOW,
        priority: NotificationPriority.LOW,
      ),
      iosNotificationOptions: const IOSNotificationOptions(
        showNotification: true,
        playSound: false,
      ),
      foregroundTaskOptions: ForegroundTaskOptions(
        eventAction: ForegroundTaskEventAction.repeat(5000),
        autoRunOnBoot: true,
        allowWakeLock: true,
        allowWifiLock: false,
      ),
    );
  }

  static Future<bool> startService({
    required String statusTitle,
    required String statusMessage,
  }) async {
    if (await FlutterForegroundTask.isRunningService) {
      final res = await FlutterForegroundTask.updateService(
        notificationTitle: statusTitle,
        notificationText: statusMessage,
      );
      return res.toString().contains('success');
    } else {
      final res = await FlutterForegroundTask.startService(
        notificationTitle: statusTitle,
        notificationText: statusMessage,
        callback: startCallback,
      );
      return res.toString().contains('success');
    }
  }

  static Future<bool> stopService() async {
    final res = await FlutterForegroundTask.stopService();
    return res.toString().contains('success');
  }
}

@pragma('vm:entry-point')
void startCallback() {
  FlutterForegroundTask.setTaskHandler(NowNotTaskHandler());
}

class NowNotTaskHandler extends TaskHandler {
  @override
  Future<void> onStart(DateTime timestamp, TaskStarter starter) async {}

  @override
  Future<void> onRepeatEvent(DateTime timestamp) async {}

  @override
  Future<void> onDestroy(DateTime timestamp, bool isTimeout) async {}
}
