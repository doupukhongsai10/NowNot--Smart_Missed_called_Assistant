import 'package:flutter/foundation.dart';
import 'package:telephony/telephony.dart';

typedef CallStateCallback = void Function(CallState state, String? incomingNumber);

class CallListenerService {
  String? _lastRingingNumber;
  int? _lastRingingTimeMs;

  void startListening(CallStateCallback onCallStateChanged) {
    if (kIsWeb) return;
    try {
      final telephony = Telephony.instance;
      telephony.listenIncomingSms(
        onNewMessage: (SmsMessage message) {},
        listenInBackground: false,
      );
    } catch (_) {}
  }

  void handlePhoneStateChange({
    required String stateStr,
    required String? incomingNumber,
    required Function(String number) onMissedCall,
  }) {
    if (stateStr == 'RINGING') {
      _lastRingingNumber = incomingNumber;
      _lastRingingTimeMs = DateTime.now().millisecondsSinceEpoch;
    } else if (stateStr == 'OFFHOOK') {
      // Call was answered!
      _lastRingingNumber = null;
      _lastRingingTimeMs = null;
    } else if (stateStr == 'IDLE' && _lastRingingNumber != null) {
      final now = DateTime.now().millisecondsSinceEpoch;
      if (_lastRingingTimeMs != null && (now - _lastRingingTimeMs!) < 45000) {
        onMissedCall(_lastRingingNumber!);
      }
      _lastRingingNumber = null;
      _lastRingingTimeMs = null;
    }
  }
}
