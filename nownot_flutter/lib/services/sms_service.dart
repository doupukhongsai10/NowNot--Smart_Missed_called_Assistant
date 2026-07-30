import 'package:flutter/foundation.dart';
import 'package:telephony/telephony.dart';

class SmsService {
  Future<bool> sendSms({
    required String recipient,
    required String message,
  }) async {
    if (kIsWeb) {
      debugPrint('SMS auto-reply simulated on Web: $recipient -> "$message"');
      return true;
    }
    try {
      final telephony = Telephony.instance;
      final bool? permissionsGranted = await telephony.requestPhoneAndSmsPermissions;
      if (permissionsGranted == true) {
        await telephony.sendSms(
          to: recipient,
          message: message,
          isMultipart: true,
        );
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }
}
