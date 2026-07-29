import 'package:telephony/telephony.dart';

typedef CallStateCallback = void Function(CallState state, String? incomingNumber);

class CallListenerService {
  final Telephony _telephony = Telephony.instance;
  String? _lastRingingNumber;
  int? _lastRingingTimeMs;

  void startListening(CallStateCallback onCallStateChanged) {
    _telephony.listenIncomingSms(
      onNewMessage: (SmsMessage message) {},
      listenInBackground: false,
    );
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
      // If it rang within the last 45 seconds and wasn't answered, it's a missed call!
      if (_lastRingingTimeMs != null && (now - _lastRingingTimeMs!) < 45000) {
        onMissedCall(_lastRingingNumber!);
      }
      _lastRingingNumber = null;
      _lastRingingTimeMs = null;
    }
  }
}
