class ScheduleModel {
  final String id;
  final String statusId;
  final String startTime; // "22:00"
  final String endTime;   // "07:00"
  final List<int> days;   // [1,2,3,4,5] (1 = Monday, 7 = Sunday)
  final bool isEnabled;

  ScheduleModel({
    required this.id,
    required this.statusId,
    required this.startTime,
    required this.endTime,
    required this.days,
    this.isEnabled = true,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'statusId': statusId,
    'startTime': startTime,
    'endTime': endTime,
    'days': days,
    'isEnabled': isEnabled,
  };

  factory ScheduleModel.fromJson(Map<String, dynamic> json) => ScheduleModel(
    id: json['id'] ?? '',
    statusId: json['statusId'] ?? '',
    startTime: json['startTime'] ?? '22:00',
    endTime: json['endTime'] ?? '07:00',
    days: List<int>.from(json['days'] ?? []),
    isEnabled: json['isEnabled'] ?? true,
  );
}
