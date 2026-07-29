import 'package:telephony/telephony.dart';

class SmsService {
  final Telephony _telephony = Telephony.instance;

  Future<bool> sendSms({
    required String recipient,
    required String message,
  }) async {
    try {
      final bool? permissionsGranted = await _telephony.requestPhoneAndSmsPermissions;
      if (permissionsGranted == true) {
        await _telephony.sendSms(
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
