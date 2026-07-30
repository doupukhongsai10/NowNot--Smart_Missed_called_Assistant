class CallLogModel {
  final String id;
  final String phoneNumber;
  final String contactName;
  final String groupTag; // Family, Friends, Work, Unknown
  final String messageSent;
  final int timestampMs;
  final bool autoReplied;

  CallLogModel({
    required this.id,
    required this.phoneNumber,
    required this.contactName,
    required this.groupTag,
    required this.messageSent,
    required this.timestampMs,
    required this.autoReplied,
  });

  String get callerName => contactName;
  String get callerGroup => groupTag;
  DateTime get timestamp => DateTime.fromMillisecondsSinceEpoch(timestampMs);

  Map<String, dynamic> toJson() => {
    'id': id,
    'phoneNumber': phoneNumber,
    'contactName': contactName,
    'groupTag': groupTag,
    'messageSent': messageSent,
    'timestampMs': timestampMs,
    'autoReplied': autoReplied,
  };

  factory CallLogModel.fromJson(Map<String, dynamic> json) => CallLogModel(
    id: json['id'] ?? '',
    phoneNumber: json['phoneNumber'] ?? '',
    contactName: json['contactName'] ?? 'Unknown Caller',
    groupTag: json['groupTag'] ?? 'Unknown',
    messageSent: json['messageSent'] ?? '',
    timestampMs: json['timestampMs'] ?? DateTime.now().millisecondsSinceEpoch,
    autoReplied: json['autoReplied'] ?? false,
  );
}
