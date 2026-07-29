import 'status_model.dart';

class ActiveStatusModel {
  final StatusModel status;
  final int startTimeMs;
  final int endTimeMs;
  final bool isManual;

  ActiveStatusModel({
    required this.status,
    required this.startTimeMs,
    required this.endTimeMs,
    required this.isManual,
  });

  bool get isExpired => DateTime.now().millisecondsSinceEpoch >= endTimeMs;

  double get progress {
    final now = DateTime.now().millisecondsSinceEpoch;
    if (now >= endTimeMs) return 1.0;
    if (now <= startTimeMs) return 0.0;
    final total = endTimeMs - startTimeMs;
    final elapsed = now - startTimeMs;
    return (elapsed / total).clamp(0.0, 1.0);
  }

  int get remainingSeconds {
    final now = DateTime.now().millisecondsSinceEpoch;
    if (now >= endTimeMs) return 0;
    return ((endTimeMs - now) / 1000).ceil();
  }

  Map<String, dynamic> toJson() => {
    'status': status.toJson(),
    'startTimeMs': startTimeMs,
    'endTimeMs': endTimeMs,
    'isManual': isManual,
  };

  factory ActiveStatusModel.fromJson(Map<String, dynamic> json) => ActiveStatusModel(
    status: StatusModel.fromJson(json['status']),
    startTimeMs: json['startTimeMs'] ?? 0,
    endTimeMs: json['endTimeMs'] ?? 0,
    isManual: json['isManual'] ?? true,
  );
}
